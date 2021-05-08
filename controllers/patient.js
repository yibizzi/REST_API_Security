const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

exports.getPatients = (req, res) => {
    const query = req.query;
    if (Object.entries(query).length == 0) {
        Patient.find({})
            .then(patient => res.json(patient))
            .catch(err => res.status(404).send({error: "Patient Not Found"}));
    } else {
        Patient.find(query)
            .then(patient => res.json(patient))
            .catch(err => res.status(404).send({error: "Patient Not Found"}));
    }
}


exports.createPatient = (req, res) => {
    const patient = Patient({
        avatar: req.body.avatar,
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        email: req.body.email,
        age: req.body.age,
        phoneNumber: req.body.phoneNumber,
        sendRequest: req.body.sendRequest,
        appointments: req.body.appointments,
        history: req.body.history
    });

    patient.save(function (err) {
        if (!err) {
            res.status(201).send("patient created successfully");
        }else{
            res.status(404).send(err);
        }
    });
}

exports.getPatientById = (req, res) => {
    Patient.findById({ _id: req.params.patientId })
        .then(patient => res.status(202).json(patient))
        .catch(err => res.status(404).json({error: "Patient Not Found"}));
}


exports.updatePatient = (req, res) => {
    Patient.updateOne({ _id: req.params.patientId }, req.body)
        .then(function (err) {
            if (err.nModified === 1) {
                res.status(200).send("patient updated successfully");
            } else {
                res.status(404).send(err);
            }
        });
}

const cancelAppointmentPatient = (req, res) => {
    Patient.findOne({ _id: req.params.patientId })
        .then(patient => {
            const requests = patient.sendRequest;
            const appointments = patient.appointments;
            console.log(patient);
            const indexReq = requests.indexOf(req.body.appointmentId);
            requests.splice(indexReq, 1);
            const indexApp = appointments.indexOf(req.body.appointmentId);
            appointments.splice(indexApp, 1);
            patient.save();
        }
        ).catch(err => res.status(404).json({error: "Patient Not Found"}));
}

const cancelAppointmentDoctor = (req, res) => {
    Doctor.findOne({ _id: req.body.doctorId })
        .then(doctor => {
            console.log(doctor);
            const requests = doctor.recievedRequests;
            const appointments = doctor.appointments;
            console.log(doctor);
            const indexReq = requests.indexOf(req.body.appointmentId);
            requests.splice(indexReq, 1);
            const indexApp = appointments.indexOf(req.body.appointmentId);
            appointments.splice(indexApp, 1);
            doctor.save();
        }).catch(err => res.status(404).json({error: "Doctor Not Found"}));
}


exports.cancelAppointment = (req, res) => {
    cancelAppointmentPatient(req, res);
    cancelAppointmentDoctor(req, res);
    res.status(200).send("appointment was cancled");
}


exports.deletePatient = (req, res) => {
    Patient.updateOne({ _id: req.params.patientId })
        .then(function (err) {
            if (!err) {
                res.status(200).send("patient deleted successfully");
            } else {
                res.status(204).send(err);

            }
        });
}

