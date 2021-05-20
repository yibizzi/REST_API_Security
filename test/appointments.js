const chai = require("chai");
const chaiHttp = require("chai-http");
const server = "http://localhost:9000";

chai.should();
chai.use(chaiHttp);


    

describe("Testing appointments controllers", () => {

    //----------------------------- Test GET routes -----------------------------//
    describe("GET /appointments", () => {
        it("Should get all appointments", done => {
            chai.request(server)
            .get("/appointments")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

        it("Providing wrong URL", done => {
            chai.request(server)
            .get("/appointment")
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    describe("GET /appointments/:appointmentId", () => {
        it("Should get appointment by its Id", done => {
            const appointmentId = "609f7e17d463e13a28536a6f";
            chai.request(server)
            .get(`/appointments/${appointmentId}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

        it("Providing a wrong URL or invalid appointmentId", done => {
            const appointmentId = "609f7e17d463e13a28536a6fo";
            chai.request(server)
            .get(`/appointments/${appointmentId}`)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    //----------------------------- Test POST route -----------------------------//
    describe("POST /appointments", () => {
        // it("Shloud create a new appointment", done => {
        //     const appointment = {
        //         patientId: "60a576539da341157870d415",
        //         doctorId: "60a546dc24893323a4b2aa61",
        //         price: 200,
        //         date: 05/20/2021
        //     }
        //     chai.request(server)
        //     .post("/appointments")
        //     .send(appointment)
        //     .end((err, res) => {
        //         res.should.have.status(201);
        //         done();
        //     });
        // });

        it("Providing a wrong URL, invalid patientId or doctorId", done => {
            const appointment = {
                patientId: "60a576539da341157870d415k",
                doctorId: "60a546dc24893323a4b2aa61",
                price: 200,
                date: 05/20/2021
            }
            chai.request(server)
            .post("/appointments")
            .send(appointment)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    describe("POST /appointments/:appointmentId/pay", () => {
        it("Patient should be able to pay a given appointment", done => {
            const object = {
                name: "Mohamed Abdeljalil Rouane",
                email: "mohamed@gmail.com",
                doctorId: "60a546dc24893323a4b2aa61",
                patientId: "60a576539da341157870d415",
                appointmentId: "609f7e8ed463e13a28536a70",
                description: "ma3ndk walo"
            }
            chai.request(server)
            .post(`/appointments/${object.appointmentId}/pay`)
            .send(object)
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
        });

        it("Providing a wrong URL, invalid patientId, doctorId, appointmentId", done => {
            const object = {
                name: "Mohamed Abdeljalil Rouane",
                email: "mohamed@gmail.com",
                doctorId: "60a546dc24893323a4b2aa61",
                patientId: "60a576539da341157870d415",
                appointmentId: "609f7e8ed463e13a28536a70",
                description: "ma3ndk walo"
            }
            chai.request(server)
            .post(`/appointments${object.appointmentId}/pay`)
            .send(object)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });        
    })

    //----------------------------- Test PUT route -----------------------------//
    describe("PUT /appointments/:appointmentId", () => {
        it("Appointment should get updated by it Id", done => {
            const appointmentId = "609f7e17d463e13a28536a6f";
            chai.request(server)
            .put(`/appointments${appointmentId}`)
            .send({price: 100})
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
        });

        it("Providing wrong URL or invalid appointmentId", done => {
            const appointmentId = "609f7e17d463e13a28536a6f";
            chai.request(server)
            .put(`/appointments${appointmentId}`)
            .send({price: 100})
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    //----------------------------- Test DELETE route -----------------------------//
    describe("DELETE /appointments/:appointmentId", () => {
        it("Appointment should be delete using its Id", done => {
            const appointmentId = "609f7e17d463e13a28536a6f";
            chai.request(server)
            .delete(`/appointments/${appointmentId}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

        it("Providing a wrong URL or invalid appointmentId", done => {
            const appointmentId = "609f7e17d463e13a28536a6f";
            chai.request(server)
            .delete(`/appointments${appointmentId}`)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });
})