import React, { useEffect, useState } from 'react'
import "../style/adminservicedetail.css"
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminServiceDetail = () => {

    const { serviceID } = useParams();
    const [serviceDetails, setServiceDetails] = useState({})

    const navigate = useNavigate()


    const notifySuccess = (message) =>
        toast.success(message, {
            position: "top-center",
            autoClose: 2000,
        });

    const notifyError = (message) =>
        toast.error(message, {
            position: 'top-center',
            autoClose: 2000,
        });

    useEffect(() => {
        // Fetch service details based on the serviceID from your server
        const fetchServiceDetails = async () => {
            try {

                const adminToken = localStorage.getItem('adminToken');

                if (!adminToken) {
                    console.error('Admin Token is missing or invalid.');
                    return;
                }


                const response = await axios.get(`http://localhost:8080/service/${serviceID}`, {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                });
                setServiceDetails(response.data.service);
                // console.log(response.data.service)
            } catch (error) {
                console.error(`Error fetching details for serviceID ${serviceID}:`, error);
            }
        };

        fetchServiceDetails();
    }, [serviceID]);

    const deleteServiceData = async () => {

        // Display a confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");

        if (!confirmDelete) {
            return; // If user clicks Cancel, do nothing
        }


        try {

            const adminToken = localStorage.getItem('adminToken');

            if (!adminToken) {
                console.error('Admin Token is missing or invalid.');
                return;
            }

            const response = await axios.post(
                `http://localhost:8080/deleteService/${serviceDetails.serviceID}`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            const responseData = response.data;

            if (responseData.success) {
                notifySuccess(responseData.message);
                setTimeout(() => {
                    navigate('/adminservices')
                }, 1500)

            } else {
                notifyError(responseData.message);
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            notifyError('Error updating user data:', error);
        }
    };

    return (
        <div className='admin-servicedetail'>
            <h1>service detail</h1>
            <div className='admin-servicedetail-container'>
                <img src={serviceDetails.imgurl} alt="" />
                <div className='admin-servicedetail-header'>
                    <h2>{serviceDetails.name}</h2>
                    <Link to={`/servicechanges/${serviceDetails.serviceID}/update`}><button className='admin-btn'>Update</button></Link>
                    <Link><button className='admin-btn' onClick={deleteServiceData}>Delete</button></Link>
                </div>
                <div>
                    <h4>Service ID</h4>
                    <p>{serviceDetails.serviceID}</p>
                    <br />
                    <h4>Update date</h4>
                    <p>{serviceDetails.create_date}</p>
                    <br />
                    <h4>Create date</h4>
                    <p>{serviceDetails.update_date}</p>
                </div>
                <div>
                    <h4>Description :</h4>
                    <p>{serviceDetails.description}</p>
                </div>
                <div>
                    <h4>Tab Description :</h4>
                    <p>{serviceDetails.tabDescrition}</p>
                </div>
                <div>
                    <h4>Why choose US :</h4>
                    <p>{serviceDetails.whyChoose}</p>
                </div>
                <div>
                    <h4>Key points :</h4>
                    <ul>
                        {serviceDetails.keyPoints?.split(",").map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AdminServiceDetail
