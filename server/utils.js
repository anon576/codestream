import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const admin = process.env.admin
const adminPassword = process.env.adminPassword





// -----------------Mail function---------------------

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'codestream63@gmail.com',
        pass:'tkdcwqrlnkvxxirj',
    },
})


export const sendOTPMail = (email ,otp,subject) =>{
    const mailOptions = {
        from : 'codestream63@gmail.com',
        to:email,
        subject : subject,
        text:`Your otp for registration is : ${otp}`
    }

    transporter.sendMail(mailOptions,(error,infor)=>{
        if(error){
            console.error("error",error)
        }else{
            console.log("email sent",info.response)
        }
    })
}


export const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };



// -------------------Admin function--------------------
export const checkAdmin = (username,password)=>{
    if(username == admin & password == adminPassword){
        return true
    }
    return false
}