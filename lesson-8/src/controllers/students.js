import createHttpError from 'http-errors';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

import {
  getStudents,
  getStudent,
  createStudent,
  deleteStudent,
  updateStudent,
  changeStudentDuty,
} from '../services/students.js';

export async function getStudentsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const students = await getStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.send({ status: 200, data: students });
}

export async function getStudentController(req, res, next) {
  const { id } = req.params;

  const student = await getStudent(id);

  if (student === null) {
    // return next(createHttpError(404, "Student not found"));
    // return next(createHttpError[404]("Student not found"));
    return next(createHttpError.NotFound('Student not found'));
  }

  res.send({ status: 200, data: student });
}

export async function createStudentController(req, res) {
  const student = {
    name: req.body.name,
    gender: req.body.gender,
    year: req.body.year,
    email: req.body.email,
  };

  // 1000 lines code

  const createdStudent = await createStudent(student);

  res
    .status(201)
    .send({ status: 201, message: 'Student created', data: createdStudent });
}

export async function deleteStudentController(req, res, next) {
  const { id } = req.params;

  const deletedStudent = await deleteStudent(id);

  if (deletedStudent === null) {
    return next(createHttpError.NotFound('Student not found'));
  }

  res.status(204).end();
}

export async function updateStudentController(req, res, next) {
  const { id } = req.params;

  const student = {
    name: req.body.name,
    gender: req.body.gender,
    year: req.body.year,
    email: req.body.email,
  };

  const updateResult = await updateStudent(id, student);

  if (updateResult.lastErrorObject.updatedExisting === true) {
    return res.send({
      status: 200,
      message: 'Student updated',
      data: updateResult.value,
    });
  }

  res.status(201).send({
    status: 201,
    message: 'Student created',
    data: updateResult.value,
  });
}

export async function changeStudentDutyController(req, res, next) {
  const { id } = req.params;
  const { duty } = req.body;

  const updatedStudent = await changeStudentDuty(id, duty);

  if (updatedStudent === null) {
    return next(createHttpError.NotFound('Student not found'));
  }

  res.send({
    status: 200,
    message: 'Student duty updated',
    data: updatedStudent,
  });
}
