
// const nodemailer=require("nodemailer");

// require("dotenv").config();

// const transporter=nodemailer.createTransport({
//     service:'gmail',
//     // host:'smtp.gmail.com',
//     // port:587, //587 is default, if usin 465 then make secure true
//     // secure:false,
//     auth:{
//         // user: process.env.USERNAME,
//         // pass: process.env.USERPASS
//         user: 'gaurav1234thakurgt@gmail.com', 
//         pass: 'pwhe bage juko mwyq'
//     }
// });

// const mailOptions={
//     // from: process.env.USERNAME,
//     from:"gaurav1234thakurgt@gmail.com",
//     to: ["kush1293.be21@chitkarauniversity.edu.in","shashank1295.be21@chitkarauniversity.edu.in","anuj1266.be21@chitkarauniversity.edu.in","himanshu1268.be21@chitkarauniversity.edu.in","gaurav1291.be21@chitkarauniversity.edu.in"],
//     subject: 'Fake taxi booking confirmation',
//     html: `
//         <p>Dear customer</p>
//         <p>We are pleased to that you have successfully free fake taxi ride.</p>
//         <p><strong>Booking Details:</strong></p>
//         <ul>
//             <li>car number: 6969<li>
            
//         </ul>
//         <p>Enjoy your ride</p>
//         <p>Best regards,</p>
//         <p>Stranger</p>
//     `
// }

// const sendMail=async(transporter,mailOptions)=>{
//     try{
//         await transporter.sendMail(mailOptions);
//         console.log("Email sent successfully");
//     }catch(error){
//         console.log("Error in sendMail",error);
//     }
// }
// sendMail(transporter,mailOptions);
