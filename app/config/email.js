const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const email = process.env.MAILER_EMAIL_ID || 'testrestapi2021@outlook.com';
const pass = process.env.MAILER_PASSWORD || 'test2021';


const smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'hotmail',
  auth: {
    user: email,
    pass: pass
  }
});

const handlebarsOptions = {
  viewEngine: {
    extName: ".html",
    partialsDir: path.resolve('./app/templates/'),
    defaultLayout: false
  },
    
  viewPath: path.resolve('./app/templates/'),
  extName: '.html'
};
  


exports.smtpTransport = smtpTransport.use('compile', hbs(handlebarsOptions)) ;
exports.email = email;
exports.pass = pass;
