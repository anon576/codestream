import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import fs from 'fs'
import pdf from 'html-pdf-node'
import cron from 'node-cron'
import jwt from 'jsonwebtoken';
import { getTodaysEnrollledInternship, getInternshipsByID, getUserByID, getTodaysComplateEnrollledInternship } from './database.js'
dotenv.config()

const admin = process.env.admin
const adminPassword = process.env.adminPassword

const secretKey = process.env.SECRETKEY;





// -----------------Mail function---------------------

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.password,
    },
})


export const sendOTPMail = (email, otp, subject) => {
    const mailOptions = {
        from: 'codestream63@gmail.com',
        to: email,
        subject: subject,
        text: `Your OTP for registration is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};



export const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};



// -------------------Admin function--------------------

function adminTokenGenerate(username, password) {
    return jwt.sign({ username, password }, secretKey, { expiresIn: '1d' });
}


// export const checkAdmin = (username, password) => {
//     if (username === admin && password === adminPassword) {
//         const adminToken = adminTokenGenerate(username, password);
//         return { adminToken }
//     }
//     return false
// }


export const checkAdmin = (username, password) => {
    if (username === admin && password === adminPassword) {
        const adminToken = adminTokenGenerate(username, password);
        return { adminToken };
    }
    return false;
};


const verifyAdminToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const adminToken = authHeader.split(' ')[1]
    // console.log(token)

    if (!adminToken) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // jwt.verify(token, 'yourSecretKey', (err, decoded) => {
    jwt.verify(adminToken, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        console.log('Decoded Token Payload:', decoded);
        req.user = decoded; // Set user data in the request object
        next();
    });
};
export { verifyAdminToken };




//----------------Certificates sending function-----------


cron.schedule('0 3 * * *', async () => {
    try {
        const receiver = await getTodaysEnrollledInternship();
        if (receiver === undefined) {
            console.log("2");
            return 0;
        }
        for (const r of receiver) {
            console.log(22);
            const user = await getUserByID(r.userID);
            const internship = await getInternshipsByID(r.internshipsID);
            console.log("4");
            sendCertificate(user.email, user.name, r.internshipsID, internship.name, 1);
        }
    } catch (error) {
        console.error('Error in cron job:', error.message);
    }
});


cron.schedule('0 4 * * *', async () => {
    try {
        const receiver = await getTodaysComplateEnrollledInternship();
        if (receiver === undefined) {
            return 0;
        }
        for (const r of receiver) {
            const user = await getUserByID(r.userID);
            const internship = await getInternshipsByID(r.internshipsID);
            sendCertificate(user.email, user.name, r.internshipsID, internship.name, 0);
        }
    } catch (error) {
        console.error('Error in cron job:', error.message);
    }
});

// ------email,name,userID,dates--------Certificate Send uisng mail--------------

const sendCertificate = async (email, name, iID, iName, n) => {
    const todayDate = new Date().toISOString().split('T')[0]
    if (n == 0) {
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Internship Offer Letter</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
        
                .certificate {
                    max-width: 800px;
                    margin: 50px auto;
                    background-color: #fff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                .certificate-header {
                    text-align: center;
                }
        
                .certificate-title {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                }
        
                .certificate-subtitle {
                    font-size: 18px;
                    color: #555;
                    margin-top: 10px;
                }
        
                .certificate-content {
                    margin-top: 20px;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #666;
                }
        
                .signature {
                    margin-top: 40px;
                    text-align: center;
                }
        
                .signature-text {
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                }
        
                .issuer-signature {
                    margin-top: 20px;
                    font-size: 16px;
                    color: #666;
                }
            </style>
        </head>
        <body>
        
            <div class="certificate">
                <div class="certificate-header">
                    <div class="certificate-title">Internship Offer Letter</div>
                    <div class="certificate-subtitle">This is to certify that</div>
                </div>
        
                <div class="certificate-content">
                    <p><strong>Student Name:</strong>${name}</p>
                    <p><strong>Internship ID:</strong> ${iID}</p>
                    <p><strong>Domain:</strong> ${iName}</p>
                    <p><strong>Company:</strong> Codestream</p>
                </div>
        
                <div class="signature">
                    <div class="signature-text">Authorized Signature</div>
                    <div class="issuer-signature">John Smith<br>CEO, XYZ Corporation</div>
                </div>
            </div>
        
        </body>
        </html>
        
    `
    } else {
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Internship Offer Letter</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
        
                .certificate {
                    max-width: 800px;
                    margin: 50px auto;
                    background-color: #fff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                .certificate-header {
                    text-align: center;
                }
        
                .certificate-title {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                }
        
                .certificate-subtitle {
                    font-size: 18px;
                    color: #555;
                    margin-top: 10px;
                }
        
                .certificate-content {
                    margin-top: 20px;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #666;
                }
        
                .signature {
                    margin-top: 40px;
                    text-align: center;
                }
        
                .signature-text {
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                }
        
                .issuer-signature {
                    margin-top: 20px;
                    font-size: 16px;
                    color: #666;
                }
            </style>
        </head>
        <body>
        
            <div class="certificate">
                <div class="certificate-header">
                    <div class="certificate-title">Internship Offer Letter</div>
                    <div class="certificate-subtitle">This is to certify that</div>
                </div>
        
                <div class="certificate-content">
                    <p><strong>Student Name:</strong>${name}</p>
                    <p><strong>Internship ID:</strong> ${iID}</p>
                    <p><strong>Domain:</strong> ${iName}</p>
                    <p><strong>Company:</strong> Codestream</p>
                </div>
        
                <div class="signature">
                    <div class="signature-text">Authorized Signature</div>
                    <div class="issuer-signature">John Smith<br>CEO, XYZ Corporation</div>
                </div>
            </div>
        
        </body>
        </html>
        
    `
    }

    let optins = {
        format: 'A4'
    }
    let file = { content: html };

    const pdfBuffer = await pdf.generatePdf(file, optins)

    const mailOptions = {
        from: 'codestream63@gmail.com',
        to: email,
        subject: 'Internship Offer Letter',
        text: 'Please find the Internship Offer Letter attached.',
        attachments: [
            {
                filename: 'Internship_Offer_Letter.pdf',
                content: pdfBuffer,
                encoding: 'base64',
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("error", error)
        } else {
            console.log("email sent", info.response)
        }
    })
}

// sendCertificate('abhibhoyar141@gmail.com','Abhishek Bhoyar',1001,'Python')