var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var pdf = require('html-pdf');
var fs = require('fs');

module.exports.sendMail = function(to, subject, messageObj, templateFile, callingBack) {
    var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    let transporter = nodemailer.createTransport(({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'darrel.idiagbor@stu.cu.edu.ng', // generated ethereal user
            pass: 'anewbegining5' // generated ethereal password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    }));

    // verify connection configuration
    transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages', success);
    }
    });
    
    setTimeout(() => {
        readHTMLFile(__dirname + templateFile, function(err, html) {
            var template = handlebars.compile(html);
            var replacements = messageObj;
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'hello@rockies.ng',
                to : to,
                subject : subject,
                html : htmlToSend
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                   callingBack(error);
                } else {
                   callingBack(null, info);
                  
                }
            });
        });
    },2000);
}

module.exports.sendMailWithAttach = function(to, subject, messageObj, attachment, templateFile, callingBack) {
    var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    let transporter = nodemailer.createTransport(({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'darrel.idiagbor@stu.cu.edu.ng', // generated ethereal user
            pass: 'anewbegining5' // generated ethereal password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    }));

    // verify connection configuration
    transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages', success);
    }
    });
    
    setTimeout(() => {
        readHTMLFile(__dirname + templateFile, function(err, html) {
            var template = handlebars.compile(html);
            var replacements = messageObj;
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'hello@rockies.ng',
                to : to,
                subject : subject,
                html : htmlToSend,
                attachments: [
                    {   // filename and content type is derived from path
                        path: attachment
                    }
                ]
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                   callingBack(error);
                } else {
                   callingBack(null, info);
                  
                }
            });
        });
    },2000);
}


module.exports.createHtmlPdf = function(bodyObj, templateFile, callingBack) {
    var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    
    
    readHTMLFile(__dirname + templateFile, function(err, html) {
        var template = handlebars.compile(html);
        var replacements = bodyObj;
        var htmlToChange = template(replacements);

        //var html = fs.readFileSync('./' + htmlToChange, 'utf8');
        var options = { format: 'Letter' };
        
        pdf.create(htmlToChange, options).toFile('c://users/DELL/workspace/rockies/assets/tickets/' + bodyObj.orderId + '.pdf', function(err, res) {
            if (err) {
                callingBack(err);
                return console.log(err);
            } else {
                callingBack(null, res);
            }
        });
    });
}