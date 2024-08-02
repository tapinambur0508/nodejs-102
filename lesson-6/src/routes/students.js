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

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getStudentsController));

router.get('/:id', ctrlWrapper(getStudentController));

router.post('/', jsonParser, ctrlWrapper(createStudentController));

router.delete('/:id', ctrlWrapper(deleteStudentController));

router.put('/:id', jsonParser, ctrlWrapper(updateStudentController));

router.patch('/:id/duty', jsonParser, ctrlWrapper(changeStudentDutyController));

export default router;
