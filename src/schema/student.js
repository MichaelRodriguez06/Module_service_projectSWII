import mongoose from "mongoose";

const Schema = mongoose.Schema;

const StudentScheme = new Schema({
    id_student: Number,
    number_document: Number,
    type_document: String,
    name_student: String,
    lastname_student: String,
    code_student: Number,
    status: {
        tipo: Boolean,
        default: false
    }
});

export default mongoose.model('student', StudentScheme);
