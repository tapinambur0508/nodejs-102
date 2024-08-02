import { Student } from '../models/student.js';

export function getStudents() {
  return Student.find();
}

export function getStudent(studentId) {
  return Student.findById(studentId);
}

export function createStudent(payload) {
  return Student.create(payload);
}

export function deleteStudent(studentId) {
  return Student.findByIdAndDelete(studentId);
}

export function updateStudent(studentId, payload) {
  return Student.findByIdAndUpdate(studentId, payload, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });
}

export function changeStudentDuty(studentId, duty) {
  return Student.findByIdAndUpdate(studentId, { onDuty: duty }, { new: true });
}
