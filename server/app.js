import express from  'express'
import bodyparser from 'body-parser'
import session from 'express-session'


import {checkUserExist,registerUser,getUserbyID,loginUser,updatePassword,addInternship,updateInternship,getAllInternships,getInternshipsByID,delateInternshipByID,enrolledInternship,addContent,updateInternshipContent,getContent, updateProgress,addCourse,updateCourse,delateCourseByID,addCourseContent,updatecourseContent,updateUserData,addService, updateService,delateServiceByID, enrolledCourse,updateCourseProgress,getCourseContent,getAllcourse,getCourseByID,applyService,getAllService,getServiceByID} from './database.js'
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




//------------Home Page Router----------------------



// Get all Internship-----------------
app.get("/internships",async(req,res)=>{
    const internships = await getAllInternships()
    res.send(internships)
})


app.get("/internships/:id",async(req,res)=>{
    const id = req.params.id
    const internship = await getInternshipsByID(id)
    res.send(internship)
})


// Get all Courses
app.get("/courses",async(req,res)=>{
    const course = await getAllcourse()
    res.send(course)
})

app.get("/course/:id",async(req,res)=>{
    const id = req.params.id
    const course = await getCourseByID(id)
    res.send(course)
})


// Get All Service
app.get("/services",async(req,res)=>{
    const service = await getAllService()
    res.send(service)
})


app.get("/service/:id",async(req,res)=>{
    const id = req.params.id
    const service = await getServiceByID(id)
    res.send(service)
})




// Enrolling In Intenrhsip-------------
app.post('/enrolledInternship',async(req,res)=>{
    const {internshipID} = req.body
    const userID = req.session.userData.userID
    const progress = 0
    const offerLetter = false
    const complateLetter = false
    const complateDate = new Date()
    complateDate.setDate(complateDate.getDate() + 30)
    const formattedComplateDate = complateDate.toISOString().split('T')[0]
    const enrollment = await enrolledInternship(internshipID,userID,progress,offerLetter,complateLetter,formattedComplateDate)
    res.json({message:"success",enrollmentID:enrollment})
})

// Enrolling In Course-------------
app.post('/enrolledCourse',async(req,res)=>{
    const {courseID} = req.body
    const userID = req.session.userData.userID
    const progress = 0
    const complateLetter = false
    const complateDate = new Date()
    complateDate.setDate(complateDate.getDate() + 30)
    const formattedComplateDate = complateDate.toISOString().split('T')[0]
    const enrollment = await enrolledCourse(courseID,userID,progress,complateLetter,formattedComplateDate)
    res.json({message:"success",enrollmentID:enrollment})
})




// Apply Service--------------------------
app.post('/applyService',async(req,res)=>{
    const {email,mobile,serviceType,projectDescription,contactTime,budget,comment,howyouknowus,tech,projectDeadline,id} = req.body
    const service = await applyService(email,mobile,serviceType,projectDescription,contactTime,budget,comment,howyouknowus,tech,projectDeadline,id)

    res.json({message:"success",service:service})
    

})




// -------------------User Route-------------------------


// Register user----------------------------
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




//Update User Data----------------------
app.post('/updateUserData',async(req,res)=>{
    const {name,email,password,college,address,dob,mobile} = req.body
    const id = req.session.userData.userID
    const user = await updateUserData(id,name,email,password,college,address,dob,mobile)

    res.send(user)
})



// User Login-------------------
app.post('/login', async(req,res)=>{
    const {email,password} = req.body
    const user = await loginUser(email,password)
    if(user == false){
        return res.status(404).json({message:'Email or Password is incorrect'})
    }
    req.session.userData = user
    res.json({message:"Login successful",user:user})
})



// Forget Password-----------------
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


// Get Course Content
app.get("/courseContent/:cID/:pageNo",async(req,res)=>{
    const {userID} = req.session.userData
    const cID = req.params.cID
    const pageNo = req.params.pageNo
    const progress = await updateCourseProgress(pageNo,userID,cID)
    const con = await getCourseContent(cID,pageNo)
    console.log(con)
    res.send({'content':con,'progress':progress})
})


// Get Internshp Content
app.get("/content/:iID/:pageNo",async(req,res)=>{
    const {userID} = req.session.userData
    const iID = req.params.iID
    const pageNo = req.params.pageNo
    const progress = await updateProgress(pageNo,userID,iID)
    const con = await getContent(iID,pageNo)
    res.send({'content':con,'progress':progress})
})





// ----------------------Admin Routes---------------------

// Admin Login--------------------------
app.post('/adminLogin',async(req,res)=>{
    const {username,password} = req.body
    if(checkAdmin(username,password)){
        req.session.adminData = {username,password}
        res.json({message:'Login Successfull'})
    }else{
        res.json({message:'Invalid Credentials'})
    }
    
})




// Create Internship Route----------------
app.post('/createInternship',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }
    const {name,price,level,tabdescription,description,imgurl} = req.body
    const internship = await addInternship(name,price,level,tabdescription,description,imgurl)
    res.json({message:"Internship Added",internship:internship})
})




// Update Internship Route----------------------
app.post('/updateInternship',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }
    const {id,name,price,level,tabdescription,description,imgurl} = req.body
    const internship = await updateInternship(id,name,price,level,tabdescription,description,imgurl)
    res.json({message:"Internship Updated",internship:internship})
})



// Delate Internship Route--------------------
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


// Upload Content in Internship----------------------------
app.post('/uploadContent',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }
    const {title,content,pageNo,internshipID} = req.body
    const con = await addContent(title,content,pageNo,internshipID)

    res.json({message:"success",con:con})

})


// Update Internship Cotent----------------------
app.post('/updateContent',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }

    const {id,title,content,pageNo,internshipID} = req.body
    const con = await updateInternshipContent(id,title,content,pageNo,internshipID)

    res.json({message:"success"})
})






//  Add Course Route---------------------------------
app.post('/createCourse',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }
    const {name,price,level,tabdescription,description,imgurl} = req.body
    const course = await addCourse(name,price,level,tabdescription,description,imgurl)
    res.json({message:"Course Added",internship:course})
})


// Update Course Route-------------------------------
app.post('/updateCourse',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }
    const {id,name,price,level,tabdescription,description,imgurl} = req.body
    const course = await updateCourse(id,name,price,level,tabdescription,description,imgurl)
    res.json({message:"Course Updated",course:course})
})


// Delate Course Route-----------------------------------
app.post('/delateCourse/:id',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }
    const id = req.params.id
    const course = await delateCourseByID(id)
    if(course == undefined){
        return res.json({message:"course delated successfully"})
    }

})

// Upload Course Content-------------------------
app.post('/uploadCourseContent',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }
    const {title,content,pageNo,courseID} = req.body
    const con = await addCourseContent(title,content,pageNo,courseID)

    res.json({message:"success",con:con})

})


// Update Course Content-------------------------------
app.post('/updateCourseContent',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }

    const {id,title,content,pageNo,courseID} = req.body
    const con = await updatecourseContent(id,title,content,pageNo,courseID)

    res.json({message:"success"})
})


// Add service------------------------
app.post('/addService',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }

    const {name,imgurl,description,tabDescrition} = req.body
    const service = await addService(name,imgurl,description,tabDescrition)
    res.json({message:"Course Added",service:service})
})



// Update Service------------------------------
app.post('/updateService',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }

    const {id,name,imgurl,description,tabDescrition} = req.body
    const service = await updateService(id,name,imgurl,description,tabDescrition)
    res.json({message:"Service Updated",service:service})
})




// Delate Service--------------------------
app.post('/delateService/:id',async(req,res)=>{
    const {username,password} = req.session.adminData
    if(!checkAdmin(username,password)){
        return res.json({message:'Login with admin Credentials'})
    }
    const id = req.params.id
    const Course = await delateServiceByID(id)
    if(Course == undefined){
        return res.json({message:"Service delated successfully"})
    }

})




app.listen(8080,()=>{
    console.log('http://localhost:8080')
})
