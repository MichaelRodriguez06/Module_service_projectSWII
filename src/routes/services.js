import express from "express";

const router = express.Router();

import Student from "../schema/student.js";
import Subject from "../schema/subject.js";
import Inscription from "../schema/inscription.js";




router.get('/', async (req, res) => {
    //Aqui estoy recogiendo los datos del servidor
    // const tasks_db = await Student.find();
    // console.log(tasks_db);
    res.send("Hola");

});



export default router;