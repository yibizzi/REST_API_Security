let Doctor = require("../app/models/Doctor");
let chai = require("chai");
let chaiHttp = require("chai-http");
const server = "http://localhost:9000";


chai.should();
chai.use(chaiHttp);

describe("Doctor Routes", () => {
  //Testing Get Route :
  describe("GET /doctors", () => {
    it("It should GET all doctors", (done) => {
      chai
        .request(server)
        .get("/doctors")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });

    it("It should not GET doctors when path is wrong", (done) => {
      chai
        .request(server)
        .get("/doctor")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it("It should GET One doctor by Id", (done) => {
      const doctorId = "60a546dc24893323a4b2aa61";
      chai
        .request(server)
        .get("/doctors/" + doctorId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.not.have.property("password");
          done();
        });
    });

    it("It should Not GET a doctor with a wrong Id", (done) => {
      const doctorId = "wrongID";
      chai
        .request(server)
        .get("/doctors/" + doctorId)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.error.should.be.eq("Doctor not found");
          done();
        });
    });

    it("It should GET appointments of a doctor", (done) => {
      const doctorId = "60a546dc24893323a4b2aa61";
      chai
        .request(server)
        .get("/doctors/"+doctorId+"/appointments")
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("It should not GET appointments of a doctor if Id is wrong", (done) => {
      const doctorId = "60a5qsdfqsdfqsf46dc24893323a4b2aa61";
      chai
        .request(server)
        .get("/doctors/"+doctorId+"/appointments")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it("It should GET ratings of a doctor", (done) => {
      const doctorId = "60a546dc24893323a4b2aa61";
      chai
        .request(server)
        .get("/doctors/"+doctorId+"/rating")
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("It should not GET ratings of a doctor if Id is wrong", (done) => {
      const doctorId = "60a5qsdfqsdfqsf46dc24893323a4b2aa61";
      chai
        .request(server)
        .get("/doctors/"+doctorId+"/rating")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it("It should GET recieved Requests of a doctor", (done) => {
      const doctorId = "60a546dc24893323a4b2aa61";
      chai
        .request(server)
        .get("/doctors/"+doctorId+"/recieved-requests")
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("It should not GET recieved Requests of a doctor if Id is wrong", (done) => {
      const doctorId = "60a5qsdfqsdfqsf46dc24893323a4b2aa61";
      chai
        .request(server)
        .get("/doctors/"+doctorId+"/recieved-requests")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

  });


  describe("POST /doctors", () => {
    // it("It should POST a new doctor", (done) => {
    //   let doctor = {
    //     firstName: "salah",
    //     lastName: "pharoah",
    //     email: "test2@gmail.com",
    //     password: "bbb",
    //     phoneNumber: "06666666666",
    //     speciality: "Generaliste",
    //   };
    //   chai
    //     .request(server)
    //     .post("/doctors/auth/signup")
    //     .send(doctor)
    //     .end((err, res) => {
    //       res.should.have.status(201);
    //       res.body.should.be.a("object");
    //       done();
    //     });
    // });

    // it("It should not POST a new doctor if email is not Unique", (done) => {
    //   let doctor = {
    //     firstName: "test",
    //     lastName: "test",
    //     email: "test2@gmail.com",
    //     password: "bbb",
    //     phoneNumber: "06666666666",
    //     speciality: "Generaliste",
    //   };
    //   chai
    //     .request(server)
    //     .post("/doctors/auth/signup")
    //     .send(doctor)
    //     .end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.be.a("object");
    //       done();
    //     });
    // });

    it("It should Login", (done) => {
      let loginInfos = {
        email: "test2@gmail.com",
        password: "bbb",
      };
      chai
        .request(server)
        .post("/doctors/auth/login")
        .send(loginInfos)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });

    it("It should Not Login with not existing email", (done) => {
      let loginInfos = {
        email: "test_incorrect_email@gmail.com",
        password: "bbb",
      };
      chai
        .request(server)
        .post("/doctors/auth/login")
        .send(loginInfos)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.error.should.eq("Doctor not found!");
          done();
        })
    });

    it("It should Not Login with Incorrect password", (done) => {
      let loginInfos = {
        email: "test2@gmail.com",
        password: "wrong password",
      };
      chai
        .request(server)
        .post("/doctors/auth/login")
        .send(loginInfos)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.error.should.eq("Worng password")
          done();
        });
    });

    it("It should not send a message to the provided email ", (done) => {
      let email = "incorrect@gmail.com"
      chai
        .request(server)
        .post("/doctors/auth/forget-password")
        .send(email)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          done();
        });
    });

    it("reset password needs a token", (done) => {
      let passwords = {
        newPassword : "test",
        verifyPassword : "test"
      }
      chai
        .request(server)
        .post("/doctors/auth/reset-password")
        .send(passwords)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    })
  });

  describe("PUT /doctors", () => {
    it("It should update a doctor", (done) => {
      const doctorId = "60a546dc24893323a4b2aa61";
      const object = {
        adress : "An adress for test purposes",
        phoneNumber: 29803758
      }
      chai
        .request(server)
        .put(`/doctors/${doctorId}`)
        .send(object)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it("It should not update a doctor if Id is incorrect", (done) => {
      const doctorId = "60a546dc24893323a4b2aa61";
      const object = {
        adress : "An adress for test purposes",
        phoneNumber: 29803758
      }
      chai
        .request(server)
        .put(`/doctors/${doctorId}`)
        .send(object)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it("It should confirm an appointment", (done) => {
      const doctorId = "60a546dc24893323a4b2aa61";
      const object = {
        isConfirmed : true,
        appointmentId : "609f7e8ed463e13a28536a70",
        patientId : "60a576539da341157870d415",
        doctorId: "60a546dc24893323a4b2aa61"
      }
      chai
        .request(server)
        .put(`/doctors/${doctorId}/confirm-appointment`)
        .send(object)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.shoudl.be.eq("Appointment was accepted")
          done();
        });
    });

    it("It should refuse an appointment", (done) => {
      const doctorId = "60a546dc24893323a4b2aa61";
      const object = {
        isConfirmed : false,
        appointmentId : "609f7e8ed463e13a28536a70",
        patientId : "60a576539da341157870d415",
        doctorId: "60a546dc24893323a4b2aa61"
      }
      chai
        .request(server)
        .put(`/doctors/${doctorId}/confirm-appointment`)
        .send(object)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.shoudl.be.eq("Appointment was refused")
          done();
        });
    });

    it("It should cancel an appointment", (done) => {
      const doctorId = "60a546dc24893323a4b2aa61";
      const object = {
        appointmentId : "609f7e8ed463e13a28536a70",
      }
      chai
        .request(server)
        .put(`/doctors/${doctorId}/confirm-appointment`)
        .send(object)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.shoudl.be.eq("appointment was canceld")
          done();
        });
    });

    it("It should not cancel an appointment if doctorID is incorrect", (done) => {
      const doctorId = "60a546dc2489sdfqsdf3323a4b2aa61";
      const object = {
        appointmentId : "609f7e8ed463e13a28536a70",
      }
      chai
        .request(server)
        .put(`/doctors/${doctorId}/confirm-appointment`)
        .send(object)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.error.shoudl.be.eq("Doctor Not Found")
          done();
        });
    });

    it("It should not cancel an appointment if appointmentID is incorrect", (done) => {
      const doctorId = "60a546dc2489sdfqsdf3323a4b2aa61";
      const object = {
        appointmentId : "wrong id",
      }
      chai
        .request(server)
        .put(`/doctors/${doctorId}/confirm-appointment`)
        .send(object)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.error.shoudl.be.eq("Appointment Not Found")
          done();
        });
    });

    describe("DELETE /patients", () => {
      it("Should delete a given doctor", (done) => {
        const doctorId = "60a576539da341157870d415";
        chai
          .request(server)
          .delete(`/doctors/${doctorId}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });

      it("Providing invalid doctorId or wrong URL", (done) => {
        const doctorId = "60a576539da341157870d415o";
        chai
          .request(server)
          .delete(`/doctors/${doctorId}`)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });
});
