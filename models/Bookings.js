const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingsSchema = new Schema(
  {
    service_name:{type:String, required:[true,'Service Name is required']},
    firstname: { type: String, required:[true,'firstname is required']},
    lastname:{type:String,required:[true,'lastname is required']},
    email: { type: String, required: [true, 'email is required'], unique: true },
    daterequest: {type:Date},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookings", bookingsSchema);