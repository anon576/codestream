import React, { useState } from 'react';
import { FaAngleDown, FaBars, FaXmark } from "react-icons/fa6";
import "../style/nav-bar.css"
import logo from "../images/logo.png"
import { Link, useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';

const Header = (props) => {

  const isUserSignedIn = !!localStorage.getItem('token')

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  let handleMenu = () => {
    setShowMenu(!showMenu)
  }

  const GoToRegister = () => {
    navigate('/signup')
    handleMenu()
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    // navigate('/login')
}


  return (
    <div className="nav-bar">
      <div className="logo">
        <img src={logo} alt="" />
        <span className="name">Codestream</span>
      </div>
      <ul className='nav-links'>
        <li><Link to="/">Home</Link></li>
        <div className="sub-links">
          <li><Link to="/about">About</Link><span className='drop-icon'><FaAngleDown /></span></li>
          <div className="sub-links-options">
            <li><Link to="#">Our Mission</Link></li>
            <li><Link to="#">Our Team</Link></li>
            <li><Link to="/about#projects">Projects</Link></li>
            <li><Link to="#">Clients review</Link></li>
          </div>
        </div>

        <div className="sub-links">
          <li><Link to="/courses">Courses</Link><span className='drop-icon'><FaAngleDown /></span></li>
          <div className="sub-links-options">
            <li><Link to="#">hello earth</Link></li>
            <li><Link to="#">hello earth</Link></li>
            <li><Link to="#">hello earth</Link></li>
            <li><Link to="#">hello earth</Link></li>
            <li><Link to="#">hello earth</Link></li>
            <li><Link to="#">hello earth</Link></li>
            <li><Link to="#">hello earth</Link></li>
          </div>
        </div>

        <div className="sub-links">
          <li><Link to="/services">Services</Link><span className='drop-icon'><FaAngleDown /></span></li>
          <div className="sub-links-options">
            <li><Link to="#">Web development</Link></li>
            <li><Link to="#">Android Development</Link></li>
            <li><Link to="#">Web Hosting</Link></li>
            <li><Link to="#">Api Services</Link></li>
            <li><Link to="#">Free Courses</Link></li>
            <li><Link to="#">Free Training</Link></li>
          </div>
        </div>

        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
      <ul className='nav-buttons'>
        {isUserSignedIn ? (
          " "
        ) : (
          <>
            <li className='button login-button' onClick={() => props.trigger(true)}>login</li>
            <li className='button login-button' onClick={() => navigate('/signup')}>signUp</li>
          </>
        )}
        <li className='menu-bar' onClick={handleMenu}><FaBars /></li>
      </ul>

      <div className={`slider ${showMenu ? 'open-slider' : null}`}>
        <ul className='slider-content'>
          <div className='nav-buttons slider-btn'>
            {isUserSignedIn ? (
              " "
            ) : (
              <>
                <li className='button' onClick={() => props.trigger(true)}>login</li>
                <li className='button' onClick={GoToRegister}>signUp</li>
              </>
            )}
            <li className='menu-cross' onClick={handleMenu}><FaXmark /></li>
          </div>
          <Link to="/" onClick={handleMenu}>Home</Link>
          <Link to="/about" onClick={handleMenu}>About</Link>
          <Link to="#" onClick={handleMenu}>Courses</Link>
          <Link to="/services" onClick={handleMenu}>Services</Link>
          <Link to="/internship" onClick={handleMenu}>Internship</Link>
          <Link to="#" onClick={handleMenu}>Blog</Link>
          <Link to="/contact" onClick={handleMenu}>Contact</Link>
          {/* <div className="theme">
            <input type="checkbox" id='theme' />
            <label htmlFor="theme" className='theme-button'>Theme<span className='drop-theme'><FaAngleDown /></span></label>
            <div className="collapsible-content">
              <Link>Light</Link>
              <Link>Dark</Link>
            </div>
          </div> */}
          {isUserSignedIn ? (
            <Link to="/profile" onClick={handleMenu}>profile</Link>
          ) : ""}

          <Link to="#">Faq's</Link>

          {isUserSignedIn ? (
            <Link className='logout' onClick={handleSignOut}>logout</Link>
          ) : ""}

        </ul>

      </div>
      <div className={`nav-over-lay ${showMenu ? 'open-nav-over-lay' : null}`} onClick={handleMenu} ></div>
    </div>
  );
};

export default Header;