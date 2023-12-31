import React from 'react'
import { FaStar, FaStarHalfStroke,FaRegStar } from "react-icons/fa6";


const Review = () => {
  return (
    <div className='review'>
      <div className="services-review">
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
      </div>

    </div>
  )
}

export default Review
