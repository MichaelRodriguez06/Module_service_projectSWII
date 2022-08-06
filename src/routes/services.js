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
    try {
        const services = await ServiceSchema.find();
        res.status(200).json({services})
    } catch (error) {
        res.status(500).json({error});
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
 * Pametros:    id_service (identificador del servicio) ingresa por el header
 */
router.get('/buscar_servicio/' || '/buscar_servicio', async (req, res) => {
    const services = await ServiceSchema.find();
    let service = null;
    let id_service = req.headers.id_service;
    services.forEach(function (element) {
        if (id_service === element.id_service) {
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
    try {
        const services = await ServiceSchema.find({id_client: req.header.id_client});
        res.status(200).json({services});
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "Server internal error:" + error
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
router.put('/agregar_profesional_service/', async (req, res) => {
    try {
        const listServices = await ServiceSchema.find();
        let paramForSearch = Number(req.body.id_service);
        let new_service = null;
        listServices.forEach(function (element) {
            if (element.id_service == paramForSearch) {
                element.id_professional.unshift(req.body.id_professional);
                new_service = new Subject(element);
                res.status(200).json({
                    code: 200,
                    message: 'Profesional agreado al servicio ' + new_service.id_service,
                });
            }
        });
        if (new_service == null)
            res.status(404).json({
                code: 404,
                message: 'El servicio con codigo: ' + paramForSearch + ' no se encuentra en la base de datos',
            });
        else
            await new_service.save();

    } catch (error) {
        res.status(500).json({
            code: 500,
            message: 'Internal server error' + error
        });
    }
});

/***
 * Servicio que cambia el estado del servicio a CONFIRMADO
 * Parametros: id_service (identificador del servicio que se quiere confirmar
 */
router.patch("/confirmar_service/", async (req, res) => {
    let body = req.body;
    ServiceSchema.updateOne({id_service: body.id_service}, {state: "CONFIRMADO"},
        function (error, info) {
            if (error) {
                res.json({
                    code: 400,
                    msg: 'Bad request'
                });
            } else if (info.matchedCount >= 1) {
                res.json({
                    code: 200,
                    msg: 'Servicio confirmado'
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
 * Servicio que cambia el estado del servicio a SUSPENDIDO
 * Parametros:  id_service (identificador del servicio que se quiere confirmar
 */
router.patch("/suspender_service/", async (req, res) => {
    let body = req.body;
    ServiceSchema.updateOne({id_service: body.id_service}, {state: "SUSPENDIDO"},
        function (error, info) {
            if (error) {
                res.json({
                    code: 400,
                    msg: 'Bad request'
                });
            } else if (info.matchedCount >= 1) {
                res.json({
                    code: 200,
                    msg: 'Servicio suspendido'
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


/**
 ** POST "/add/service/
 * Servicio de insertar a la DB un servicio.
 * Parametros :    id_service (identificador del servicio) OPCIONAL
 *                  id_professional (identificador del profesional) OPCIONAL
 *                  id_client (identificador del cliente) por header
 *                  type_service (tipo de servicio) RESIDENCIAL O COMERCIAL
 *                  address (direccion del domicilio)
 *                  date (fecha del servicio)
 *                  state(Estado del servicio) OPCIONAL, inicialmente se crea como "COTIZADO"
 **/
router.post("/add/service/" || "/add/service", async (req, res) => {
    try {
        const infoServicio = req.body;
        infoServicio.state = "COTIZADO"
        const listServices = await ServiceSchema.find();
        if (checkService(infoServicio, listServices)) {
            const service = new ServiceSchema(infoServicio);
            console.log("Aqui se crea el servicio:" + service);
            res.status(200).json({
                code: 200,
                message: 'Servicio creado' + await service.save()
            });
        } else {
            res.status(409).json({
                code: 409,
                message: 'El ya se encuantra registrada o el codigo del servicio esta ya asignado',
                details: 'El servicio posiblemente esta registrado: ' + infoServicio
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            message: 'Internal server error ' + err,
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
            return true;
    });
    return false;
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