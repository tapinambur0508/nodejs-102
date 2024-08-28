import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetEmail,
  resetPassword,
  loginOrRegisterWithGoogle,
} from '../services/auth.js';

import { generateAuthUrl } from '../utils/googleOAuth2.js';

export async function registerController(req, res) {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const registeredUser = await registerUser(payload);

  res.send({ status: 200, message: 'User registered', data: registeredUser });
}

export async function loginController(req, res) {
  const { email, password } = req.body;

  const session = await loginUser(email, password);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Login completed',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutController(req, res) {
  const { sessionId } = req.cookies;

  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).end();
}

export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshUserSession(sessionId, refreshToken);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Refresh completed',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function requestResetEmailController(req, res) {
  const { email } = req.body;

  await requestResetEmail(email);

  res.send({
    status: 200,
    message: 'Reset email was send successfully',
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  const { password, token } = req.body;

  await resetPassword(password, token);

  res.send({
    status: 200,
    message: 'Password reset successfully',
    data: {},
  });
}

export async function getOAuthURLController(req, res) {
  const url = generateAuthUrl();

  res.send({
    status: 200,
    message: 'Successfully get Google OAuth URL',
    data: { url },
  });
}

export async function confirmOAuthController(req, res) {
  const { code } = req.body;

  const session = await loginOrRegisterWithGoogle(code);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Login with Google completed',
    data: {
      accessToken: session.accessToken,
    },
  });
}