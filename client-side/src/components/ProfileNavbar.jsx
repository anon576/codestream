import React, { useEffect, useState } from 'react';
import { FaUser, FaShop, FaEllipsisVertical, FaX, FaXmark } from 'react-icons/fa6';
import { Link, NavLink } from 'react-router-dom';
import '../style/profile.css';

const ProfileNavbar = () => {

  const [profileNavbar, setProfileNavbar] = useState(false);

  const openProfileNavbar = () => {
    setProfileNavbar(!profileNavbar);
  };


  return (
    <div className='profile'>
      <div className="profile-nav-menu" onClick={openProfileNavbar}>
        {profileNavbar ? <FaX /> : <FaEllipsisVertical />}
      </div>

      <div className={`profile-navbar ${profileNavbar ? 'profile-navbar-active' : null}`} >
        <ul>
          <NavLink to="/profile"><li><span><FaUser /></span>Personal Informantion</li></NavLink>
          <NavLink to="/enrolledservices"><li><span><FaShop /></span>Enrolled Services</li></NavLink>
          <NavLink to="#3"><li><span><FaShop /></span>Enrolled internship</li></NavLink>
          <NavLink to="#4"><li><span><FaShop /></span>Enrolled Courses</li></NavLink>
        </ul>
      </div>
    </div>
  )
}

export default ProfileNavbar
