import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import "../style/servicesdetail.css"

const ServicesDetail = (props) => {

    const { setProgress } = props

    setProgress(40)

    const { serviceID } = useParams();
    const [serviceDetails, setServiceDetails] = useState({})

    useEffect(() => {
        // Fetch service details based on the serviceID from your server
        const fetchServiceDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/service/${serviceID}`);
                setServiceDetails(response.data.service);
                console.log(serviceDetails)
            } catch (error) {
                console.error(`Error fetching details for serviceID ${serviceID}:`, error);
            }
        };

        fetchServiceDetails();
    }, [serviceID]);

    setProgress(100)

    return (
        <div className='servicesdetail'>
            <div className="servicesdetail-container">
                <h1>{serviceDetails.name}</h1>
                <div className="servicesdetail-image-container"><img src={serviceDetails.imgurl} alt={serviceDetails.name} /></div>

                <div className="servicesdetail-header">
                    <h1>Description</h1>
                    <Link to={`/applyservice/${serviceID}`}><button className='home-button apply-button'>apply</button></Link>
                </div>
                <div className="servicesdetail-content">
                    <p>{serviceDetails.description} Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam voluptas harum unde officia illum quae eaque repudiandae aperiam id repellat temporibus natus sint, debitis earum ea odio beatae quas consectetur quisquam magnam sequi. Doloribus deserunt eum placeat alias dolorem. Provident.</p>
                    <ul>
                        <li><p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, autem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto corporis dicta consequuntur et expedita non. Voluptas libero </p></li>
                        <li><p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, autem.</p></li>
                        <li><p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, autem.</p></li>
                        <li><p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, autem.</p></li>
                        <li><p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, autem.</p></li>
                    </ul>

                    <div className="keypoints">
                        <h3>Key Points :</h3>
                        <li>Custom Web Development</li>
                        <li>Innovative App Development</li>
                        <li>Secure Hosting Services</li>
                        <li>Professional Training Programs</li>
                        <li>Free Courses for Continued Learning</li>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServicesDetail
