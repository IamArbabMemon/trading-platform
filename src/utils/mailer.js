import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASS
    }
});

const sendWelcomeMail = async (user) => {
    let textToSend = "DEAR [User] WELCOME TO THE FAMILY OF OUR CUSTOMERS. WE WISH YOU A GREAT JOURNEY WITH US!";
    textToSend = textToSend.replace("[User]", user.username);

    try {
        const info = await transporter.sendMail({
            from: {
                name: `UNIQUE LEARNING PLATFORM Team`,
                address: process.env.MAILER_EMAIL
            }, // sender address
            to: user.email, // list of receivers
            subject: "WELCOME EMAIL", // Subject line
            text: textToSend, // plain text body
            html: "" // html body
        });

        return info;

    } catch (err) {
        console.log("FAILED TO SEND EMAIL", err);
        return null;
    }
};

const sendOTPMail = async (data) => {
    let textToSend = `${data.text} ${data.otp}`;
    
    try {
        const info = await transporter.sendMail({
            from: {
                name: `MANGAL KESHAV TRADING PLATFORM`,
                address: process.env.MAILER_EMAIL
            }, // sender address
            to: data.email, // list of receivers
            subject: data.subject, // Subject line
            text: textToSend, // plain text body
            html: "" // html body
        });

        return info;

    } catch (err) {
        console.log("FAILED TO SEND EMAIL", err);
        return null;
    }
};

const sendUserZID = async (data) => {
    let textToSend = `${data.text} ${data.zid}`;
    
    try {
        const info = await transporter.sendMail({
            from: {
                name: `MANGAL KESHAV TRADING PLATFORM`,
                address: process.env.MAILER_EMAIL
            }, // sender address
            to: data.email, // list of receivers
            subject: data.subject, // Subject line
            text: textToSend, // plain text body
            html: "" // html body
        });

        return info;

    } catch (err) {
        console.log("FAILED TO SEND EMAIL", err);
        return null;
    }
};


module.exports = {
    sendOTPMail,
    sendWelcomeMail,
    sendUserZID
};


