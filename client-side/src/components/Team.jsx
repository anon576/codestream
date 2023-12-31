import React from 'react'
import { FaInstagram, FaXTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import "../style/team.css"


const Team = () => {
    return (
        <div className='team'>
            <div className="team-container">
                <h1>Our Team</h1>
                <div className="team-content">
                    <div className="team-card">
                        <div className="team-image-container">
                            <img src={"https://images2.alphacoders.com/133/1331228.jpeg"} alt="" />
                        </div>
                        <div className="team-detail">
                            <h2>Batman</h2>
                            <h3>Hero</h3>
                            <div className="team-social">
                                <Link to="#"><FaInstagram /></Link>
                                <Link to="#"><FaXTwitter /></Link>
                                <Link to="#"><FaGithub /></Link>
                                <Link to="#"><FaLinkedin /></Link>
                            </div>
                        </div>
                    </div>

                    <div className="team-card">
                        <div className="team-image-container">
                            <img src={"https://images2.alphacoders.com/133/1331228.jpeg"} alt="" />
                        </div>
                        <div className="team-detail">
                            <h2>Batman</h2>
                            <h3>Hero</h3>
                            <div className="team-social">
                                <Link to="#"><FaInstagram /></Link>
                                <Link to="#"><FaXTwitter /></Link>
                                <Link to="#"><FaGithub /></Link>
                                <Link to="#"><FaLinkedin /></Link>
                            </div>
                        </div>
                    </div>

                    <div className="team-card">
                        <div className="team-image-container">
                            <img src={"https://images2.alphacoders.com/133/1331228.jpeg"} alt="" />
                        </div>
                        <div className="team-detail">
                            <h2>Batman</h2>
                            <h3>Hero</h3>
                            <div className="team-social">
                                <Link to="#"><FaInstagram /></Link>
                                <Link to="#"><FaXTwitter /></Link>
                                <Link to="#"><FaGithub /></Link>
                                <Link to="#"><FaLinkedin /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Team
