const { default: mongoose } = require("mongoose");
const userSchema = mongoose.Schema({
  firstName: { type: String, required: [true, "First Name is required"] },
  lastName: String,
  email: {
    type: String,
    required: [true, "email must needed"],
    unique: [true, "email must have unique"],
  },
  password: { type: String, required: [true, "password  is required "] },
  userType: { type: String, enum: ["guest", "host"], default: "guest" },
  favourate: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "homeModel",
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
