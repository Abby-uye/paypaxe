require("dotenv").config();

const nodemailer = require("nodemailer")

const transporter =nodemailer.createTransport({
    service: 'gmail',
    host:"smtp.gmail.com",
    port:465,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});
const sendWelcomeEmail = async (email, fullName,subject,text) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text
    }
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
};
module.exports = {
    sendWelcomeEmail
};
