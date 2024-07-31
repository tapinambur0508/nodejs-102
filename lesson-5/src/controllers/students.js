import createHttpError from 'http-errors';

import { getStudents, getStudent } from '../services/students.js';

export async function getStudentsController(req, res) {
  const students = await getStudents();

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
