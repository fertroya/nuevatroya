var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '.', 'views/email-templates')
  , emailTemplates = require('email-templates')
  , nodemailer     = require('nodemailer');


NodemailerHelper = function(){};

/** ------------------------ TEMBOO & CALENDAR ------------------------*/
NodemailerHelper.prototype.sendMail= function(locals){


    emailTemplates(templatesDir,  {open: '{{', close: '}}' }, function(err, template) {

      if (err) {
        console.log(err);
      } else {

        // ## Send a single email

        // Prepare nodemailer transport object
        var transport = nodemailer.createTransport("SMTP", {
          service: "Gmail",
          auth: {
            user: "mailer.nuevatroya@gmail.com",
            pass: "lacerra7"
          }
        });


        // Send a single email
        template('responsive', locals, function(err, html, text) {
          if (err) {
            console.log(err);
          } else {
       

        transport.sendMail({
              from: locals.nombreDeContacto + ' <'+locals.email+'>',
              replyTo: locals.email,
              to: 'info@nuevatroya.com.ar',
              subject: 'Nueva consulta de '+locals.nombreDeContacto,
              html: html,
              generateTextFromHTML: true
            }, function(err, responseStatus) {
              if (err) {
                console.log(err);
              } else {
                console.log(responseStatus.message);
              }
            });
          }
      
        });


      }
    });
}

exports.NodemailerHelper = NodemailerHelper;