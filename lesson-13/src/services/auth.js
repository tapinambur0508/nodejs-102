import fs from 'node:fs';
import path from 'node:path';

import crypto from 'node:crypto';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

import { sendMail } from '../utils/sendEmail.js';
import { validateCode } from '../utils/googleOAuth2.js';

import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  SMTP,
} from '../constants/index.js';

export async function registerUser(payload) {
  const maybeUser = await User.findOne({ email: payload.email });

  if (maybeUser !== null) {
    throw createHttpError(409, 'Email already in user');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const maybeUser = await User.findOne({ email });

  if (maybeUser === null) {
    throw createHttpError(404, 'User not found');
  }

  const isMatch = await bcrypt.compare(password, maybeUser.password);

  if (isMatch === false) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteOne({ userId: maybeUser._id });

  return Session.create({
    userId: maybeUser._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

export function logoutUser(sessionId) {
  return Session.deleteOne({ _id: sessionId });
}

export async function refreshUserSession(sessionId, refreshToken) {
  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  await Session.deleteOne({ _id: sessionId });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

export async function requestResetEmail(email) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  const templateSource = fs.readFileSync(
    path.resolve('src/templates/reset-password.hbs'),
    { encoding: 'UTF-8' },
  );
  const template = handlebars.compile(templateSource);

  const html = template({ name: user.name, resetToken });

  try {
    await sendMail({
      from: SMTP.FROM_EMAIL,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(500, 'Cannot send email');
  }
}

export async function resetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    const user = await User.findOne({ _id: decoded.sub, email: decoded.email });

    if (user === null) {
      throw createHttpError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { _id: user._id },
      { password: hashedPassword },
    );
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token error');
    }

    throw error;
  }
}

export async function loginOrRegisterWithGoogle(code) {
  const ticket = await validateCode(code);

  const payload = ticket.getPayload();

  if (typeof payload === 'undefined') {
    throw createHttpError(401, 'Unauthorized');
  }

  const user = await User.findOne({ email: payload.email });

  const password = await bcrypt.hash(
    crypto.randomBytes(30).toString('base64'),
    10,
  );

  if (user === null) {
    const createdUser = await User.create({
      email: payload.email,
      name: payload.name,
      password,
    });

    return Session.create({
      userId: createdUser._id,
      accessToken: crypto.randomBytes(30).toString('base64'),
      refreshToken: crypto.randomBytes(30).toString('base64'),
      accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
      refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}
