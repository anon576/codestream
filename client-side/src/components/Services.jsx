import { React, useEffect, useState } from 'react'
import courses from "../images/courses.png"
import internship from "../images/internship.png"
import Review from './Review'
import axios from 'axios'
import { Link } from 'react-router-dom'
import "../style/services.css"

const Services = (props) => {

  const { setProgress } = props

  setProgress(40);

  // useEffect(() => {
  //   setProgress(40);

  //   setTimeout(() => {
  //     setProgress(100)
  //   }, 200)

  // }, [setProgress])

  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch services data from your server
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/services');
        setServices(response.data);
        console.log(services)
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();

  }, []);

  setProgress(100);

  return (
    <div className='services'>
      <div className="services-container">

        <div className="services-sub-container">

          <h1>All Services</h1>

          {services.map(service => (
            <div key={service.id} className="services-cards">
              <div className="services-img">
                <img src={service.imgurl} alt={service.name} />
              </div>
              <div className="services-content">
                <h2>{service.name}</h2>
                <p>{service.description}</p>
                {/* <button>View Detail</button> */}
                <Link to={`/service/${service.serviceID}`}><button>Read More</button></Link>
              </div>
            </div>
          ))}

        </div>

        <div className="services-sub2-container">
          <div className="courses-intership-services">

            <h1>Free Courses</h1>
            <div className="services-cards">
              <div className="services-img">
                <img src={courses} alt="" />
              </div>
              <div className="services-content">

                <p>Navigate the digital landscape with a website that reflects the precision of your business. Our bespoke website development services merge seamless functionality with aesthetic finesse, creating an online presence that resonates with your brand identity and captivates your audience.</p>
                <button>Explore All Courses</button>
              </div>
            </div>

            <h1>Internship Services</h1>
            <div className="services-cards">
              <div className="services-img">
                <img src={internship} alt="" />
              </div>
              <div className="services-content">

                <p>Navigate the digital landscape with a website that reflects the precision of your business. Our bespoke website development services merge seamless functionality with aesthetic finesse, creating an online presence that resonates with your brand identity and captivates your audience.</p>
                <button>View Available internships</button>
              </div>
            </div>

          </div>
        </div>

        {/* <div className="services-review">
          <div className="services-review-container">

            <div className="review-header">
              <h1>What our clients say?</h1>
              <h3>Hear What Our Clients Have to Say About Us</h3>
            </div>

            <div className="services-review-cards">
              <div className="review-card">
                <p><FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStarHalfStroke /> </p>
                <p>Streamline's hosting services have been a game-changer for our business. Their reliable and secure hosting solutions have ensured our website is always up and running smoothly.</p>
                <p className="name">Peter Parker</p>
              </div>

              <div className="review-card">
                <p><FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaRegStar /> </p>
                <p>We've been working with Streamline for years, and their team has always provided us with exceptional service and support. Their expertise and dedication have helped us achieve our digital goals.</p>
                <p className="name">Tony Strak</p>
              </div>
            </div>
          </div>
        </div> */}

        <Review />

      </div>
    </div>
  )
}

export default Services
