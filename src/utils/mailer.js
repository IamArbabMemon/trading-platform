// import nodemailer from 'nodemailer'
// const transporter = nodemailer.createTransport({
//     service:"gmail",
//     host: 'smtp.gmail.com',
//     auth: {
//         user: process.env.MAILER_EMAIL,
//         pass: process.env.MAILER_PASS
//     }
// });

// const sendWelcomeMail = async (user:{username:string,email:string})=>{
    
//     let textToSend = "DEAR [User] WELCOME TO THE UNIQUE LEARNING PLATFORM . WE WISH YOU A GREAT JOURNEY WITH US !";
//     textToSend = textToSend.replace("[User]",user.username);
    
//     try{
        
//         const info = await transporter.sendMail({
//             from: {
//                 name:`UNIQUE LEARNING PLATFORM Team`,
//                 address:'arbabhere41@gmail.com'
//         }, // sender address
//             to: user.email, // list of receivers
//             subject: "WELCOME EMAIL", // Subject line
//             text: textToSend, // plain text body
//             html:""// html body
//           });

//           return info;
          
//       }catch(err){
//         console.log("FAILED TO SEND EMAIL");
//         return null;
//     }

// };

// const sendOTPMail = async (user:{username:string,email:string},linkToProvide :string)=>{
    
//     let textToSend = `Click here to reset password : ${linkToProvide}`;
//     textToSend = textToSend.replace("[User]",user.username);
    
//     try{
        
//         const info = await transporter.sendMail({
//             from: {
//                 name:`UNIQUE LEARNING PLATFORM Team`,
//                 address:'arbabhere41@gmail.com'
//         }, // sender address
//             to: user.email, // list of receivers
//             subject: "RESET PASSWORD REQUEST", // Subject line
//             text: textToSend, // plain text body
//             html:""// html body
//           });

//           return info;
          
//       }catch(err){
//         console.log("FAILED TO SEND EMAIL" , err);
//         return null;
//     }

// };


// export {
//     sendOTPMail,
//     sendWelcomeMail
// }