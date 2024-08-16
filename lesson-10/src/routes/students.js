import express from 'express';

import {
  getStudentsController,
  getStudentController,
  createStudentController,
  deleteStudentController,
  updateStudentController,
  changeStudentDutyController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidID } from '../middlewares/isValidID.js';
import { validateBody } from '../middlewares/validateBody.js';
import { studentSchema, studentDutySchema } from '../validation/student.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getStudentsController));

router.get('/:id', isValidID, ctrlWrapper(getStudentController));

router.post(
  '/',
  jsonParser,
  validateBody(studentSchema),
  ctrlWrapper(createStudentController),
);

router.delete('/:id', isValidID, ctrlWrapper(deleteStudentController));

router.put(
  '/:id',
  isValidID,
  jsonParser,
  validateBody(studentSchema),
  ctrlWrapper(updateStudentController),
);

router.patch(
  '/:id/duty',
  isValidID,
  jsonParser,
  validateBody(studentDutySchema),
  ctrlWrapper(changeStudentDutyController),
);

export default router;
