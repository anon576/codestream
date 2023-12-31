import { React, useEffect } from 'react'
import AboutHeader from "../images/learning_2.jpg"
import Review from './Review'
import Team from './Team'
import "../style/about.css"
import Projects from './Projects'

const About = (props) => {

    const { setProgress } = props

    useEffect(() => {
        setProgress(40);

        setTimeout(() => {
            setProgress(100)
        }, 200)

    }, [setProgress])

    return (
        <div className='about'>
            <div className="about-header">
                <div className='about-heading'>
                    <h1>Mission statement</h1>
                    <p>At Streamline, we’re committed to providing cutting-edge technology services that help businesses of all sizes achieve their goals. Our team of experts combines technical knowledge with creativity and passion to deliver custom solutions that are tailored to our clients’ needs. We value customer satisfaction and strive to exceed expectations with every project we undertake.</p>
                </div>
                <div className="about-image">
                    <img src={AboutHeader} alt="" />
                </div>
            </div>

            <Team/>

            <Projects />

            <Review />


        </div>

    )
}

export default About
