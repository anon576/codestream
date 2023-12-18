import express from  'express'
import bodyparser from 'body-parser'
import session from 'express-session'


import {checkUserExist,registerUser,getUserbyID,loginUser,updatePassword,addInternship,updateInternship,getAllInternships,getInternshipsByID,delateInternshipByID,enrolledInternship,addContent,updateInternshipContent,getContent} from './database.js'
import { sendOTPMail,generateOTP,checkAdmin } from './utils.js'

// const PORT = PRE

const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(
    session({
        secret:'sskey',
        resave:false,
        saveUninitialized:true,
    })
)



// --------User Registration------------------------------
app.post('/register',async(req,res)=>{
    const{name,email,password} = req.body
    const emailExists = await checkUserExist(email)

    if (emailExists){
        return res.status(400).json({
            message:"Email is already registered"
        })
    }

    const otp = generateOTP()
    sendOTPMail(email,otp,'OTP for Registration')

    req.session.tempdata = {name,email,password,otp}
    res.json({
        message:"OTP sent to your email for verification"
    })

})

app.post('/verifyOTP', async(req,res)=>{
    const {otp} = req.body
    const data = req.session.tempdata
    if(data.otp != otp){
        return res.status(401).json({message:'Invalid OTP'})
    }
    const user = await registerUser(data.name,data.email,data.password)
    req.session.tempdata = null
    res.json({message:"Registration successful",user:user})
})


// ------------------User Login-------------------

app.post('/login', async(req,res)=>{
    const {email,password} = req.body
    const user = await loginUser(email,password)
    if(user == false){
        return res.status(404).json({message:'Email or Password is incorrect'})
    }
    req.session.userData = user
    res.json({message:"Login successful",user:user})
})




// -----------------------Forget Password-----------------
app.post('/forgetPassword',async(req,res)=>{
    const {email} = req.body
    const emailExists = await checkUserExist(email)

    if (!emailExists){
        return res.status(400).json({
            message:"Email is not registered"
        })
    }
    const otp = generateOTP()
    sendOTPMail(email,otp,'OTP for Reseting Password')
    req.session.tempdata = {email,otp}
    res.json({message:'OTP for password resseting is sent to your mail'})

})

app.post('/verifyForgetOTP',async(req,res)=>{
    const {otp,password} = req.body
    const data = req.session.tempdata
    if(data.otp != otp){
        return res.status(401).json({message:'Invalid OTP'})
    }
    const user = await updatePassword(data.email,password)
    res.json({message:"Password reset successfully",user:user})
})


// ------------------------Apply Form ---------------------

app.post('/enrolledInternship',async(req,res)=>{
    const {internshipID} = req.body
    console.log(req.session.userData.userID)
    const userID = req.session.userData.userID
    const progress = 0
    const enrollment = await enrolledInternship(internshipID,userID,progress)
    res.json({message:"success",enrollmentID:enrollment})
})



// ----------------------Admin Routes---------------------


app.post('/adminLogin',async(req,res)=>{
    const {username,password} = req.body
    if(checkAdmin(username,password)){
        req.session.adminData = {username,password}
        res.json({message:'Login Successfull'})
    }else{
        res.json({message:'Invalid Credentials'})
    }
    
})







// --------------Admin Internship Route----------------
app.post('/createInternship',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }
    const {name,price,level,tabdescription,description,imgurl} = req.body
    const internship = await addInternship(name,price,level,tabdescription,description,imgurl)
    res.json({message:"Internship Added",internship:internship})
})


app.post('/updateInternship',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }
    const {id,name,price,level,tabdescription,description,imgurl} = req.body
    const internship = await updateInternship(id,name,price,level,tabdescription,description,imgurl)
    res.json({message:"Internship Updated",internship:internship})
})


app.post('/delateInternship/:id',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }
    const id = req.params.id
    const internship = await delateInternshipByID(id)
    if(internship == undefined){
        return res.json({message:"intenship delated successfully"})
    }

})


app.post('/uploadContent',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }
    const {title,content,pageNo,internshipID} = req.body
    const con = await addContent(title,content,pageNo,internshipID)

    res.json({message:"success",con:con})

})

app.post('/updateContent',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }

    const {id,title,content,pageNo,internshipID} = req.body
    const con = await updateInternshipContent(id,title,content,pageNo,internshipID)

    res.json({message:"success"})
})


// ------------------Internship Routes-----------------
app.get("/internships",async(req,res)=>{
    const internships = await getAllInternships()
    res.send(internships)
})

app.get("/internships/:id",async(req,res)=>{
    const id = req.params.id
    const internship = await getInternshipsByID(id)
    res.send(internship)
})


app.get("/content/:iID/:pageNo",async(req,res)=>{
    const iID = req.params.iID
    const pageNo = req.params.pageNo
    const con = await getContent(iID,pageNo)
    res.send(con)
})


app.listen(8080,()=>{
    console.log('http://localhost:8080')
})
