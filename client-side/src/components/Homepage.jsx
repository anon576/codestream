import { React, useEffect, useState } from 'react'
// import headerImage from "../images/hea/der_1.jpg"
import featureImage from '../images/feature-image.png'
import Review from './Review'
import { Link } from 'react-router-dom'
import axios from 'axios'
import "../style/homepage.css"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Homepage = (props) => {

  const { setProgress } = props

  useEffect(() => {
    setProgress(40);

    setTimeout(() => {
      setProgress(100)
    }, 200)

  }, [setProgress])

  const notifySuccess = () => toast.success("Wow so easy!", {
    position: "top-right"
  });

  const notifyError = () => toast.error("Wow so easy!", {
    position: "top-right"
  });


  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch services data from your server
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const displayServices = services.slice(0, 3)

  return (
    <div className='homepage'>
      {/* <section className="hero-section">
        <div className='hero-heading'><h1>Unlocking Potential, Empowering Success: CodeStream IT Solutions and Training</h1> <button className='button'>Get Started</button></div>

      </section> */}
      {/* <section className="hero-section-1">
        <h1>Codestream</h1>
        <p>Unlocking Potential, Empowering Success: CodeStream IT Solutions and Training</p>
        <div className="hero-buttons">
          <button className='button'>Get Started</button>
          <button className='button'>Watch the demo</button>
        </div>
      </section> */}

      <section className="hero-header">
        <div className="hero-description">
          <h1>Codestream</h1>
          <h2>Unlocking Potential, Empowering Success: CodeStream IT Solutions and Training</h2>
          <p>Codestream is a leading technology company providing innovative web development, app development, and hosting services. Our team of experts delivers cutting-edge digital solutions that will take your business to the next level.</p>
          <div className="hero-buttons">
            <button className='button' onClick={notifyError}>Get Started</button>
            <button className='button' onClick={notifySuccess}>Watch the demo</button>
          </div>
        </div>
        <div className="hero-image"> </div>
      </section>

      <section className="home-services">
        <div className="home-services-content">
          <div className="home-services-header">
            <h1>Our services</h1>
            <Link to="/services"><button className='home-button'>view All services</button></Link>
          </div>

          <div className="home-services-cards">

            {/* <div className="services-card-contain">
              <img src="https://images.pexels.com/photos/39284/macbook-apple-imac-computer-39284.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
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
            </div> */}

            {displayServices.map(service => (
              <div key={service.serviceID} className="services-card-contain">
                <img src={service.imgurl} alt={service.name} />
                <div className='services-text'>
                  <h2>{service.name}</h2>
                  <p>{service.description}</p>
                  {/* <Link to={"/services"+"/"+service.serviceID}>Read More</Link> */}
                  <Link to={`/service/${service.serviceID}`}>Read More</Link>
                </div>
              </div>
            ))}

          </div>

        </div>

        <div className="features">
          <h3><span>Features and Benefits</span></h3>
          <div className='features-container'>
            <div className="features-content">
              <h2>Features</h2>
              <li>Custom Web Development</li>
              <li>Innovative App Development</li>
              <li>Secure Hosting Services</li>
              <li>Professional Training Programs</li>
              <li>Free Courses for Continued Learning</li>
            </div>

            <div className="features-content">
              <h2>Benefits</h2>
              <li>Enhanced Customer Engagement</li>
              <li>Increased Online Visibility</li>
              <li>Secure and Reliable Hosting</li>
              <li>Upgraded Digital Skills</li>
              <li>Long-Term Partnership with Trusted Experts</li>
            </div>

            <div className="feature-img">
              <img src={featureImage} alt="" />
            </div>

          </div>
        </div>

      </section>
      <Review />
      <ToastContainer />

    </div>
  )
}

export default Homepage
