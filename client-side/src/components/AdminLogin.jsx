import React, { useState } from 'react';
import axios from 'axios';
import logo from "../images/logo.png";
import "../style/adminlogin.css";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const notifySuccess = (message) => toast.success(message, {
        position: "top-center",
        autoClose: 2000,
    });

    const notifyError = (message) => toast.error(message, {
        position: "top-center",
        autoClose: 2000,
    });

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        adminLogin()

    };

    const adminLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/adminLogin', {
                username,
                password,
            });

            if (response.status === 200) {
                console.log('Login Successful');
                // console.log('Admin Token:', response.data.adminToken);
                const adminToken = response.data.adminToken;
                await localStorage.setItem('adminToken', adminToken)
                notifySuccess("login success")
                setTimeout(() => {
                    navigate("/admindashboard")
                }, 1500)
            } else {
                console.log('Login Failed');
                notifyError("login fail")
            }
        } catch (error) {
            console.error('Error during login:', error.message);
            notifyError("login fail", error.message)
        }
    }

    return (
        <div className='admin-login'>

            <div className="admin-upper-navbar">

                <div className="admin-logo">
                    <img src={logo} alt="" />
                    <span className="name">Codestream</span>
                </div>

                <div className="admin-search-bar">
                    <h1 style={{ color: "white" }}>Admin Route</h1>
                </div>

            </div>

            <div className="admin-login-form-container">
                <form onSubmit={handleLogin} className='admin-login-form'>

                    <h1>Admin Login</h1>

                    <div>
                        <span>User Name</span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <span>Password</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className='show-password'>
                        <input type="checkbox" id='showPass'
                            onChange={() => { setShowPassword(!showPassword) }}
                        />
                        <label htmlFor="showPass">Show password</label>
                    </div>

                    <button type="submit">LOGIN</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AdminLogin;

