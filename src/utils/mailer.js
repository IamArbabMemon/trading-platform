import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASS
    }
});

// const sendWelcomeMail = async (data) => {
//     let textToSend = `DEAR ${data.username} WELCOME TO THE FAMILY OF OUR CUSTOMERS. YOUR USER ID IS ${data.userZID}  . YOU WILL USE THIS ID TO GET LOGGED IN MENGAL KESHAV PLATFROM .WE WISH YOU A GREAT JOURNEY WITH US!`;
//     try {
//         const info = await transporter.sendMail({
//             from: {
//                 name: `MENGAL KESHAV TRADING PLATFORM`,
//                 address: process.env.MAILER_EMAIL
//             }, // sender address
//             to: data.email, // list of receivers
//             subject: "WELCOME EMAIL", // Subject line
//             text: textToSend, // plain text body
//             html: "" // html body
//         });

//         return info;

//     } catch (err) {
//         console.log("FAILED TO SEND EMAIL", err);
//         return null;
//     }
// };

// const sendOTPMail = async (data) => {
//     let textToSend = `${data.text} ${data.otp}`;
    
//     try {
//         const info = await transporter.sendMail({
//             from: {
//                 name: `MANGAL KESHAV TRADING PLATFORM`,
//                 address: process.env.MAILER_EMAIL
//             }, // sender address
//             to: data.email, // list of receivers
//             subject: data.subject, // Subject line
//             text: textToSend, // plain text body
//             html: "" // html body
//         });

//         return info;

//     } catch (err) {
//         console.log("FAILED TO SEND EMAIL", err);
//         return null;
//     }
// };

const sendOTPMail = async (data) => {
    let textToSend = `${data.text} <b>${data.otp}</b>`; // Bold the OTP

    try {
        const info = await transporter.sendMail({
            from: {
                name: `MANGAL KESHAV TRADING PLATFORM`,
                address: process.env.MAILER_EMAIL
            }, // sender address
            to: data.email, // list of receivers
            subject: data.subject, // Subject line
            text: `${data.text} ${data.otp}`, // plain text body
            html: textToSend // HTML body with bold OTP
        });

        return info;

    } catch (err) {
        console.log("FAILED TO SEND EMAIL", err);
        return null;
    }
};

const sendWelcomeMail = async (data) => {
    const textToSend = `DEAR ${data.username}, WELCOME TO THE FAMILY OF OUR CUSTOMERS. YOUR USER ID IS ${data.userZID}. YOU WILL USE THIS ID TO LOG IN TO THE MENGAL KESHAV PLATFORM. WE WISH YOU A GREAT JOURNEY WITH US!`;

    const htmlToSend = `
        <p>DEAR ${data.username},</p>
        <p>WELCOME TO THE FAMILY OF OUR CUSTOMERS. YOUR USER ID IS <strong>${data.userZID}</strong>.</p>
        <p>YOU WILL USE THIS ID TO LOG IN TO THE MENGAL KESHAV PLATFORM. WE WISH YOU A GREAT JOURNEY WITH US!</p>
    `;

    try {
        const info = await transporter.sendMail({
            from: {
                name: `MENGAL KESHAV TRADING PLATFORM`,
                address: process.env.MAILER_EMAIL
            }, // sender address
            to: data.email, // list of receivers
            subject: "WELCOME EMAIL", // Subject line
            text: textToSend, // plain text body for non-HTML clients
            html: htmlToSend // HTML formatted body
        });

        return info;

    } catch (err) {
        console.log("FAILED TO SEND EMAIL", err);
        return null;
    }
};



const sendRejectionMail = async (data) => {
    let textToSend = `DEAR ${data.username} ${data.text}`;
    
    try {
        const info = await transporter.sendMail({
            from: {
                name: `MANGAL KESHAV TRADING PLATFORM`,
                address: process.env.MAILER_EMAIL
            }, // sender address
            to: data.email, // list of receivers
            subject: "Application Rejection", // Subject line
            text: textToSend, // plain text body
            html: "" // html body
        });

        return info;

    } catch (err) {
        console.log("FAILED TO SEND EMAIL", err);
        return null;
    }
};



const sendAccountFreezeMail = async (data) => {
    let textToSend = `DEAR ${data.username} ${data.text}`;
    
    try {
        const info = await transporter.sendMail({
            from: {
                name: `MANGAL KESHAV TRADING PLATFORM`,
                address: process.env.MAILER_EMAIL
            }, // sender address
            to: data.email, // list of receivers
            subject: "ALERT : ACCOUNT FREEZE", // Subject line
            text: textToSend, // plain text body
            html: "" // html body
        });

        return info;

    } catch (err) {
        console.log("FAILED TO SEND EMAIL", err);
        return null;
    }
};


const sendAccountActivationMail = async (data) => {
    let textToSend = `DEAR ${data.username} ${data.text}`;
    
    try {
        const info = await transporter.sendMail({
            from: {
                name: `MANGAL KESHAV TRADING PLATFORM`,
                address: process.env.MAILER_EMAIL
            }, // sender address
            to: data.email, // list of receivers
            subject: "Account Re-Activated", // Subject line
            text: textToSend, // plain text body
            html: "" // html body
        });

        return info;

    } catch (err) {
        console.log("FAILED TO SEND EMAIL", err);
        return null;
    }
};



export {
    sendOTPMail,
    sendWelcomeMail,
    sendRejectionMail,
    sendAccountFreezeMail,
    sendAccountActivationMail
};


