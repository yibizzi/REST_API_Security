import mongoose from "mongoose";


const appoitmentSchema = mongoose.Schema({
    doctorId: ObjectId,
    patienId: ObjectId,
    perception: String,
    date: Date,
    isDone: Boolean,
    price: Number
});


const Appoitment = mongoose.model("Appoitment", appoitmentSchema);

module.exports = Appoitment;
