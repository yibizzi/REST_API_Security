const Admin = require("../models/Admin");

exports.getAdmin = (req, res) => {
    Admin.find({})
    .then(admins => res.json(admins))
    .catch(err => res.json(err));
}

exports.getAdminById = (req, res) => {
    Admin.findOne({_id: req.params.adminId})
    .then(admin => res.json(admin))
    .catch(err => res.json({error: "Admin Not Found"}));
}

// admin signup/login need to be implemnted

// this function is just for testing
exports.createAdmin = (req, res) => {
    const admin = Admin({
        fullName: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        email: req.body.email
    });

    admin.save(function(err){
        if(!err){
            res.json({message: "Admin created successfully"});
        }else{
            res.json(err);
        }
    });
}

exports.updateAdmin = (req, res) => {
    Admin.updateOne({_id: req.params.adminId}, req.body)
    .then(res.json({message: "Admin updated successfully"}))
    .catch(err => res.json(err));
}

exports.deleteAdmin = (req, res) => {
    Admin.deleteOne({_id: req.params.adminId})
    .then(res.json({message: "Admin deleted successfully"}))
    .catch(err => res.json(err));
}