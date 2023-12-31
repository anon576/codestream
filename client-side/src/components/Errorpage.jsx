import React from 'react'
import { Link } from 'react-router-dom'
import pagenotimage from '../images/pagenotfound.png'
import "../style/errorpage.css"

const Errorpage = () => {
  return (
    <div className='errorpage'>
      <div className="error-content">
        <h1 className='error404'>404</h1>
        <h2 className='oops'>Oops! Page not found</h2>
        <p>We can't seem to find the page you'er looking for.</p>
        <Link to="/">Go back to the Home page</Link>
      </div>
      <div className='error-image'>
        <img src={pagenotimage} alt="" />
      </div>
    </div>
  )
}

export default Errorpage
