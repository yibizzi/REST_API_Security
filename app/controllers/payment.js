const paymentKeys = require("../config/payment");
const stripe = require("stripe")(paymentKeys.SECRET_KEY);
const Payment = require("../models/Payment");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");



exports.pay = async (req, res) => {

    const patient = await Payment.findOne({ patientId: req.body.patientId });
    if (patient) {
        const customer = await stripe.customers.retrieve(patient.customerId);
        if (customer) {
            createPayment(req, res, patient.customerId);
        }

    } else {
        stripe.customers.create({
            name: req.body.name,
            email: req.body.email
        })
            .then(customer => createPayment(req, res, customer.id))
            .catch(err => res.status(400).send("Customer couldn't be created"));
    }

}


const calculatedPrice = (price) => {
    return price * 100;
}

const createPayment = async (req, res, cusId) => {
    const appointment = await Appointment.findOne({ _id: req.params.appointmentId });
    const price = appointment.price;
    stripe.paymentIntents.create({
        amount: calculatedPrice(price),
        currency: 'mad',
        payment_method_types: ['card'],
        customer: cusId,
    })
        .then(payment => {
            stripe.paymentIntents.confirm(
                payment.id,
                { payment_method: 'pm_card_visa' }
            )
                .then((payment) => {
                    const savedPayment = Payment({
                        doctorId: req.body.doctorId,
                        patientId: req.body.patientId,
                        customerId: cusId,
                        appointmenId: req.params.appointmenId,
                        amount: price,
                        description: req.body.description
                    });
                    savedPayment.save()
                        .then(() => {
                            Doctor.findOne({ _id: req.body.doctorId })
                                .then(doctor => {
                                    doctor.recievedPayments.push(savedPayment._id);
                                    doctor.save();
                                })
                                .catch(() => res.status(404).json({ error: "Doctor Not Found" }));
                            Patient.findOne({ _id: req.body.patientId })
                                .then(patient => {
                                    patient.payments.push(savedPayment._id);
                                    patient.save();
                                })
                                .catch(() => res.status(404).json({ error: "Patient Not Found" }));
                            res.status(201).json({ message: "Your bill has been paid successfully" })
                        })
                        .catch(() => res.status(500).json({ error: "Something wrong" }))
                })
                .catch(err => res.status(400).send({ error: `Payment intent is not confirmed cuz of ${err}` }));
        })
        .catch(() => res.status(400).send("PaymentIntent couldn't be created!!"))
}


exports.getPaymentById = (req, res) => {
    Payment.findOne({ _id: req.body.paymentId })
        .then(payment => res.status(200).json(payment))
        .catch(() => res.status(404).json({ error: "Transaction Not Found" }));
}


exports.getPayments = (req, res) => {
    Payment.find({})
        .then(payments => res.status(200).json(payments))
        .then(err => res.status(404).json(err));
}