import express from 'express'
import bodyparser from 'body-parser'
import session from 'express-session'
import NodeCache from "node-cache";
import cors from "cors";
// import jwt from 'jsonwebtoken';
// import MemoryStoreFactory from 'memorystore';


import { checkUserExist, registerUser, authenticateUser, updatePassword, addInternship, updateInternship, getAllInternships, getInternshipsByID, deleteInternshipByID, enrolledInternship, addContent, updateInternshipContent, getContent, updateProgress, addCourse, updateCourse, deleteCourseByID, addCourseContent, updatecourseContent, updateUserData, addService, updateService, deleteServiceByID, enrolledCourse, updateCourseProgress, getCourseContent, getAllCourses, getCourseByID, applyService, getAllServices, getServiceByID, checkOtp, deleteOtp, setVerify, checkVerified, deleteUnverified, saveForgetPasswordOtp, getUserByID, verifyToken, getAppliedServiceDataById, getAppliedServiceDataByServiceId } from './database.js'
import { sendOTPMail, generateOTP, checkAdmin } from './utils.js'
import { useParams } from 'react-router-dom';

const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(
    session({
        secret: 'sskey',
        resave: false,
        saveUninitialized: true,
    })
)


const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your React app's URL
    credentials: true,
}));


//------------Home Page Router----------------------



// Get all Internship-----------------
app.get("/internships", async (req, res) => {
    try {
        const cachedInternships = cache.get("internships");
        if (cachedInternships) {
            return res.send(cachedInternships);
        }

        const internships = await getAllInternships();
        cache.set("internships", internships);
        res.send(internships);
    } catch (error) {
        console.error("Error fetching internships:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/internships/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Check the cache first
        const cachedInternship = cache.get(`internship_${id}`);
        if (cachedInternship) {
            return res.send(cachedInternship);
        }

        const internship = await getInternshipByID(id);

        // Cache the result
        if (internship) {
            cache.set(`internship_${id}`, internship);
        }

        res.send(internship || {});
    } catch (error) {
        console.error("Error fetching internship by ID:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Get all Courses
app.get("/courses", async (req, res) => {
    try {
        const courses = await getAllCourses();
        res.send(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).send("Internal Server Error");
    }
});



app.get("/course/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const course = await getCourseByID(id);

        if (!course) {
            return res.status(404).send("Course not found");
        }

        res.send(course);
    } catch (error) {
        console.error("Error fetching course by ID:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Get All Service
app.get("/services", async (req, res) => {
    try {
        const services = await getAllServices();
        res.send(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/service/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const service = await getServiceByID(id);

        if (!service) {
            return res.status(404).send("Service not found");
        }

        res.send(service);
    } catch (error) {
        console.error("Error fetching service by ID:", error);
        res.status(500).send("Internal Server Error");
    }
});




// Enrolling In Intenrhsip-------------
app.post('/enrolledInternship', async (req, res) => {
    try {
        const { internshipID } = req.body;
        const userID = req.session.userData.userID;
        const progress = 0;
        const offerLetter = false;
        const completeLetter = false;

        const completeDate = new Date();
        completeDate.setDate(completeDate.getDate() + 30);
        const formattedCompleteDate = completeDate.toISOString().split('T')[0];

        const enrollment = await enrolledInternship(internshipID, userID, progress, offerLetter, completeLetter, formattedCompleteDate);

        res.json({ message: "success", enrollmentID: enrollment });
    } catch (error) {
        console.error("Error enrolling in internship:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// Enrolling In Course-------------
app.post('/enrolledCourse', async (req, res) => {
    try {
        const { courseID } = req.body;
        const userID = req.session.userData.userID;
        const progress = 0;
        const completeLetter = false;

        const completeDate = new Date();
        completeDate.setDate(completeDate.getDate() + 30);
        const formattedCompleteDate = completeDate.toISOString().split('T')[0];

        const enrollment = await enrolledCourse(courseID, userID, progress, completeLetter, formattedCompleteDate);

        res.json({ message: "success", enrollmentID: enrollment });
    } catch (error) {
        console.error("Error enrolling in course:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




// Apply Service--------------------------
app.post('/applyService', async (req, res) => {
    try {
        const {
            email,
            mobile,
            serviceType,
            projectDescription,
            contactTime,
            budget,
            // comment,
            howyouknowus,
            // tech,
            projectDeadline,
            contactStyle,
            userid,
            serviceid,

        } = req.body;

        const service = await applyService(
            email,
            mobile,
            serviceType,
            projectDescription,
            contactTime,
            budget,
            // comment,
            howyouknowus,
            // tech,
            projectDeadline,
            contactStyle,
            userid,
            serviceid
        );

        res.json({ success: true, message: "Submited successfully", service: service });
    } catch (error) {
        console.error("Error applying for service:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

app.get('/getAppliedServiceData/:userid', async (req, res) => {
    try {
        const userid = req.params.userid;
        console.log(userid);
        const servicedata = await getAppliedServiceDataById(userid);
        if (servicedata) {
            res.json({ success: true, servicedata });
        }
    } catch (error) {
        console.log('error getting applied service data', error);
        res.status(500).json({ success: false, message: 'Internal server Error' });
    }
});


app.get('/getAppliedSpecificServiceData/:serviceid', async (req, res) => {
    try {
        const serviceid = req.params.serviceid;
        console.log(serviceid);
        const servicedata = await getAppliedServiceDataByServiceId(serviceid);
        if (servicedata) {
            res.json({ success: true, servicedata });
        }
    } catch (error) {
        console.log('error getting applied service data', error);
        res.status(500).json({ success: false, message: 'Internal server Error' });
    }
});





// -------------------User Route-------------------------


// Register user----------------------------
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const emailExists = await checkUserExist(email);
        const isVerified = await checkVerified(email);


        if (emailExists) {
            if (!isVerified) {

                deleteUnverified(email);
                const otp = generateOTP();
                sendOTPMail(email, otp, 'OTP for Registration');

                // req.session.tempdata = { name, email, password, otp };
                // console.log(req.session.tempdata)
                console.log(name, email, password, otp)
                const user = await registerUser(name, email, password, otp);
                console.log("data stored")

                res.status(200).json({
                    message: 'OTP sent to your email for verification',
                });

            } else {
                return res.status(400).json({
                    message: 'Email is already registered',
                });
            }
        } else {
            const otp = generateOTP();
            sendOTPMail(email, otp, 'OTP for Registration');

            // req.session.tempdata = { name, email, password, otp };
            // console.log(req.session.tempdata)
            console.log(name, email, password, otp)
            const user = await registerUser(name, email, password, otp);
            console.log("data stored")

            res.status(200).json({
                message: 'OTP sent to your email for verification',
            });
        }


    } catch (error) {
        console.error('Error in registration:', error);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

app.post('/verifyOTP', async (req, res) => {
    try {
        const { otp, email } = req.body;

        const savedOtp = await checkOtp(email);

        if (savedOtp === null) {
            return res.status(401).json({ message: 'OTP not exists' });
        }

        if (savedOtp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }


        await setVerify(email);
        await deleteOtp(otp);
        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error in OTP verification:', error);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});


app.put('/updateUserData', async (req, res) => {
    try {
        const { id, name, college, address, dob, mobile } = req.body;

        // Update user data and get the updated user
        const result = await updateUserData(id, name, college, address, dob, mobile);

        // Send the updated user data in the response
        res.json({
            success: true,
            message: 'User data updated successfully',
            userdata: result, // Assuming your updateUserData function returns the updated user data
        });
    } catch (error) {
        console.error('Error in updating user data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const authResult = await authenticateUser(email, password);

        if (authResult.error) {
            console.error(`Authentication failed for email ${email}: ${authResult.error}`);
            return res.status(404).json({ message: authResult.error });
        }

        const { user, token } = authResult;
        req.session.userData = user;
        console.log('User logged in:', user.email);
        res.json({ message: 'Login successful', user, token });
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
        const saveOtp = await saveForgetPasswordOtp(email, otp)
        sendOTPMail(email, otp, 'OTP for Resetting Password');

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
        const { email, otp, password } = req.body;

        const savedOtp = await checkOtp(email);

        if (savedOtp === null) {
            return res.status(401).json({ message: 'OTP not exists' });
        }

        if (savedOtp !== otp) {
            console.error('Invalid OTP for password reset:', otp);
            return res.status(401).json({
                message: 'Invalid OTP'
            });
        }

        const user = await updatePassword(email, password);
        await deleteOtp(otp);
        console.log('Password reset successfully for:', email);
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

app.get("/getUserData", verifyToken, async (req, res) => {
    try {

        const token = req.headers.authorization
        // console.log(token)

        const userID = req.user.userId;
        const userdata = await getUserByID(userID);
        if (userdata) {
            res.json({ success: true, userdata });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }

    } catch (error) {
        console.error('Error fetching user profile data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})


// Get Course Content
app.get("/courseContent/:cID/:pageNo", async (req, res) => {
    const { userID } = req.session.userData
    const cID = req.params.cID
    const pageNo = req.params.pageNo
    const progress = await updateCourseProgress(pageNo, userID, cID)
    const con = await getCourseContent(cID, pageNo)
    console.log(con)
    res.send({ 'content': con, 'progress': progress })
})


// Get Internshp Content
app.get("/content/:iID/:pageNo", async (req, res) => {
    const { userID } = req.session.userData
    const iID = req.params.iID
    const pageNo = req.params.pageNo
    const progress = await updateProgress(pageNo, userID, iID)
    const con = await getContent(iID, pageNo)
    res.send({ 'content': con, 'progress': progress })
})





// ----------------------Admin Routes---------------------

// Admin Login--------------------------
app.post('/adminLogin', async (req, res) => {
    const { username, password } = req.body
    if (checkAdmin(username, password)) {
        req.session.adminData = { username, password }
        res.json({ message: 'Login Successfull' })
    } else {
        res.json({ message: 'Invalid Credentials' })
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





app.listen(8080, () => {
    console.log('http://localhost:8080')
})
