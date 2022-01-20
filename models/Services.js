const mongoose = require("mongoose");
const { Schema } = mongoose;

const servicesSchema = new Schema(
    {
        service_name: { type: String, required: [true, 'Service Name is required'] },
        price: { type: Number, required: [true, 'price is required'] }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Services", servicesSchema);