import React, { useEffect, useState } from 'react'
import "../style/activeservices.css"
import axios from 'axios';
import { Link } from 'react-router-dom';
import Expandable from './Expandable';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ActiveServices = () => {

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

    const [allActiveServices, setAllActiveServices] = useState([])

    const [description, setDescription] = useState(" ")

    const [openDescription, setOpenDescription] = useState(false)

    const [openForm, setOpenForm] = useState(false)

    const [formData, setFormData] = useState({
        budget: '',
        projectDeadline: '', // Add other properties with default values
        outStandingAmount: '',
        AdvancedPayment: '',
        FinalPayment: '',
        projectDescription: '',
        stage1: false,
        stage2: false,
        stage3: false,
        stage4: false,
        stage5: false,
        stage6: false,
    });
    const openDescriptionCard = (data) => {
        setDescription(data)
        setOpenDescription(!openDescription)
    }

    const openFormCard = () => {
        setOpenForm(!openForm)
    }

    const getPreFormData = (data) => {
        openFormCard()
        setFormData(data)
    }

    const handleCheckboxUpdate = (stageNumber, isChecked) => {
        let stageValue = 0;

        if (isChecked) {
            switch (stageNumber) {
                case 1:
                    stageValue = '16';
                    break;
                case 2:
                    stageValue = '32';
                    break;
                case 3:
                    stageValue = '48';
                    break;
                case 4:
                    stageValue = '64';
                    break;
                case 5:
                    stageValue = '80';
                    break;
                case 6:
                    stageValue = '100';
                    break;
                default:
                    break;
            }
        }

        setFormData((prevData) => ({
            ...prevData,
            [`stage${stageNumber}`]: stageValue,
        }));
    };

    const handelupdate = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name.startsWith('stage')) {
            const stageNumber = parseInt(name.replace('stage', ''));
            handleCheckboxUpdate(stageNumber, checked);
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const hanldeSubmit = async (e) => {
        e.preventDefault()
        console.log(formData)

        try {

            const adminToken = localStorage.getItem('adminToken');

            if (!adminToken) {
                console.error('Admin Token is missing or invalid.');
                return;
            }

            const response = await axios.put(
                'http://localhost:8080/updateactiveservice', formData, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            const responseData = response.data;

            if (responseData.success) {
                notifySuccess(responseData.message);
                setTimeout(() => {
                    openFormCard()
                }, 1500);

            } else {
                notifyError(responseData.message);
            }
        } catch (error) {
            console.error('Error updating active services data:', error);
            notifyError('Error updating active services data:', error);
        }
    }

    useEffect(() => {
        const fetchAllActiveServices = async () => {
            try {

                const adminToken = localStorage.getItem('adminToken');

                if (!adminToken) {
                    console.error('Admin Token is missing or invalid.');
                    return;
                }

                const response = await axios.get('http://localhost:8080/getactiveservices', {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                });
                console.log(response.data)
                setAllActiveServices(response.data)
                console.log(allActiveServices)
            } catch (error) {
                console.log("error getting all users", error);
            }
        }

        fetchAllActiveServices()
    }, []);


    const formateDate = (date) => {
        if (date) {
            const dobDate = new Date(date);
            dobDate.setDate(dobDate.getDate());
            const formattedDate = dobDate.toLocaleDateString('en-CA'); // Adjust the locale if needed

            return formattedDate;
        } else {
            return 'not given';
        }
    };


    return (
        <div className='active-services'>

            <h1>Active Services</h1>
            <div className="applied-service-cards">

                {allActiveServices.map(data => (
                    <div className="service-card">
                        <h2>{data.serviceType}</h2>

                        <div>
                            <span>ID : </span>
                            <p>{`CSP${data.serviceApplyID}`}</p>
                        </div>

                        <div>
                            <span>Service ID : </span>
                            <p>{`${data.serviceID}`}</p>
                        </div>

                        <div>
                            <span>User ID : </span>
                            <p>{`${data.userID}`}</p>
                        </div>

                        <div>
                            <span>Apply Date : </span>
                            <p>{formateDate(data.dateApply)}</p>
                        </div>

                        <div>
                            <span>Contact Style : </span>
                            <p>{data.contactStyle}</p>
                        </div>

                        <div>
                            <span>Contact Time : </span>
                            <p>{data.contactTime}</p>
                        </div>

                        <div>
                            <span>Budget : </span>
                            <p>{data.budget}</p>
                        </div>

                        <div>
                            <span>Outstanding Amount : </span>
                            <p>{data.outStandingAmount || "0"}</p>
                        </div>

                        <div>
                            <span>Advanced Payment: </span>
                            <p>{data.AdvancedPayment || "0"}</p>
                        </div>

                        <div>
                            <span>Final Payment: </span>
                            <p>{data.FinalPayment || "0"}</p>
                        </div>

                        <div>
                            <span>DeadLine : </span>
                            <p>{data.projectDeadline}</p>
                        </div>

                        <div>
                            <span>How You know : </span>
                            <p>{`${data.howyouknowus}`}</p>
                        </div>

                        <div>
                            <span>Project Description : </span>
                            <Link onClick={() => openDescriptionCard(data.projectDescription)}>Click Here</Link>
                        </div>

                        <div className='status-progress'>
                            <span>Status : </span>
                            <div className="progress-bar-container">
                                <div className="progress-bar">
                                    <div className="progress-bar-filled" style={{ width: `${data.stage6 || data.stage5 || data.stage4 || data.stage3 || data.stage2 || data.stage1 || "0"}%` }}>
                                    </div>
                                </div>
                            </div>
                            <p>{`${data.stage6 || data.stage5 || data.stage4 || data.stage3 || data.stage2 || data.stage1 || "0"}%`}</p>

                        </div>

                        <button className='home-button' onClick={() => getPreFormData(data)}>Update</button>
                    </div>
                ))}


                <div className={`description-container ${openDescription ? "active-description" : ""}`} onClick={openDescriptionCard}>
                    <div className="description-card">
                        <p>{`project description :${description}`}</p>
                    </div>
                </div>


                <div className={`update-form-container ${openForm ? "active-update-form" : ""}`}>
                    <form action="" className='update-from' onSubmit={hanldeSubmit}>
                        <div>
                            <span>Budget :</span>
                            <input type="text"
                                name='budget'
                                value={formData.budget}
                                onChange={handelupdate}
                            />
                        </div>

                        <div>
                            <span>Deadline :</span>
                            <input type="text"
                                name='projectDeadline'
                                value={formData.projectDeadline}
                                onChange={handelupdate}
                            />
                        </div>

                        <div>
                            <span>Outstanding Amount :</span>
                            <input type="text"
                                name='outStandingAmount'
                                value={formData.outStandingAmount}
                                onChange={handelupdate}
                            />
                        </div>

                        <div>
                            <span>Advanced Payment :</span>
                            <input type="text"
                                name='AdvancedPayment'
                                value={formData.AdvancedPayment}
                                onChange={handelupdate}
                            />
                        </div>



                        <div>
                            <span>Final Payment :</span>
                            <input type="text"
                                name='FinalPayment'
                                value={formData.FinalPayment}
                                onChange={handelupdate}
                            />
                        </div>

                        <div>
                            <span>Description :</span>
                            <textarea id="" cols="3" rows="1"
                                name="projectDescription"
                                value={formData.projectDescription}
                                onChange={handelupdate}
                            ></textarea>
                        </div>

                        <div className='status'>
                            <span>Status :</span>
                            <div className="status-container">
                                <div>
                                    <input type="checkbox" id='stage1' name='stage1'
                                        value={formData.stage1}
                                        onChange={handelupdate}
                                    />
                                    <label htmlFor="stage1">stage 1</label>
                                </div>

                                <div>
                                    <input type="checkbox" id='stage2' name='stage2'
                                        value={formData.stage2}
                                        onChange={handelupdate}
                                    />
                                    <label htmlFor="stage2">stage 2</label>
                                </div>

                                <div>
                                    <input type="checkbox" id='stage3' name='stage3'
                                        value={formData.stage3}
                                        onChange={handelupdate}
                                    />
                                    <label htmlFor="stage3">stage 3</label>
                                </div>

                                <div>
                                    <input type="checkbox" id='stage4' name='stage4'
                                        value={formData.stage4}
                                        onChange={handelupdate}
                                    />
                                    <label htmlFor="stage4">stage 4</label>
                                </div>

                                <div>
                                    <input type="checkbox" id='stage5' name='stage5'
                                        value={formData.stage5}
                                        onChange={handelupdate}
                                    />
                                    <label htmlFor="stage5">stage 5</label>
                                </div>

                                <div>
                                    <input type="checkbox" id='stage6' name='stage6'
                                        value={formData.stage6}
                                        onChange={handelupdate}
                                    />
                                    <label htmlFor="stage6">stage 6</label>
                                </div>
                            </div>
                        </div>

                        <button className='admin-btn'>Submit</button>
                        <p className="close" onClick={() => openFormCard()}>close</p>
                    </form>
                </div>

            </div>

            <ToastContainer />
        </div>
    )
}

export default ActiveServices
