const mongoose = require("mongoose");
const { Schema } = mongoose;

const servicesSchema = new Schema(
    {
        service_name: { type: String, required: [true, 'Service Name is required'] },
        Price: { type: Number, required: [true, 'Price is required'] }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Services", servicesSchema);