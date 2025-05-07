import nodemailer from "nodemailer";
import config from "../app/config";

const emailSender =async (email: string,
    html: string
)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: config.nodeEmail,
          pass: config.nodeEmailPass,
        },
        tls:{
            rejectUnauthorized: false
        }
      });
      
      const info = await transporter.sendMail({
        from: '"GreenMind Hub" <md.nazimuddinaj@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Reset Password Link", // Subject line
        text: "Hello world?", // plain text body
        html, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
}

export default emailSender;