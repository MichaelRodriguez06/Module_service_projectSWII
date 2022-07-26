import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    id_subject: Number,
    name_subject: String,
    code_subject: Number,
    quotas: Number,
    status: {
        tipo: Boolean,
        default: false
    }
});

export default mongoose.model('subject', SubjectSchema);