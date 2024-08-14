import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    onDuty: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Student = mongoose.model('Student', studentSchema); // Student -> (to lower case) -> student -> (plural) -> students

export { Student };
