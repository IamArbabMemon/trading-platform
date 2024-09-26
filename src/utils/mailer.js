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

const sendOTPMail = async (user, linkToProvide) => {
    let textToSend = `Click here to reset password: ${linkToProvide}`;
    
    try {
        const info = await transporter.sendMail({
            from: {
                name: `UNIQUE LEARNING PLATFORM Team`,
                address: process.env.MAILER_EMAIL
            }, // sender address
            to: user.email, // list of receivers
            subject: "RESET PASSWORD REQUEST", // Subject line
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
    sendWelcomeMail
};


