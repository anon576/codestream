import express from  'express'
import bodyparser from 'body-parser'
import session from 'express-session'


import {checkUserExist,registerUser,authenticateUser,updatePassword,addInternship,updateInternship,getAllInternships,getInternshipsByID,deleteInternshipByID,enrolledInternship,addContent,updateInternshipContent,getContent, updateProgress,addCourse,updateCourse,deleteCourseByID,addCourseContent,updatecourseContent,updateUserData,addService, updateService,deleteServiceByID, enrolledCourse,updateCourseProgress,getCourseContent,getAllcourse,getCourseByID,applyService,getAllService,getServiceByID} from './database.js'
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
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const emailExists = await checkUserExist(email);

        if (emailExists) {
            return res.status(400).json({
                message: 'Email is already registered',
            });
        }

        const otp = generateOTP();
        sendOTPMail(email, otp, 'OTP for Registration');

        req.session.tempdata = { name, email, password, otp };
        res.json({
            message: 'OTP sent to your email for verification',
        });
    } catch (error) {
        console.error('Error in registration:', error);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});


app.post('/verifyOTP', async (req, res) => {
    try {
        const { otp } = req.body;
        const data = req.session.tempdata;
        if (!data || data.otp != otp ){
            return res.status(401).json({ message: 'Invalid OTP' });
        }
        

        const user = await registerUser(data.name, data.email, data.password);
        req.session.tempdata = null;
        res.json({ message: 'Registration successful', user });
    } catch (error) {
        console.error('Error in OTP verification:', error);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});




//Update User Data----------------------
app.post('/updateUserData', async (req, res) => {
    try {
        const { name, email, password, college, address, dob, mobile } = req.body;
        const id = req.session.userData.userID;

        // Update user data and get the updated user
        const result = await updateUserData(id, name, email, password, college, address, dob, mobile);

        // Send the updated user data in the response
        res.json(result);
    } catch (error) {
        console.error('Error in updating user data:', error);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});




// User Login-------------------
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authenticateUser(email, password);
        if (!user) {
            console.error('Authentication failed for email:', email);
            return res.status(404).json({ message: 'Email or Password is incorrect' });
        }

        req.session.userData = user;
        console.log('User logged in:', user.email);
        res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




// Forget Password-----------------
app.post('/forgetPassword', async (req, res) => {
    try {
        const { email } = req.body;
        const emailExists = await checkUserExist(email);

        if (!emailExists) {
            console.error('Email is not registered:', email);
            return res.status(400).json({
                message: "Email is not registered"
            });
        }

        const otp = generateOTP();
        sendOTPMail(email, otp, 'OTP for Resetting Password');
        req.session.tempdata = { email, otp };

        console.log('OTP for password resetting sent to:', email);
        res.json({ message: 'OTP for password resetting is sent to your mail' });
    } catch (error) {
        console.error('Error in forgetPassword:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

app.post('/verifyForgetOTP', async (req, res) => {
    try {
        const { otp, password } = req.body;
        const data = req.session.tempdata;

        if (data.otp != otp) {
            console.error('Invalid OTP for password reset:', otp);
            return res.status(401).json({
                message: 'Invalid OTP'
            });
        }

        const user = await updatePassword(data.email, password);

        // Clean up session data after successful password reset
        req.session.tempdata = null;

        console.log('Password reset successfully for:', data.email);
        res.json({
            message: "Password reset successfully",
            user: user
        });
    } catch (error) {
        console.error('Error in verifyForgetOTP:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});


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
app.post('/createInternship', async (req, res) => {
    try {
        const { username, password } = req.session.adminData;

        if (!checkAdmin(username, password)) {
            console.error('Unauthorized admin access');
            return res.json({ message: 'Login with admin credentials' });
        }

        const { name, price, level, tabDescription, description, imgurl } = req.body;
        const internshipId = await addInternship(name, price, level, tabDescription, description, imgurl);

        console.log('Internship added successfully:', internshipId);
        res.json({ message: 'Internship added', internshipId });
    } catch (error) {
        console.error('Error creating internship:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});





// Update Internship Route----------------------
app.post('/updateInternship', async (req, res) => {
    try {

        const { username, password } = req.session.adminData;

        if (!checkAdmin(username, password)) {
            console.error('Unauthorized admin access');
            return res.json({ message: 'Login with admin credentials' });
        }

        const { id, name, price, level, tabDescription, description, imgurl } = req.body;
        const result = await updateInternship(id, name, price, level, tabDescription, description, imgurl);

        if (result.message) {
            console.log('Internship updated successfully:', id);
            res.json({ message: 'Internship updated', internship: id });
        } else {
            console.error('Internship not found or no changes were made:', id);
            res.status(404).json({ message: 'Internship not found or no changes were made' });
        }
    } catch (error) {
        console.error('Error updating internship:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




// Delate Internship Route--------------------
app.post('/deleteInternship/:id', async (req, res) => {
    try {
        const { username, password } = req.session.adminData;

        if (!checkAdmin(username, password)) {
            console.error('Unauthorized admin access');
            return res.json({ message: 'Login with admin credentials' });
        }

        const id = req.params.id;
        const result = await deleteInternshipByID(id);

        if (result.message) {
            console.log('Internship deleted successfully:', id);
            res.json({ message: 'Internship deleted successfully' });
        } else {
            console.error('Internship not found or already deleted:', id);
            res.status(404).json({ message: 'Internship not found or already deleted' });
        }
    } catch (error) {
        console.error('Error deleting internship:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Upload Content in Internship----------------------------
app.post('/uploadContent', async (req, res) => {
    try {
        const { username, password } = req.session.adminData;

        if (!checkAdmin(username, password)) {
            console.error('Unauthorized admin access');
            return res.json({ message: 'Login with admin credentials' });
        }

        const { title, content, pageNo, internshipID } = req.body;
        const con = await addContent(title, content, pageNo, internshipID);

        if (con) {
            console.log('Content added successfully:', con);
            res.json({ message: 'Content added successfully', con });
        } else {
            console.error('Error adding content:', con);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error uploading content:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Update Internship Cotent----------------------
app.post('/updateContent', async (req, res) => {
    try {
        const { username, password } = req.session.adminData;

        if (!checkAdmin(username, password)) {
            console.error('Unauthorized admin access');
            return res.json({ message: 'Login with admin credentials' });
        }

        const { id, title, content, pageNo, internshipID } = req.body;
        const result = await updateInternshipContent(id, title, content, pageNo, internshipID);

        if (result && result.message) {
            console.log('Internship content updated successfully:', id);
            res.json({ message: 'Internship content updated successfully' });
        } else {
            console.error('Error updating internship content:', result);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});







//  Add Course Route---------------------------------
app.post('/createCourse', async (req, res) => {
    try {
        const { username, password } = req.session.adminData;

        // Check admin credentials
        if (!checkAdmin(username, password)) {
            return res.status(401).json({ message: 'Unauthorized: Login with admin credentials.' });
        }

        const { name, price, level, tabdescription, description, imgurl } = req.body;

        // Add course to the database
        const course = await addCourse(name, price, level, tabdescription, description, imgurl);

        // Return success message and added course details
        res.json({ message: 'Course added successfully', course });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Update Course Route-------------------------------
app.post('/updateCourse', async (req, res) => {
    try {
        const { username, password } = req.session.adminData;

        // Check admin credentials
        if (!checkAdmin(username, password)) {
            return res.status(401).json({ message: 'Unauthorized: Login with admin credentials.' });
        }

        const { id, name, price, level, tabdescription, description, imgurl } = req.body;

        // Update course in the database
        const result = await updateCourse(id, name, price, level, tabdescription, description, imgurl);

        // Check if the update was successful
        if (result && result.message === 'Course updated successfully') {
            // Return success message and updated course details
            res.json({ message: 'Course updated successfully', course: result.course });
        } else {
            // Handle the case where the update failed
            res.status(404).json({ message: 'Course not found or update failed' });
        }
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Delate Course Route-----------------------------------
app.post('/deleteCourse/:id', async (req, res) => {
    try {
        const { username, password } = req.session.adminData;

        // Check admin credentials
        if (!checkAdmin(username, password)) {
            return res.status(401).json({ message: 'Unauthorized: Login with admin credentials.' });
        }

        const id = req.params.id;

        // Delete course from the database
        const result = await deleteCourseByID(id);

        // Check if the deletion was successful
        if (result && result.message === 'Course deleted successfully') {
            // Return success message
            res.json({ message: 'Course deleted successfully' });
        } else {
            // Handle the case where the deletion failed
            res.status(404).json({ message: 'Course not found or deletion failed' });
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Upload Course Content-------------------------
app.post('/uploadCourseContent', async (req, res) => {
    try {
        const { username, password } = req.session.adminData;

        // Check admin credentials
        if (!checkAdmin(username, password)) {
            return res.status(401).json({ message: 'Unauthorized: Login with admin credentials.' });
        }

        const { title, content, pageNo, courseID } = req.body;

        // Add course content to the database
        const result = await addCourseContent(title, content, pageNo, courseID);

        // Check if the addition was successful
        if (result && result.message === 'Course content added successfully') {
            // Return success message
            res.json({ message: 'Course content added successfully' });
        } else {
            // Handle the case where the addition failed
            res.status(400).json({ message: 'Course content addition failed' });
        }
    } catch (error) {
        console.error('Error uploading course content:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Update Course Content-------------------------------
app.post('/updateCourseContent', async (req, res) => {
    try {
        const { username, password } = req.session.adminData;

        // Check admin credentials
        if (!checkAdmin(username, password)) {
            return res.status(401).json({ message: 'Unauthorized: Login with admin credentials.' });
        }

        const { id, title, content, pageNo, courseID } = req.body;

        // Update course content in the database
        const result = await updatecourseContent(id, title, content, pageNo, courseID);

        // Check if the update was successful
        if (result && result.message === 'Course data updated successfully') {
            // Return success message
            res.json({ message: 'Course content updated successfully' });
        } else {
            // Handle the case where the update failed
            res.status(400).json({ message: 'Course content update failed' });
        }
    } catch (error) {
        console.error('Error updating course content:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Add service------------------------
app.post('/addService', async (req, res) => {
    try {
        const { username, password } = req.session.adminData;

        // Check admin credentials
        if (!checkAdmin(username, password)) {
            return res.status(401).json({ message: 'Unauthorized: Login with admin credentials.' });
        }

        const { name, imgurl, description, tabDescrition } = req.body;

        // Add service to the database
        const result = await addService(name, imgurl, description, tabDescrition);

        // Check if the addition was successful
        if (result && typeof result.insertId === 'number') {
            // Return success message
            res.json({ message: 'Service added successfully', serviceID: result.insertId });
        } else {
            // Handle the case where the addition failed
            res.status(400).json({ message: 'Service addition failed' });
        }
    } catch (error) {
        console.error('Error adding service:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




// Update Service------------------------------
app.post('/updateService', async (req, res) => {
    try {
        const { username, password } = req.session.adminData;

        // Check admin credentials
        if (!checkAdmin(username, password)) {
            return res.status(401).json({ message: 'Unauthorized: Login with admin credentials.' });
        }

        const { id, name, imgurl, description, tabDescrition } = req.body;

        // Update service in the database
        const result = await updateService(id, name, imgurl, description, tabDescrition);

        // Check if the update was successful
        if (result && result.message === 'Service updated successfully') {
            // Return success message
            res.json({ message: 'Service updated successfully' });
        } else {
            // Handle the case where the update failed
            res.status(400).json({ message: 'Service update failed' });
        }
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});





// Delate Service--------------------------
app.post('/deleteService/:id', async (req, res) => {
    try {
        const { username, password } = req.session.adminData;

        // Check admin credentials
        if (!checkAdmin(username, password)) {
            return res.status(401).json({ message: 'Unauthorized: Login with admin credentials.' });
        }

        const serviceID = req.params.id;
        const deletedService = await deleteServiceByID(serviceID);

        if (deletedService === undefined) {
            return res.json({ message: 'Service deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Service not found or delete operation failed' });
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});





app.listen(8080,()=>{
    console.log('http://localhost:8080')
})
