import express from "express";

const router = express.Router();

import Student from "../schema/student.js";
import Subject from "../schema/services_schema.js";
import Inscription from "../schema/inscription.js";
import * as Console from "console";
import ServiceSchema from "../schema/services_schema.js";


/**
 Get para mostrar las tres colecciones (Estudiantes, Materias e Inscripciones)
 **/
router.get('/showData', async (req, res) => {
    const students = await Student.find();
    const subjects = await Subject.find();
    const inscriptions = await Inscription.find();
    res.send("Students:" + students);
    res.send("subjects" + subjects);
    res.send("inscriptions" + inscriptions);
});

/***
 * Metodo que retorna una lista de todos los servicios del sistema
 * mediante la ruta /listar_servicios o /listar_servicios/
 */
router.get('/listar_servicios/' || '/listar_servicios', async (req, res) => {
    const services = await ServiceSchema.find();
    res.status(200).json({services})
});

/**
 * GET:
 *  Obtiene el ultimo estudiante guardado en la base de datos usando
 *  la URL /show/last_saved_student
 **/
router.get("/show/last_saved_student", async (req, res) => {
    const listStudent = await Student.find();
    let lastStudent = "";
    listStudent.forEach(function (element) {
        lastStudent = element;
        console.log(lastStudent);
    });

    res.status(200).send("GET:lastStudent:" + lastStudent);
});

/***
 * Obtener datos de un estudiantes apartir de su numero de documento y tipo de documento
 */
router.get('/getStudent/', async (req, res) => {
    console.log(req.body);
    const students = await Student.find();
    let student = null;
    const paramForSearch = req.body.number_document + req.body.type_document;
    students.forEach(function (element) {
        if (paramForSearch == (element.number_document + element.type_document)) {
            student = element.toString();
            res.status(200).json({
                code: 200,
                message: 'Estudiante encontrado',
                details: 'Estudiante: ' + element
            });
        }
    });
    if (student == null) {
        res.status(404).json({
            code: 404,
            message: 'No se encuentra el estudiante',
            details: 'El estudiante con el codigo: ' + paramForSearch + ' no se encuentra en la base de datos'
        });
    }
});

/***
 * Get Inscription
 */
router.get('/getInscription/', async (req, res) => {
    const inscriptions = await Inscription.find();
    let inscription = null;
    let id_inscription = req.body.id_inscription;
    inscriptions.forEach(function (element) {
        if (id_inscription == element.id_inscription) {
            inscription = element.toString();
            res.status(200).json({
                code: 200,
                message: 'Inscripcion encontrada',
                details: 'Incripcion: ' + element.toString()
            });
        }
    });
    if (inscription == null)
        res.status(404).json({
            code: 404,
            message: 'No se encuentra la inscripcion',
            details: 'La inscripcion: ' + id_inscription + ' no se encuentra en la base de datos'
        });

});


/***
 * Metodo que retorna la información de un servicio de limpieza según id del servicio.
 */
 router.get('/buscar_servicio/', async (req, res) => {
    const services = await ServiceSchema.find();
    let service = null;
    let id_service = req.body.id_service;
    services.forEach(function (element) {
        if (id_service == element.id_service) {
            service = element.toString();
            res.status(200).json({
                code: 200,
                message: 'Servicio de limpieza encontrado',
                details: 'Servicio: ' + element.toString()
            });
        }
    });
    if (service == null)
        res.status(404).json({
            code: 404,
            message: 'No se encuentra el servicio de limpieza',
            details: 'El servicio de limpieza ' + id_service + '. No se encuentra en la base de datos'
        });

});

/***
 * Metodo que retorna la información de los servicios de limpieza asociados al id de un cliente
 */
 router.get('/listar_servicios_cliente/', async (req, res) => {
    const services = await ServiceSchema.find({id_client: req.body.id_client});
    res.status(200).json({services})
});

/***
 *  Obtener datos de una materia apartir de un ID de la materia
 */
router.get('/getSubject/', async (req, res) => {
    const subjects = await Subject.find();
    let subject = null;
    subjects.forEach(function (element) {
        if (req.body.id_subject == element.id_subject) {
            subject = element.toString();
            res.status(200).json({
                code: 200,
                message: 'Materia encontrada',
                details: 'Materia encontrada: ' + element
            })
        }
    });
    if (subject == null) {
        res.status(404).json({
            code: 404,
            message: 'Materia no encontrada',
            details: 'Materia con el codigo ' + req.body.id_subject + ' no se encuentra'
        });
    }
});


/***
 * ------------------------------------- END GET ------------------------------
 */


/***
 * Metodos PUT
 */

/***
 * PUT Materia
 *  Actualiza los datos de una materia, a excepcion del ID
 */
router.put('/put/subject/', async (req, res) => {
    try {
        const listSubjects = await Subject.find();
        let paramForSearch = Number(req.body.id_subject);
        let newSubject = null;
        listSubjects.forEach(function (element) {
            if (element.id_subject == paramForSearch) {
                element.name_subject = req.body.name_subject;
                element.code_subject = req.body.code_subject;
                element.quotas = req.body.quotas;
                element.status = req.body.status;
                console.log(element.toString());
                newSubject = new Subject(element);
                res.status(200).json({
                    code: 200,
                    message: 'Actualizacacion satisfactoria',
                    details: 'Actualizacion: ' + newSubject.toString()
                });
            }
        });
        if (newSubject == null)
            res.status(404).json({
                code: 404,
                message: 'No se encontro materia',
                details: 'La materia con codigo: ' + paramForSearch + ' no se encuentra en la base de datos'
            });
        else
            await newSubject.save();

    } catch (error) {
        res.status(400).json({
            code: 400,
            message: 'No se puede tramitar la solicitud',
            details: error.toString()
        });
    }

});

/***
 * PUT Estudiante
 *
 * Buscar el estudiante por numero de identificacion + tipo de documento
 *
 */
router.put('/put/student/', async (req, res) => {
    try {
        const listStudent = await Student.find();
        let newStudent = null;
        let paramForSearch = req.body.number_document + req.body.type_document;
        listStudent.forEach(function (element) {
            if ((element.number_document + element.type_document) == (paramForSearch)) {
                element.type_document = req.body.new_type_document;
                element.name_student = req.body.name_student;
                element.lastname_student = req.body.lastname_student;
                element.code_student = req.body.code_student;
                element.status = {tipo: req.body.status}
                newStudent = new Student(element);
                res.status(200).json({
                    code: 200,
                    message: "Estudiante actualizado correctamente",
                    details: 'Estudiante actualizado ' + newStudent
                });
            }
        });
        if (newStudent == null)
            res.status(404).json({
                code: 404,
                message: 'No se encontro al estudiante',
                details: 'El estudiante con el codigo ' + paramForSearch + ' no se encuentra en la base de datos'
            });
        else
            await newStudent.save();
    } catch (error) {
        console.log(error.toString());
        res.status(400).json({
            code: 400,
            message: 'No se puede tramitar la solicitud',
            details: error.toString()
        });
    }

});

/***
 * PUT Inscripcion
 */
router.put('/put/inscription/', async (req, res) => {
    try {
        const listInscriptions = await Inscription.find();
        let id_inscription = req.body.id_inscription;
        let newInscription = null;
        listInscriptions.forEach(function (element) {
            if (element.id_inscription == id_inscription) {
                element.id_student = req.body.id_student;
                element.id_subject = req.body.id_subject;
                console.log(element.toString());
                newInscription = new Inscription(element);
                res.status(200).json({
                    code: 200,
                    message: 'Inscripcion actualizada correctamente',
                    details: 'Inscripcion actualizada: ' + newInscription
                });
            }
        });
        if (newInscription == null) {
            res.status(404).json({
                code: 404,
                message: 'No se encuentra la inscripcion',
                details: 'La inscripcion: ' + id_inscription + ' no se encuentra en la base de datos'
            });
        } else
            await newInscription.save();

    } catch (error) {
        res.status(400).json({
            code: 400,
            message: 'Bad request',
            details: 'Error en la consulta: ' + error.toString()
        });
    }
});

/***
 * ---------------------------------------- END PUTS------------------------------------------
 */


/***
 * Servicios PATCH
 */

/***
 * Patch Student
 */
router.patch("/confirmar/student/", async (req, res) => {
    let body = req.body;
    Student.updateOne({id_student: body.id_student}, {status: {tipo: body.status}},
        function (error, info) {
            if (error) {
                res.json({
                    code: 400,
                    msg: 'Bad request'
                });
            } else if (info.matchedCount >= 1) {
                res.json({
                    code: 200,
                    msg: 'status change',
                    info: info
                });
            } else {
                res.json({
                    code: 404,
                    msg: 'Not Found'
                });
            }
        }
    );

});
/***
 * Patch Subject
 * Actualiza el estado de una materia
 */
router.patch("/confirmar/service", async (req, res) => {


});

/***
 * Patch Subject-quota
 * Actualiza el numero de cupos de una materia
 */

router.patch("/confirmar/service/quota", async (req, res) => {
    let body = req.body;
    Subject.updateOne({id_subject: body.id_subject}, {quotas: body.quota},
        function (error, info) {
            if (error) {
                res.json({
                    code: 400,
                    msg: 'Bad request'
                });
            } else if (info.matchedCount >= 1) {
                res.json({
                    code: 200,
                    msg: 'quota change',
                    info: info
                });
            } else {
                res.json({
                    code: 404,
                    msg: 'Not Found'
                });
            }
        }
    );
});


//-----------------------------END PATCH ------------------------


//--------------------------POST---------------------------------- //
/**
 ** POST "/add/student/:id_student/:number_document/:type_document/:name_student/:lastname_student/:code_student"
 ** Servicio de insertar a la DB un estudiante.
 **/

router.post("/add/student/:id_student/:number_document/:type_document/:name_student/:lastname_student/:code_student", async (req, res) => {
    try {
        const infoServicio = req.params;
        console.log("Aqui llegan los parametros" + infoServicio);
        const listStudent = await Student.find();
        if (checkStudent(infoServicio, listStudent)) {
            //const student = new Student({"id_student": infoServicio.id_student,"number_document": infoServicio.number_document,"type_document": '"'+infoServicio.type_document+'"',"name_student": '"'+infoServicio.name_student+'"',"lastname_student": '"'+infoServicio.lastname_student+'"',"code_student": infoServicio.code_student,"status": "true"});
            const student = new Student(infoServicio);
            console.log("Aqui se crea el estudiante:" + student);
            res.status(200).json({
                code: 200,
                message: 'Saved Student' + await student.save(),
                details: 'Estudiante registrado: ' + infoServicio
            });
        } else {
            res.status(409).json({
                code: 409,
                message: 'El estudiante ya se encuantra registrado o el codigo del estudiante ya se encuantra asignado',
                details: 'Estudiante posiblemente esta registrado: ' + infoServicio
            });
        }
    } catch (err) {
        console.error(err); //mostramos el error por consola para poder solucionar futuros errores
        res.status(500).send("error"); //en caso de error respondemos al cliente con un 500
        res.status(500).json({
            code: 500,
            message: 'error',
            details: 'error Servidor no disponible '
        });
    }
});
/**
 ** POST "/add/student"
 ** Servicio de insertar a la DB un estudiante. Los parametros los recibe por el body
 **/

router.post("/add/student", async (req, res) => {
    try {
        const infoServicio = req.body;
        console.log("Aqui llegan los parametros" + infoServicio);
        const listStudent = await Student.find();
        if (checkStudent(infoServicio, listStudent)) {
            //const student = new Student({"id_student": infoServicio.id_student,"number_document": infoServicio.number_document,"type_document": '"'+infoServicio.type_document+'"',"name_student": '"'+infoServicio.name_student+'"',"lastname_student": '"'+infoServicio.lastname_student+'"',"code_student": infoServicio.code_student,"status": "true"});
            const student = new Student(infoServicio);
            console.log("Aqui se crea el estudiante:" + student);
            res.status(200).json({
                code: 200,
                message: 'Saved Student' + await student.save(),
                details: 'Estudiante registrado: ' + infoServicio
            });
        } else {
            res.status(409).json({
                code: 409,
                message: 'El estudiante ya se encuantra registrado o el codigo del estudiante ya se encuantra asignado',
                details: 'Estudiante posiblemente esta registrado: ' + infoServicio
            });
        }
    } catch (err) {
        console.error(err); //mostramos el error por consola para poder solucionar futuros errores
        res.status(500).json({
            code: 500,
            message: 'error:' + err,
            details: 'error Servidor no disponible '
        });
    }
});

/**
 ** function checkStudent:
 ** Verifica si un estudiante ya se encuentra registrado en la base de datos.
 ** Return: un boleano que confirma si el estudiante se encuentra o no.
 ** Parametros de entrada:
 student: Representa los datos del estudiante que se quiere insertar en la DB,
 listStudent: Listado de todos lo estudiantes actuales en la DB.
 **/
function checkStudent(student, listStudent) {
    let bolean = true;
    listStudent.forEach(function (element) {
        if (element.name_student == student.name_student && element.lastname_student == student.lastname_student || element.code_student == student.code_student) {
            bolean = false;
        }
    });
    return bolean;
}


/**
 ** POST "/add/subject/:id_subject/:name_subject/:code_subject/:quotas/:status"
 ** Servicio de insertar a la DB una Materia.
 **/

router.post("/add/service/:id_subject/:name_subject/:code_subject/:quotas/:status", async (req, res) => {
    try {
        const infoServicio = req.params;
        console.log("Aqui llegan los parametros" + infoServicio);
        const listSubject = await Subject.find();
        if (checkService(infoServicio, listSubject)) {
            const subject = new Subject(infoServicio);
            console.log("Aqui se crea la Materia:" + subject);
            res.status(200).json({
                code: 200,
                message: 'Saved Subject' + await subject.save(),
                details: 'Estudiante registrado: ' + infoServicio
            });


        } else {
            res.status(409).json({
                code: 409,
                message: 'La Materia ya se encuantra registrada o el codigo de la materia esta ya asignado',
                details: 'Materia posiblemente esta registrado: ' + infoServicio
            });
        }
    } catch (err) {
        console.error(err); //mostramos el error por consola para poder solucionar futuros errores
        res.status(500).json({
            code: 500,
            message: 'error:' + err,
            details: 'error Servidor no disponible '
        });
    }
});
/**
 ** POST "/add/subject/
 ** Parametros :id_subject/:name_subject/:code_subject/:quotas/:status"
 ** Servicio de insertar a la DB una Materia.
 **/

router.post("/add/service/", async (req, res) => {
    try {
        const infoServicio = req.body;
        console.log("Aqui llegan los parametros" + infoServicio);
        const listSubject = await ServiceSchema.find();
        if (checkService(infoServicio, listSubject)) {
            const service = new ServiceSchema(infoServicio);
            console.log("Aqui se crea el servicio:" + service);
            res.status(200).json({
                code: 200,
                message: 'Servicio creado' + await service.save(),
            });
        } else {
            res.status(409).json({
                code: 409,
                message: 'El ya se encuantra registrada o el codigo del servicio esta ya asignado',
                details: 'El servicio posiblemente esta registrado: ' + infoServicio
            });
        }
    } catch (err) {
        console.error(err); //mostramos el error por consola para poder solucionar futuros errores
        res.status(500).json({
            code: 500,
            message: 'error:' + err,
            details: 'error Servidor no disponible '
        });
    }
});

/**
 ** function checkService:
 ** Verifica si una Materia ya se encuentra registrada en la base de datos.
 ** Return: un boleano que confirma si la Materia se encuentra o no.
 ** Parametros de entrada:
 service: Representa los datos de la Materia que se quiere insertar en la DB,
 listServices: Listado de todos lo Materias actuales en la DB.
 **/
function checkService(service, listServices) {
    listServices.forEach(function (element) {
        if (element.id_service === service.id_service)
            return false;

    });
    return true;
}


/**
 ** POST "/add/inscription/:id_inscription/:id_subject/:id_student"
 ** Servicio de insertar a la DB una Inscripcion.
 **/

router.post("/add/inscription/:id_inscription/:id_subject/:id_student", async (req, res) => {
    try {
        const infoServicio = req.params;
        console.log("Aqui llegan los parametros" + infoServicio);
        const listInscription = await Inscription.find();
        if (checkInscription(infoServicio, listInscription)) {
            if (isSubject(infoServicio, await Subject.find())) {
                if (isStudent(infoServicio, await Student.find())) {
                    const inscription = new Inscription(infoServicio);
                    console.log("Aqui se crea la Inscripcion:" + inscription);
                    res.status(200).json({
                        code: 200,
                        message: 'Saved Inscription' + await inscription.save(),
                        details: 'Inscription registrada: ' + infoServicio
                    });
                } else {
                    res.status(415).json({
                        code: 415,
                        message: 'Servidor se niega a recibir una petición por formato de carga',
                        details: 'El Estutiante no existe: ' + infoServicio
                    });
                }
            } else {
                res.status(415).json({
                    code: 415,
                    message: 'Servidor se niega a recibir una petición por formato de carga',
                    details: 'La materia no existe: ' + infoServicio
                });
            }

        } else {
            res.status(409).json({
                code: 409,
                message: 'La Inscripcion ya se encuantra registrada o el id_inscription de la Inscripcion esta ya asignado',
                details: 'Inscripcion posiblemente esta registrada: ' + infoServicio
            });
        }
    } catch (err) {
        console.error(err); //mostramos el error por consola para poder solucionar futuros errores
        res.status(500).json({
            code: 500,
            message: 'error:' + err,
            details: 'error Servidor no disponible '
        });
    }
});

/**
 ** POST "/add/inscription/
 ** Parametros :id_inscription/:id_subject/:id_student"
 ** Servicio de insertar a la DB una Inscripcion.
 **/

router.post("/add/inscription", async (req, res) => {
    try {
        const infoServicio = req.body;
        console.log("Aqui llegan los parametros" + infoServicio);
        const listInscription = await Inscription.find();
        if (checkInscription(infoServicio, listInscription)) {
            if (isSubject(infoServicio, await Subject.find())) {
                if (isStudent(infoServicio, await Student.find())) {
                    const inscription = new Inscription(infoServicio);
                    console.log("Aqui se crea la Inscripcion:" + inscription);
                    res.status(200).json({
                        code: 200,
                        message: 'Saved Inscription' + await inscription.save(),
                        details: 'Inscription registrada: ' + infoServicio
                    });
                } else {
                    res.status(415).json({
                        code: 415,
                        message: 'Servidor se niega a recibir una petición por formato de carga',
                        details: 'El Estutiante no existe: ' + infoServicio
                    });
                }
            } else {
                res.status(415).json({
                    code: 415,
                    message: 'Servidor se niega a recibir una petición por formato de carga',
                    details: 'La materia no existe: ' + infoServicio
                });
            }

        } else {
            res.status(409).json({
                code: 409,
                message: 'La Inscripcion ya se encuantra registrada o el id_inscription de la Inscripcion esta ya asignado',
                details: 'Inscripcion posiblemente esta registrada: ' + infoServicio
            });
        }
    } catch (err) {
        console.error(err); //mostramos el error por consola para poder solucionar futuros errores
        res.status(500).json({
            code: 500,
            message: 'error:' + err,
            details: 'error Servidor no disponible '
        });
    }
});

/**
 ** function checkInscription:
 ** Verifica si una Inscripcion ya se encuentra registrada en la base de datos.
 ** Return: un boleano que confirma si la Inscripcion se encuentra o no.
 ** Parametros de entrada:
 inscription: Representa los datos de la Inscripcion que se quiere insertar en la DB,
 listInscription: Listado de todas las inscripciones actuales en la DB.
 **/
function checkInscription(inscription, listInscription) {
    let bolean = true;
    listInscription.forEach(function (element) {
        if (element.id_inscription == inscription.id_inscription && (element.id_subject == inscription.id_subject || element.id_student == inscription.id_student)) {
            bolean = false;
        }
    });
    return bolean;
}

/**
 ** function isSubject:
 ** Verifica si una Materia si existe en la base de datos.
 ** Return: un boleano que confirma si la Materia  existe.
 ** Parametros de entrada:
 inscription: Representa los datos de la Materia que se quiere insertar en la DB,
 listSubject: Listado de todas las Materias actuales en la DB.
 **/
function isSubject(inscription, listSubject) {
    let bolean = false;
    listSubject.forEach(function (element) {
        if (element.id_subject == inscription.id_subject) {
            bolean = true;
        }
    });
    return bolean;
}

/**
 ** function isStudent:
 ** Verifica si un Estudiante si existe en la base de datos.
 ** Return: un boleano que confirma si la Estudiante  existe.
 ** Parametros de entrada:
 inscription: Representa los datos de la Estudiante que se quiere insertar en la DB,
 listStudent: Listado de todas las Materias actuales en la DB.
 **/
function isStudent(inscription, listStudent) {
    let bolean = false;
    listStudent.forEach(function (element) {
        if (element.id_student == inscription.id_student) {
            bolean = true;
        }
    });
    return bolean;
}

//--------------------------POST- END--------------------------------- //


export default router;