import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../style/adminusers.css'
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminUsers = () => {

    const [allUsers, setAllUsers] = useState([]);

    const [specificUser, setSpecificUser] = useState({})

    const [userData, setUserData] = useState({});

    const [openDetailCard, setOpenDetailCard] = useState(false);

    const openCard = () => {
        setOpenDetailCard(!openDetailCard)
    }

    const [openAdduser, setopenAdduser] = useState(false);

    const openForm = () => {
        setopenAdduser(!openAdduser)
    }

    const notifySuccess = (message) =>
        toast.success(message, {
            position: "top-center",
            autoClose: 2000,
        });

    const notifyError = (message) =>
        toast.error(message, {
            position: 'top-center',
            autoClose: 2000,
        });

    useEffect(() => {
        const fetchAllUsers = async () => {

            const adminToken = localStorage.getItem('adminToken');

            if (!adminToken) {
                console.error('Admin Token is missing or invalid.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/getallusers', {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                });
                // console.log(response.data)
                setAllUsers(response.data)
                // console.log(allUsers)
            } catch (error) {
                console.log("error getting all users", error);
            }
        }
        fetchAllUsers()
    }, []);

    // useEffect(() => {
    //     console.log(allUsers); // Log the updated state
    // }, [allUsers]); // Add allUsers as a dependency

    const formateDate = (dob) => {
        if (dob) {
            const dobDate = new Date(dob);
            dobDate.setDate(dobDate.getDate());
            const formattedDate = dobDate.toLocaleDateString('en-CA'); // Adjust the locale if needed

            return formattedDate;
        } else {
            return 'not given';
        }
    };

    const handleKnowMore = (user) => {
        setSpecificUser(user);
        openCard()
        console.log(specificUser)
    };

    const submitForm = async (e) => {
        e.preventDefault();

        try {

            const adminToken = localStorage.getItem('adminToken');

            if (!adminToken) {
                console.error('Admin Token is missing or invalid.');
                return;
            }

            const response = await axios.post('http://localhost:8080/adduser', userData, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            if (response.status === 200) {
                console.log(response.data.message);
                // alert(response.data.message);
                notifySuccess(response.data.message)
                setTimeout(() => {
                    openForm();
                }, 2000)
            } else {
                console.error('Registration failed:', response.data.message);
                // alert(response.data.message);
                notifyError(response.data.message)
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
            // alert(`catched error :${error.response.data.message}`);
            notifyError(error.response.data.message)
        }

    };



    return (
        <div className='admin-users'>
            <div className="admin-users-table">
                <div className="admin-user-header">
                    <h1>All Users</h1>
                    <Link><button className="admin-btn" onClick={openForm}>+ Add New User</button></Link>
                </div>
                <table>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email ID</th>
                        <th>Date</th>
                        <th>Mobile No.</th>
                        <th>know More</th>
                    </tr>

                    {allUsers.map(user => (
                        <tr style={{ backgroundColor: user.verify ? "" : "#e5383ba0" }}>
                            <td>{user.userID}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{formateDate(user.date)}</td>
                            <td>{user.mobile}</td>
                            <td>
                                <Link onClick={() => handleKnowMore(user)}>Know More</Link>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>

            <div className={`user-detail-cards ${openDetailCard ? "active-card" : ""}`}>
                <div className="user-detail-card">
                    <div>
                        <span>UserID</span>
                        <p>{specificUser.userID}</p>
                    </div>

                    <div>
                        <span>Name</span>
                        <p>{specificUser.name}</p>
                    </div>

                    <div>
                        <span>Email</span>
                        <p>{specificUser.email}</p>
                    </div>

                    <div>
                        <span>MObile no.</span>
                        <p>{specificUser.mobile}</p>
                    </div>

                    <div>
                        <span>Date of Birth</span>
                        <p>{formateDate(specificUser.dob)}</p>
                    </div>

                    <div>
                        <span>Address</span>
                        <p>{specificUser.address}</p>
                    </div>

                    <div>
                        <span>College</span>
                        <p>{specificUser.college}</p>
                    </div>

                    <div>
                        <span>OTP</span>
                        <p>{specificUser.otp}</p>
                    </div>

                    <div>
                        <span>Verified</span>
                        <p>{specificUser.verify || "NULL"}</p>
                    </div>

                    <div>
                        <span>password</span>
                        <p>{specificUser.password}</p>
                    </div>
                    <p className="close" onClick={openCard}>Close</p>

                </div>
            </div>

            <div className={`adduser-container ${openAdduser ? "active-form" : ""}`}>
                <form action="" className='adduser-form' onSubmit={submitForm}>
                    <div>
                        <span>Email</span>
                        <input
                            type="email"
                            name='email'
                            required
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <span>Name</span>
                        <input type="text"
                            name="name"
                            required
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <span>Password</span>
                        <input type="text"
                            name='password'
                            required
                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        />
                    </div>

                    <button className="admin-btn">submit</button>
                    <p className="close" onClick={openForm}>Close</p>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AdminUsers
