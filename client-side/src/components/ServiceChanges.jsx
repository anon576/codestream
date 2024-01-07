import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/servicechanges.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

const ServiceChanges = () => {

    const { serviceID, changetype } = useParams();
    // console.log(changetype)


    const [serviceData, setServiceData] = useState({});

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

    const fetchServiceById = async () => {
        try {

            const response = await axios.get(`http://localhost:8080/service/${serviceID}`);

            const data = response.data;

            if (data.success) {
                const service = data.service;
                setServiceData(service);
                // console.log(service)
            } else {
                console.error('Error in response:', data.message);
            }
        } catch (error) {
            console.error('Error fetching service data:', error);
        }
    }

    useEffect(() => {
        fetchServiceById();
    }, [])


    const [formData, setFormData] = useState({
        serviceID: '',
        name: '',
        imgurl: '',
        description: '',
        tabDescription: '',
        whyChoose: '',
        keyPoints: ''
    });

    useEffect(() => {
        setFormData({
            serviceID: serviceID,
            name: serviceData.name || '',
            imgurl: serviceData.imgurl || '',
            description: serviceData.description || '',
            tabDescription: serviceData.tabDescrition || '',
            whyChoose: serviceData.whyChoose || '',
            keyPoints: serviceData.keyPoints || ''
        })
    }, [serviceData])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const submit = async (e) => {
        e.preventDefault();
        // formData.id = userData.userID;
        // console.log(formData)
        // if (changetype === "update") {
        submitUpdate(formData)
        // } else {
        // }
    }

    const addData = async (e) => {
        e.preventDefault();
        addServiceData(formData)

    }



    const submitUpdate = async (data) => {
        try {

            const adminToken = localStorage.getItem('adminToken');

            if (!adminToken) {
                console.error('Admin Token is missing or invalid.');
                return;
            }

            const response = await axios.put(
                'http://localhost:8080/updateService', data, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            const responseData = response.data;

            if (responseData.success) {
                notifySuccess(responseData.message);
                setTimeout(() => {
                    navigate(`/adminservicedetail/${formData.serviceID}`)
                }, 1500);

            } else {
                notifyError(responseData.message);
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            notifyError('Error updating user data:', error);
        }
    };

    const addServiceData = async (data) => {
        try {
            // console.log(data)
            const response = await axios.post(
                'http://localhost:8080/addService', data);

            const responseData = response.data;

            if (responseData.success) {
                notifySuccess(responseData.message);
                setTimeout(() => {
                    navigate('/adminservices')
                }, 1500);
            } else {
                notifyError(responseData.message);
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            notifyError('Error updating user data:', error);
        }
    };

    if (changetype === "update") {

        return (
            <div className='service-changes'>
                <div className="service-changes-container">
                    <h1>Updade Form</h1>
                    <form action="" className='service-changes-form' onSubmit={submit}>
                        <p>ID : {formData.serviceID}</p>
                        <div>
                            <p>Name</p>
                            <input
                                type="text"
                                value={formData.name}
                                name='name'
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <p>img url</p>
                            <textarea
                                id="" cols="1" rows="1"
                                value={formData.imgurl}
                                name='imgurl'
                                onChange={handleInputChange}
                            ></textarea>
                            {/* <input
                                type="text"
                                value={formData.imgurl}
                                name='imgurl'
                                onChange={handleInputChange}
                            /> */}
                        </div>

                        <div>
                            <p>Description</p>
                            <textarea
                                name="description"
                                id="" cols="30"
                                rows="10"
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div>
                            <p>Tab Description</p>
                            <textarea
                                name="tabDescription"
                                id="" cols="30"
                                rows="10"
                                value={formData.tabDescription}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div>
                            <p>why Choose Us</p>
                            <textarea
                                name="whyChoose"
                                id="" cols="30"
                                rows="10"
                                value={formData.whyChoose}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div>
                            <p>Key Points (separate each point with comma ",")</p>
                            <textarea
                                name="keyPoints"
                                id="" cols="30"
                                rows="10"
                                value={formData.keyPoints}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <button className='admin-btn' >Update</button>

                    </form>
                </div>
                <ToastContainer />
            </div>
        )

    } else {
        return (
            <div className='service-changes'>
                <div className="service-changes-container">
                    <h1>Add Service form</h1>
                    <form action="" className='service-changes-form' onSubmit={addData}>
                        {/* <p>ID : {formData.serviceID}</p> */}
                        <div>
                            <p>Name</p>
                            <input
                                type="text"
                                value={formData.name}
                                name='name'
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <p>img url</p>
                            <input
                                type="text"
                                value={formData.imgurl}
                                name='imgurl'
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <p>Description</p>
                            <textarea
                                name="description"
                                id="" cols="30"
                                rows="10"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <p>Tab Description</p>
                            <textarea
                                name="tabDescription"
                                id="" cols="30"
                                rows="10"
                                value={formData.tabDescription}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <p>why Choose Us</p>
                            <textarea
                                name="whyChoose"
                                id="" cols="30"
                                rows="10"
                                value={formData.whyChoose}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <p>Key Points (separate each point with comma ",")</p>
                            <textarea
                                name="keyPoints"
                                id="" cols="30"
                                rows="10"
                                value={formData.keyPoints}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>

                        <button className='admin-btn' >Add Service</button>

                    </form>
                </div>
                <ToastContainer />
            </div>
        )
    }



}

export default ServiceChanges
