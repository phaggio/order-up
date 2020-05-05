'use strict';

const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const TimeSchema = new Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      required: true
    },
    employeeName: {
      type: String,
      required: true
    },
    clockIn: {
      type: Date,
      default: Date.now()
    },
    clockOut: {
      type: Date,
      default: null
    },
    onTheClock: {
      type: Boolean,
      default: null
    }
  },
  {
    collection: `Time`
  }
);

module.exports = mongoose.model(`Time`, TimeSchema);
