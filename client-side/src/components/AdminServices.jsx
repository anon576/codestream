import React, { useEffect, useState } from 'react'
import "../style/adminservices.css"
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminServices = () => {


    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {

                const adminToken = localStorage.getItem('adminToken');

                if (!adminToken) {
                    console.error('Admin Token is missing or invalid.');
                    return;
                }

                const response = await axios.get('http://localhost:8080/services', {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                });
                setServices(response.data);
                console.log(services)
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();

    }, []);




    return (
        <div className='admin-services'>
            <h1>services</h1>
            <div className="admin-all-services">

                {services.map(service => (
                    <div className="admin-service-card">
                        <img src={service.imgurl} alt="" />
                        <h2>{service.name}</h2>
                        <h4>ID : {service.serviceID}</h4>
                        <Link to={`/adminservicedetail/${service.serviceID}`}> <button className='admin-btn'>veiw Detail</button></Link>
                    </div>
                ))}

                <div className="admin-service-card add-service ">
                    <Link to={`/servicechanges/noid/addservice`}><h1>+</h1></Link>
                    <h3>Add New Service</h3>
                </div>

            </div>
        </div>
    )
}

export default AdminServices
