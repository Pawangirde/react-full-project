const mongoose = require("mongoose");

const employeeDetailsSchema = new mongoose.Schema(
  {
    employeeId: String,
    name: String,
    role: String,
    department: String,
    location: String,
    email: String,
    phone: String,
    skills: [String],
    experience: Number,
  },
  {
    collection: "employeeDetails", // 👈 IMPORTANT
  }
);

module.exports = mongoose.model("employeeDetails", employeeDetailsSchema);
