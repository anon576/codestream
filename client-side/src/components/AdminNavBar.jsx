import React, { useState } from 'react'
import logo from "../images/logo.png"
import { Link, useNavigate } from 'react-router-dom'
import { FaBars } from 'react-icons/fa6'
import "../style/adminnavbar.css"

const AdminNavBar = () => {

    const [openSideBar, setOpenSideBar] = useState(false);

    const navigate = useNavigate()

    const handleSideBar = () => {
        setOpenSideBar(!openSideBar)
    }


    const handleSignOut = () => {
        localStorage.removeItem('adminToken')
        window.location.reload();
    }



    return (
        <div className='admin-navbar'>
            <div className="admin-upper-navbar">

                <div className="admin-logo">
                    <img src={logo} alt="" />
                    <span className="name">Codestream</span>
                </div>

                <div className="admin-search-bar">
                    <input type="text" name="" id="" placeholder='Search anything...' />
                    <button className='admin-btn'>seacrch</button>
                </div>

                <div className='menu-bar'>
                    <p onClick={handleSideBar}><FaBars /></p>
                </div>
            </div>

            <div className={`admin-side-navbar ${openSideBar ? 'active-admin-side-navbar' : " "}`}>
                <div className="admin-side-navbar-container">
                    <Link to="/admindashboard">Dashboard</Link>
                    <Link to="/adminusers" >Users</Link>
                    <Link to="/adminservices" >Services</Link>
                    <Link to="/activeservices">Active Services</Link>
                    <Link>Courses</Link>
                    <Link>Internships</Link>
                </div>
                <div className='admin-logout'>
                    <Link onClick={handleSignOut}>Logout</Link>
                </div>
            </div>

            <div className={`admin-side-navbar-overlay ${openSideBar ? 'active-admin-side-navbar-overlay' : " "}`}
                onClick={handleSideBar}
            ></div>

        </div>
    )
}

export default AdminNavBar
