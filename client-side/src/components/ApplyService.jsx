import React, { useEffect, useState } from 'react'
import "../style/applyservice.css"
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApplyService = () => {

    const [userData, setUserData] = useState({});

    const [formData, setFormData] = useState({})

    const { serviceID } = useParams();

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

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Token is missing or invalid.');
                return;
            }

            const response = await axios.get('http://localhost:8080/getUserData', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;

            if (data.success) {
                const user = data.userdata;
                setUserData(user);
            } else {
                console.error('Error in response:', data.message);
            }
        } catch (error) {
            console.error('Error fetching user profile data:', error);
            notifyError('Error fetching user profile data:', error);
        }
    };

    const [serviceDetails, setServiceDetails] = useState({})

    useEffect(() => {
        // Fetch service details based on the serviceID from your server
        const fetchServiceDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/service/${serviceID}`);
                setServiceDetails(response.data);
            } catch (error) {
                console.error(`Error fetching details for serviceID ${serviceID}:`, error);
            }
        };

        fetchServiceDetails();
    }, [serviceID]);


    useEffect(() => {
        fetchUserProfile();
    }, []);


    useEffect(() => {
        setFormData({
            userid: userData.userID,
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile || '',
            contactStyle: '',
            contactTime: '',
            projectDescription: '',
            budget: '0',
            projectDeadline: 'Nan',
            howyouknowus: ' ',
            serviceType: serviceDetails.name,
            serviceid: serviceDetails.serviceID
        });
    }, [userData]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const submit = (e) => {
        e.preventDefault()
        console.log(formData);
        submitApplication(formData)
    }

    const submitApplication = async (data) => {
        try {
            const response = await axios.post('http://localhost:8080/applyService', data);

            if (response.success) {
                notifySuccess(response.data.message)
            } else {
                console.error('Registration failed:', response.data.message);
                notifySuccess(response.data.message)
                setFormData({
                    contactStyle: '',
                    contactTime: '',
                    projectDescription: '',
                    budget: '0',
                    projectDeadline: 'Not Given',
                    howyouknowus: ' ',
                });
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
            notifyError(error.response.data.message)
        }
    }



    return (
        <div className='apply-service'>
            <div className="apply-service-container">

                <div className="apply-service-main-container">
                    <div className="service-apply-info hidden-service-info">
                        <h1 className="service-apply-info-header">Instructions</h1>
                        <ul>
                            <li>Lorem ipsum dolor sit amet.</li>
                            <li>Lorem ipsum dolor sit amet.</li>
                            <li>Lorem ipsum dolor sit amet.</li>
                            <li>Lorem ipsum dolor sit amet.</li>
                            <li>Lorem ipsum dolor sit amet.</li>
                            <li>Lorem ipsum dolor sit amet.</li>
                        </ul>
                    </div>

                    <div className="service-features">
                        <h1 className="service-features-header">{serviceDetails.name}</h1>
                        <ul>
                            {/* {serviceDetails.map(service => ( */}
                            <li>{serviceDetails.description}</li>
                            <li>{serviceDetails.description}</li>
                            <li>{serviceDetails.description}</li>
                            {/* ))} */}
                        </ul>
                    </div>
                </div>

                <div className="service-apply-form">
                    <form action="" className='service-form' onSubmit={submit}>
                        <h1>Application Form</h1>
                        <div>
                            <p>Name :</p>
                            <input type="text" name='name' value={userData.name} disabled />
                        </div>
                        <div>
                            <p>Email :</p>
                            <input type="email" name='email' value={userData.email} disabled />
                        </div>
                        <div className='mobile-contact-style'>
                            <div>
                                <p>Mobile :</p>
                                <input type="number" name='mobile'
                                    value={userData.mobile}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='contact-style-div'>
                                <p>Contact Style :</p>
                                <select name="contactStyle" id="contactStyle"
                                    onChange={handleInputChange} value={formData.contactStyle} required>
                                    <option value="">Select an option</option>
                                    <option value="mail">Mail</option>
                                    <option value="call">Call</option>
                                    <option value="whatsapp">Whatsapp</option>
                                    <option value="meet">Meet</option>
                                </select>
                            </div>
                        </div>

                        <div className='contact-style-div'>
                            <p>preferred Time for Assistance:</p>
                            <select name="contactTime" id="conctactTime"
                                onChange={handleInputChange} value={formData.contactTime} required>
                                <option value="">Select an option</option>
                                <option value="morning">Morning (8-10)</option>
                                <option value="noon">Noon (1-3)</option>
                                <option value="evening">Evening (6-9)</option>
                            </select>
                        </div>

                        <div>
                            <p>Project Description :</p>
                            <textarea type="text" name='projectDescription'
                                className='project-description'
                                value={formData.projectDescription}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="budget-deadline">
                            <div>
                                <p>Budget (optional) :</p>
                                <input type="text" name='budget'
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <p>Deadline (optional) :</p>
                                <input type="text" name='projectDeadline'
                                    value={formData.projectDeadline}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div>
                            <p>How did you hear about us?</p>
                            <select name="howyouknowus" onChange={handleInputChange} value={formData.howyouknowus} required>
                                <option value="">Select an option</option>
                                <option value="friend">From a friend</option>
                                <option value="social-media">Social Media</option>
                                <option value="website">Our Website</option>
                                <option value="event">Event/Conference</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <button className='service-apply-button'>Submit</button>
                    </form>
                </div>
                <div className="service-apply-info">
                    <h1 className="service-apply-info-header">Instructions</h1>
                    <ul>
                        <li>Lorem ipsum dolor sit amet.</li>
                        <li>Lorem ipsum dolor sit amet.</li>
                        <li>Lorem ipsum dolor sit amet.</li>
                        <li>Lorem ipsum dolor sit amet.</li>
                        <li>Lorem ipsum dolor sit amet.</li>
                        <li>Lorem ipsum dolor sit amet.</li>
                    </ul>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ApplyService
