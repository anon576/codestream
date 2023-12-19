import mysql from 'mysql2'

const pool = mysql.createPool({
    host : 'localhost',
    user:'root',
    password:'2000',
    database:'streamline'
}).promise()



// --------------User Database-----------------

export async function getUserbyID(id){
    const [user] =await pool.query(`select * from users where userID = ?`,[id])
    return user[0]
}

export async function delateUserbyID(id){
    const [user] =await pool.query(`delete from users where userID = ?`,[id])
    return user[0]
}

export async function checkUserExist(email){
    const [user] = await pool.query(`select email from users where email = ?`,[email])
    if (user[0] == undefined){
        return false
    }
    return true
}

export async function registerUser(name,email,password){
    const [user] = await pool.query(`insert into users(name,email,password) values(?,?,?)`,[name,email,password])
    const userid = user.insertId
    return getUserbyID(userid)
}

export async function updateUserData(id, name, email, password, college, address, dob, mobile) {
    const [user] = await pool.query(
      `UPDATE users SET name=?, email=?, password=?, college=?, address=?, dob=?, mobile=? WHERE userID = ?`,
      [name, email, password, college, address, dob, mobile, id]
    );
  
    return { message: "User Data Updated Successfully" };
  }
  

// login Function
export async function loginUser(email,password){
    const [user] = await pool.query(`select * from users where email = ? and password = ?`,[email,password])
    if (user[0] == undefined){
        return false
    }
    const userid = user[0].userID
    return getUserbyID(userid)
}

// Forgot Password
export async function updatePassword(email,password){
    const[user] = await pool.query(`update users set password = ? where email = ?`,[password,email])
    return {'message':'password updated successfully'}
}







//----------------Admin Internship Adding---------------------


// Add Internship
export async function addInternship(name,price,level,tabdescription,description,imgurl){
    const [internship] = await pool.query(`insert into internships(name,price,level,tabDescrition,description,imgurl) values(?,?,?,?,?,?)`,[name,price,level,tabdescription,description,imgurl])

    return internship.insertId
}

// Update Internship
export async function updateInternship(id,name,price,level,tabdescription,description,imgurl){
    const [internship] = await pool.query(`
    update internships 
    set name = ?,price=?,level=?,tabDescrition = ?,description=?,imgURL=?
    where internshipsID = ?`,[name,price,level,tabdescription,description,imgurl,id])

    return  {'message':'internship updated successfully'}
}

// Delate Internship
export async function delateInternshipByID(id){
    const [internship] =await pool.query(`delete from internships where internshipsID  = ?`,[id])
    return internship[0]
}


//-------------------Admin Internship Content---------------

// Add internship Content
export async function addContent(title,content,pageNo,internshipID){
    const [con] = await pool.query(`insert into internshipContent(title,content,pageNo,internshipsID) values(?,?,?,?)`,[title,content,pageNo,internshipID])
    return con.insertId
}

// Updated Internship Content
export async function updateInternshipContent(id,title,content,pageNo,internshipID){
    const [con] = await pool.query(`
    update internshipContent 
    set title = ?,content=?,pageNo=?, internshipsID = ?
    where icID = ?`,[title,content,pageNo,internshipID,id])

    return  {'message':'internship data updated successfully'}
}

//Read Internship Content
export async function getContent(iID,pageNo){
    const [con] = await pool.query(`select * from internshipContent where internshipsID=? and pageNo=?`,[iID,pageNo])
     return con[0]
}



//-----------------Read Internships -----------------------


// Get All Internship
export async function getAllInternships(){
    const [internships] = await pool.query('select * from internships')
    return internships
}


// Get Specific Internship
export async function getInternshipsByID(id){
    const [internships] = await pool.query('select * from internships where internshipsID = ?',[id])
    return internships[0]
}






//------------------------For Mailing Certificate----------------------

// For offer letter
export async function getTodaysEnrollledInternship(){
    const todayDate = new Date().toISOString().split('T')[0];
    const [intern] = await pool.query(`select * from enrolledInternship where Date(date)=?`,todayDate) 

    return intern
}

// For Completion Certificate
export async function getTodaysComplateEnrollledInternship(){
    const todayDate = new Date().toISOString().split('T')[0];
    const [intern] = await pool.query(`select * from enrolledInternship where Date(complateDate)=?`,todayDate) 

    return intern
}




//---------------Enrolled Internship ----------------

// Apply for Internship
export async function enrolledInternship(internshipID,userID,progress,offerLetter,complateLetter,complateDate){
    const [enrollment] = await pool.query(`insert into enrolledInternship(internshipsID, userID,progress,offerLetter,complateLetter,complateDate) values(?,?,?,?,?,?)`,[internshipID,userID,progress,offerLetter,complateLetter,complateDate])

    return enrollment.insertId
}


//Update Progress
export async function updateProgress(pageNo,userID,iID){
    const [progress] = await pool.query(`update enrolledInternship
    set progress = ?
    where userID = ? and internshipsID = ?`,[pageNo,userID,iID])

    return {"message":'Progress Updated Successfully'}
}



// --------------Admin Course Add----------------------
export async function addCourse(name,price,level,tabdescription,description,imgurl){
    const [course] = await pool.query(`insert into courses(name,price,level,tabDescrition,description,imgurl) values(?,?,?,?,?,?)`,[name,price,level,tabdescription,description,imgurl])

    return course.insertId
}


export async function updateCourse(id,name,price,level,tabdescription,description,imgurl){
    const [course] = await pool.query(`
    update courses 
    set name = ?,price=?,level=?,tabDescrition = ?,description=?,imgURL=?
    where courseID = ?`,[name,price,level,tabdescription,description,imgurl,id])

    return  {'message':'Course updated successfully'}
}


export async function delateCourseByID(id){
    const [course] =await pool.query(`delete from courses where courseID  = ?`,[id])
    return course[0]
}


//----------------Admin Course Content----------------


export async function addCourseContent(title,content,pageNo,courseID){
    const [con] = await pool.query(`insert into courseContent(title,content,pageNo,courseID) values(?,?,?,?)`,[title,content,pageNo,courseID])
    return con.insertId
}



export async function updatecourseContent(id,title,content,pageNo,courseID){
    const [con] = await pool.query(`
    update courseContent 
    set title = ?,content=?,pageNo=?, courseID = ?
    where icID = ?`,[title,content,pageNo,courseID,id])

    return  {'message':'Course data updated successfully'}
}


//--------------Course Erollment Not Required --------------



//--------------Admin Service---------------------


//Add service-------------------------------
export async function addService(name, imgurl, description, tabDescrition) {
    const [service] = await pool.query(
      'INSERT INTO service (name, imgurl, description, tabDescrition) VALUES (?, ?, ?, ?)',
      [name, imgurl, description, tabDescrition]
    )
    return service.insertId
  }
  


//Update service------------------------------------
export async function updateService(id,name,imgurl,description,tabDescrition){
    const [service] = await pool.query(`update service 
    set name = ?,imgurl=?,description=?,tabdescrition=?
    where serviceID = ?`,[name,imgurl,description,tabDescrition,id])
    return  {'message':'Service updated successfully'}
}

//Delate Service----------------------------
export async function delateServiceByID(id){
    const [service] =await pool.query(`delete from service where serviceID  = ?`,[id])
    return service[0]
}