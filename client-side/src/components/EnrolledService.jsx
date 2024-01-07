import React, { useEffect, useState } from 'react'
import "../style/enrolledservices.css"
import LoadingBar from 'react-top-loading-bar'
import axios from 'axios';
import { Link } from 'react-router-dom';

const EnrolledService = () => {
    const [userData, setUserData] = useState({});
    const [serviceData, setServiceData] = useState([]);

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
                console.log('user id is the', user.userID);

                // Fetch service data after setting userData
                fetchServiceData(user.userID);
            } else {
                console.error('Error in response:', data.message);
            }
        } catch (error) {
            console.error('Error fetching user profile data:', error);
        }
    };

    const fetchServiceData = async (userid) => {
        try {
            console.log('i am inside fetch service data', userid);

            const response = await axios.get(`http://localhost:8080/getAppliedServiceData/${userid}`);

            const data = response.data;

            if (data.success) {
                const user = data.servicedata;
                setServiceData(user);
                console.log('please check me', user);
            } else {
                console.error('Error in response:', data.message);
            }
        } catch (error) {
            console.error('Error fetching Service data:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUserProfile();
            await fetchServiceData(userData.userID);
        };

        fetchData();
    }, [userData.userID]);

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

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await fetchUserProfile();
    //         console.log('user id is the', userData.userID);
    //         await fetchServiceData(userData.userID);
    //         console.log('please check me', serviceData);
    //     };

    //     fetchData();
    // }, [userData.userID]);

    return (
        <div className='enrolled-service'>
            <div className="applied-service-cards">

                {serviceData.map(data => (
                    <div className="service-card">
                        <h2>{data.serviceType}</h2>

                        <div>
                            <span>Service ID : </span>
                            <p>{`CSP${data.serviceApplyID}`}</p>
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
                            <span>DeadLine : </span>
                            <p>{data.projectDeadline}</p>
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

                        <Link to={`/trackservice/${data.serviceApplyID}`}><button className='home-button'>Tract Order</button></Link>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default EnrolledService
