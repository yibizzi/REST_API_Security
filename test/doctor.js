let mongoose = require("mongoose");
let Doctor = require("../app/models/Doctor");

let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

describe("Doctor Routes", () => {
  //Testing Get Route :
  describe("GET /doctors", () => {
    it("It should GET all doctors", (done) => {
      chai
        .request("http://localhost:9000")
        .get("/doctors")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });

    it("It should not GET doctors when path is wrong", (done) => {
      chai
        .request("http://localhost:9000")
        .get("/doctor")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it("It should GET One doctor by Id", (done) => {
      const doctorId = "60a546dc24893323a4b2aa61";
      chai
        .request("http://localhost:9000")
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
        .request("http://localhost:9000")
        .get("/doctors/" + doctorId)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.error.should.be.eq("Doctor not found");
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
    //     .request("http://localhost:9000")
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
    //     .request("http://localhost:9000")
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
        .request("http://localhost:9000")
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
        .request("http://localhost:9000")
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
        .request("http://localhost:9000")
        .post("/doctors/auth/login")
        .send(loginInfos)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.error.should.eq("Worng password")
          done();
        });
    });

    it("It should send a message to the provided email ", (done) => {
      let email = "moadup@gmail.com"
      chai
        .request("http://localhost:9000")
        .post("/doctors/auth/forget-password")
        .send({email})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.error.should.eq("Worng password")
          done();
        });
    });

    it("It should not send a message to the provided email ", (done) => {
      let email = "incorrect@gmail.com"
      chai
        .request("http://localhost:9000")
        .post("/doctors/auth/forget-password")
        .send(email)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          done();
        });
    });

    it("It should send a message to user after verifying the passwords", (done) => {
      let passwords = {
        newPassword : "test",
        verifyPassword : "test"
      }
      chai
        .request("http://localhost:9000")
        .post("/doctors/auth/reset-password")
        .send(passwords)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          res.body.error.should.eq("Worng password")
          done();
        });
    })


  });
});
