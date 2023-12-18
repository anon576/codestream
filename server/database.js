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

export async function delateUserbyID(){
    const [user] =await pool.query(`delete from users`)
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



//-------------------User Login Functions---------------

export async function loginUser(email,password){
    const [user] = await pool.query(`select * from users where email = ? and password = ?`,[email,password])
    if (user[0] == undefined){
        return false
    }
    const userid = user[0].userID
    return getUserbyID(userid)
}





///-----------------Forget password--------------------
export async function updatePassword(email,password){
    const[user] = await pool.query(`update users set password = ? where email = ?`,[password,email])
    return {'message':'password updated successfully'}
}





//----------------Admin Adding-------------------------
export async function addInternship(name,price,level,tabdescription,description,imgurl){
    const [internship] = await pool.query(`insert into internships(name,price,level,tabDescrition,description,imgurl) values(?,?,?,?,?,?)`,[name,price,level,tabdescription,description,imgurl])

    return internship.insertId
}


export async function updateInternship(id,name,price,level,tabdescription,description,imgurl){
    const [internship] = await pool.query(`
    update internships 
    set name = ?,price=?,level=?,tabDescrition = ?,description=?,imgURL=?
    where internshipsID = ?`,[name,price,level,tabdescription,description,imgurl,id])

    return  {'message':'internship updated successfully'}
}


export async function delateInternshipByID(id){
    const [internship] =await pool.query(`delete from internships where internshipsID  = ?`,[id])
    return internship[0]
}

export async function addContent(title,content,pageNo,internshipID){
    const [con] = await pool.query(`insert into internshipContent(title,content,pageNo,internshipsID) values(?,?,?,?)`,[title,content,pageNo,internshipID])
    return con.insertId
}



export async function updateInternshipContent(id,title,content,pageNo,internshipID){
    const [con] = await pool.query(`
    update internshipContent 
    set title = ?,content=?,pageNo=?, internshipsID = ?
    where icID = ?`,[title,content,pageNo,internshipID,id])

    return  {'message':'internship data updated successfully'}
}

//-----------------Internships -----------------------

export async function getAllInternships(){
    const [internships] = await pool.query('select * from internships')
    return internships
}


export async function getInternshipsByID(id){
    const [internships] = await pool.query('select * from internships where internshipsID = ?',[id])
    return internships[0]
}

export async function enrolledInternship(internshipID,userID,progress){
    const [enrollment] = await pool.query(`insert into enrolledInternship(internshipsID, userID,progress) values(?,?,?)`,[internshipID,userID,progress])

    return enrollment.insertId
}

export async function getContent(iID,pageNo){
    const [con] = await pool.query(`select * from internshipContent where internshipsID=? and pageNo=?`,[iID,pageNo])
     return con[0]
}


