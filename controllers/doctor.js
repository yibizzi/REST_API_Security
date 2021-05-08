const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

exports.createDoctor = (req, res) => {
    const doctor = Doctor({
        avatar: req.body.avatar,
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        speciality: req.body.speciality,
        description: req.body.description,
        history: req.body.history
    });
    console.log(doctor);
    doctor.save(err => {
        if(err){
            res.status(404).json(err);
        }
    });
   
}

exports.getDoctors = (req, res) => {
    const query = req.query;
    if (Object.entries(query).length == 0) {
        Doctor.find({})
            .then(doctors => res.json(doctors));
    } else {
        Doctor.find(query)
            .then(doctor => res.status(200).json(doctor))
            .catch(error => res.status(404).json({error : "Doctor not found"}));
    }


}

exports.getDoctorById = (req, res) => {
    Doctor.findById({ _id: req.params.doctorId })
        .then(doctor => res.status(200).json(doctor))
        .catch(error => res.status(404).json({error : "Doctor not found"}));
}


exports.updateDoctor = (req, res) => {
    // console.log(req.body);
    Doctor.updateOne({ _id: req.params.doctorId }, req.body)
        .then(function (err) {
            if (err.nModified === 1){
                res.status(200).send("doctor updated successfully");
            }else{
                res.status(404).send(err);
            }
        }).catch(error => res.status(404).json({error : "Doctor not found"}));
}

const confirmAppointmentForDoctor = (req, res) => {
    Doctor.findOne({ _id: req.params.doctorId })
        .then(doctor => {
            const requests = doctor.recievedRequests;
            const appointments = doctor.appointments;
            const index = requests.indexOf(req.body.appointmentId);
            requests.splice(index, 1);
            if (req.body.confirme) {
                appointments.push(req.body.appointmentId);
                res.status(200).send("appointment was accepted");
            } else {
                res.status(200).send("appointment was refused");
            }
            doctor.save();
        }
        ).catch(error => res.status(404).json({error : "Doctor not found"}));
}

const confirmAppointmentForPatient = (req, res) => {
    Patient.findOne({ _id: req.body.patientId })
        .then(patient => {
            const requests = patient.sendRequest;
            const appointments = patient.appointments;
            const index = requests.indexOf(req.body.appointmentId);
            requests.splice(index, 1);
            if (req.body.confirme) {
                appointments.push(req.body.appointmentId);
                res.status(200).send("appointment was accepted");
            } else {
                res.status(200).send("appointment was refused");
            }
            patient.save();
        }
        ).catch(error => res.status(404).json({error : "Patient not found"}));
}


exports.confirmAppointment = (req, res) => {
    confirmAppointmentForDoctor(req, res);
    confirmAppointmentForPatient(req, res);
}   

exports.deleteDoctor = (req, res) => {
    Doctor.deleteOne({_id: req.params.doctorId})
    .then(err => {
        if(!err){
            res.status(200).send("doctor delted successfully");
        }
    });
}



