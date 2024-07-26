import 'dotenv/config';

import express from 'express';

import { initDBConnection } from './db.js';

import { Student } from './models/student.js';

const app = express();

app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();

    res.send({ status: 200, data: students });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.get('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (student === null) {
      return res
        .status(404)
        .send({ status: 404, message: 'Student not found' });
    }

    res.send({ status: 200, data: student });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

async function bootstrap() {
  try {
    await initDBConnection();

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
