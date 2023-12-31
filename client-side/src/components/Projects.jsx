import React from 'react'
import "../style/projects.css"

import webdev from "../images/webdevelopment.png"
import hosting from "../images/hosting.png"
import appdev from "../images/appdevelopment.png"
import { Link } from 'react-router-dom'

const Projects = () => {
    return (
        <div className='projects' id='projects'>
            <div className="project-container">
                <div className="project-heading">
                    <h1>Some Projects</h1>
                    <button className='home-button'>Explore All Projects</button>
                </div>
                <div className="project-content">
                    <div className="home-services-cards">

                        <div className="services-card-contain">
                            <img src={webdev} alt="" />
                            <div className='services-text'>
                                <h2>Web Development</h2>
                                <p>We create custom websites that are responsive, scalable, and secure, tailored to your brand message and user needs.</p>
                                <Link to="#">Read More</Link>
                            </div>
                        </div>

                        <div className="services-card-contain">
                            <img src={hosting} alt="" />
                            <div className='services-text'>
                                <h2>Hosting Services</h2>
                                <p>We offer reliable and secure hosting services that cater to your specific business needs, ensuring your website is always up and running.</p>
                                <Link to="#">Read More</Link>
                            </div>
                        </div>

                        <div className="services-card-contain">
                            <img src={appdev} alt="" />
                            <div className='services-text'>
                                <h2>App Development</h2>
                                <p>We specialize in creating custom mobile apps that reflect your brand, engage your audience, and deliver an exceptional user experience.</p>
                                <Link to="#">Read More</Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Projects
