const chai = require("chai");
const chaiHttp = require("chai-http");

//Assertion style
chai.should();
chai.use(chaiHttp);

const server = "http://localhost:9000";

describe("Testing patient controllers", () => {

    //---------------------- Test GET routes ------------------//
    describe("GET /patients", () => {
        it("Should GET patients list", done => {
            chai.request(server)
            .get("/patients")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
        it("Should not GET patients list", done => {
            chai.request(server)
            .get("/patient")
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    describe("GET /patients/:patientId", () => {
        it("Should GET patient by his id", done => {
            const patientId = "60a576539da341157870d415";
            chai.request(server)
            .get("/patients/" + patientId)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
        it("Should not GET patient by his id", done => {
            const patientId = "60a576539da341157870d415u";
            chai.request(server)
            .get("/patients/" + patientId)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    describe("GET /patients/:patientId/appointments", () => {
        it("Should GET patient's appointments", done => {
            const patientId = "60a576539da341157870d415";
            chai.request(server)
            .get(`/patients/${patientId}/appointments`)
            .send({patientId: patientId})
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

        it("Should not GET patient's appointments", done => {
            const patientId = "60a576539da341157870d415i";
            chai.request(server)
            .get(`/patients/${patientId}/appointments`)
            .send({patientId: patientId})
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
        
    });

    describe("GET /patients/:patientId/send-requests", () => {
        it("Should GET patient's send requests", done => {
            const patientId = "60a576539da341157870d415";
            chai.request(server)
            .get(`/patients/${patientId}/send-requests`)
            .send({patientId: patientId})
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

        it("Should not GET patient's send requests", done => {
            const patientId = "60a576539da341157870d415u";
            chai.request(server)
            .get(`/patients/${patientId}/send-requests`)
            .send({patientId: patientId})
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    //---------------------- Test POST route ----------------------//

    describe("POST /patients/auth/signup", () => {
        it("Should signup the patient", done => {
            const patient = {
                firstName: "Ibizzi",
                lastName: "Younes",
                email: "testemail@gmail.com",
                password: "testpass",
                age: 20,
                phoneNumber: 1234567
            }
            chai.request(server)
            .post("/patients/auth/signup")
            .send(patient)
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
        });

        it("Should not signup the patient", done => {
            const patient = {
                firtName: "Ibizzi",
                lastName: "Younes",
                email: "testemail@gmail.com",
                password: "testpass",
                age: 20,
                phoneNumber: 1234567
            }
            chai.request(server)
            .post("/patients/auth/signup")
            .send(patient)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });

        it("Wrong URL", done => {
            const patient = {
                firtName: "Ibizzi",
                lastName: "Younes",
                email: "testemail@gmail.com",
                password: "testpass",
                age: 20,
                phoneNumber: 1234567
            }
            chai.request(server)
            .post("/patient/auth/signup")
            .send(patient)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    describe("POST /patients/auth/login", () => {
        it("Should login the patient", done => {
            const patient = {
                email: "testemail@gmail.com",
                password: "testpass",
            }
            chai.request(server)
            .post("/patients/auth/login")
            .send(patient)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });

        it("Providing invalid email or password", done => {
            const patient = {
                email: "testemail@gmail.com",
                password: "testpassa",
            }
            chai.request(server)
            .post("/patients/auth/login")
            .send(patient)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
        });

        it("Wrong URL", done => {
            const patient = {
                email: "testemail@gmail.com",
                password: "testpass",
            }
            chai.request(server)
            .post("/patient/auth/login")
            .send(patient)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    describe("POST /patients/:patientId/forget-password", () => {
        it("Patient should be able declare that he forget the password", done => {
            chai.request(server)
            .post("/patients/auth/forget-password")
            .send({email: "momonamedrouanemo@gmail.com"})
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
        })

        it("Providing invalid email", done => {
            chai.request(server)
            .post("/patients/auth/forget-password")
            .send({email: "test@gmail.com"})
            .end((err, res) => {
                // 
                res.should.have.status(422);
                done();
            });
        });

        it("Wrong URL", done => {
            chai.request(server)
            .post("/patient/auth/forget-password")
            .send({email: "test@gmail.com"})
            .end((err, res) => {
                res.should.have.status(404)
                done();
            })
        })
    })

    describe("POST /patients/:patientId/rate-doctor", () => {
        it("Should rate the doctor", done => {
            const patientId = "60a576539da341157870d415";
            const object = {
                doctorId: "60a546dc24893323a4b2aa61",
                patientId: "60a576539da341157870d415",
                rating: 5
            }
            chai.request(server)
            .post("/patients/" + patientId +"/rate-doctor")
            .send(object)
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
        });

        it("Should not rate the doctor", done => {
            const patientId = "60a576539da341157870d415";
            const object = {
                doctorId: "60a546dc24893323a4b2aa61u",
                patientId: "60a576539da341157870d415",
                rating: 5
            }
            chai.request(server)
            .post("/patients/" + patientId +"/rate-doctor")
            .send(object)
            .end((err, res) => {
                res.should.have.status(404)
                done();
            });
        });

    });

    //---------------------- Test PUT routes ----------------------//

    describe("PUT patients/:patientId/rate-doctor", () => {
        it("Patient should be able to update the rating he gives for a doctor", done => {
            const object = {
                doctorId: "60a546dc24893323a4b2aa61",
                patientId: "60a576539da341157870d415",
                rating: 3
            }
            chai.request(server)
            .put(`/patients/${object.patientId}/rate-doctor`)
            .send(object)
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
        });

        it("Providing invalid patientId, doctorId or wrong URL", done => {
            const object = {
                doctorId: "60a546dc24893323a4b2aa61o",
                patientId: "60a576539da341157870d415",
                rating: 3
            }
            chai.request(server)
            .put(`/patients/${object.patientId}/rate-doctor`)
            .send(object)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    describe("PUT /patients/:patientId", () => {
        it("Patient should be able to update his information", done => {
            const patientId = "60a576539da341157870d415";
            const object = {
                age: 30,
                phoneNumber: 29803758
            }
            chai.request(server)
            .put(`/patients/${patientId}`)
            .send(object)
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
        });

        it("Providing invalid patientId or wrong URL", done => {
            const patientId = "60a576539da341157870d415o";
            const object = {
                age: 30,
                phoneNumber: 29803758
            }
            chai.request(server)
            .put(`/patients/${patientId}`)
            .send(object)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });

    });

    describe("PUT /patients/auth/reset-password", () => {
        it("Patient should be able to update the password", done => {
            const token = "d92f60875ad216f7ecf6f1cbbb9ed2ecef349cf7";
            const object = {
                newPassword: 123456,
                verifyPassword: 123456
            }
            chai.request(server)
            .put(`/auth/reset-password?token=${token}`)
            .send(object)
            .end((err, res) => {
                res.should.has.status(201);
                done();
            });
        });

        it("Passwords don't match", done => {
            const token = "d92f60875ad216f7ecf6f1cbbb9ed2ecef349cf7";
            const object = {
                newPassword: 123456,
                verifyPassword: 123456
            }
            chai.request(server)
            .put(`/auth/reset-password?token=${token}`)
            .send(object)
            .end((err, res) => {
                res.should.has.status(422);
                done();
            });
        });

        it("Wrong URL", done => {
            const token = "d92f60875ad216f7ecf6f1cbbb9ed2ecef349cf7";
            const object = {
                newPassword: 123456,
                verifyPassword: 123456
            }
            chai.request(server)
            .put(`/auths/reset-password?token=${token}`)
            .send(object)
            .end((err, res) => {
                res.should.has.status(404);
                done();
            });
        });
    });

    //---------------------- Test DELETE route ----------------------//
    // describe("DELETE /patients/:patientId", () => {
    //     it("Should delete a given patient", done => {
    //         const patientId = "60a576539da341157870d415";
    //         chai.request(server)
    //         .delete(`/patients/${patientId}`)
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             done();
    //         });
    //     });

    //     it("Providing invalid patientId or wrong URL", done => {
    //         const patientId = "60a576539da341157870d415o";
    //         chai.request(server)
    //         .delete(`/patients/${patientId}`)
    //         .end((err, res) => {
    //             res.should.have.status(404);
    //             done();
    //         });
    //     });
    // });
})