import React, { useEffect, useState } from 'react'
import Expandable from './Expandable'
import '../style/trackservice.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import RazorpayButton from './RazorpayButton'
import { FaCircleCheck } from "react-icons/fa6";


const TrackService = () => {

    const serviceId = useParams().serviceApplyID

    // console.log("service id :", serviceId)


    const [serviceData, setServiceData] = useState({});

    const [paymentStatus, setPaymentStatus] = useState(false)

    const fetchServiceData = async (serviceid) => {
        try {
            // console.log('i am inside fetch service data', serviceid);

            const response = await axios.get(`http://localhost:8080/getAppliedSpecificServiceData/${serviceid}`);

            const data = response.data;

            if (data.success) {
                const user = data.servicedata;
                setServiceData(user);
                // console.log('please check me', user);
            } else {
                console.error('Error in response:', data.message);
            }
        } catch (error) {
            console.error('Error fetching Service data:', error);
        }
    };

    useEffect(() => {
        fetchServiceData(serviceId);
        // console.log("hello ",serviceData)
    }, [serviceId]);

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

    useEffect(() => {
        const fetchTransactionStatus = async (serviceid) => {
            try {
                // console.log('i am inside fetch service data', serviceid);

                const response = await axios.get(`http://localhost:8080/gettransactionstatus/${serviceid}`);

                const data = response.data;

                if (data.success) {
                    const user = data.servicedata;
                    setPaymentStatus(true)
                    // setServiceData(user);
                    console.log('please check me', user);
                } else {
                    setPaymentStatus(false)
                    console.error('Error in response:', data.message);
                }
            } catch (error) {
                console.error('Error fetching Service data:', error);
            }
        };

        fetchTransactionStatus(serviceId);
    }, [])

    return (
        <div className='track-service'>

            {serviceData.length > 0 && (
                <div className='track-service-container'>
                    <div className="track-service-content">
                        <h1>{serviceData[0].serviceType}</h1>

                        <div>
                            <span>Service ID :</span>
                            <p>CSP{serviceData[0].serviceApplyID} </p>
                        </div>

                        <div>
                            <span>Apply Data :</span>
                            <p>{formateDate(serviceData[0].dateApply)} </p>
                        </div>

                        <div>
                            <span>Contact Style :</span>
                            <p>{serviceData[0].contactStyle} </p>
                        </div>

                        <div>
                            <span>Budget :</span>
                            <p>{serviceData[0].budget} </p>
                        </div>

                        <div>
                            <span>Dead Line :</span>
                            <p>{serviceData[0].projectDeadline} </p>
                        </div>

                        <div className='track-service-description'>
                            <span>Project Description :</span>
                            <Expandable>{serviceData[0].projectDescription}</Expandable>
                        </div>

                        {paymentStatus ?
                            (
                                <div className='payment'>
                                    <FaCircleCheck />
                                    <span>Payment Completed</span>
                                </div>
                            ) :
                            (<RazorpayButton serviceApplyID={serviceData[0].serviceApplyID} />)}

                    </div>



                    <div className="time-line">
                        <h1>Service Timeline</h1>
                        <div className="time-line-container" style={{
                            background: `linear-gradient(to bottom, #06d6a0 0%, #06d6a0 ${serviceData[0].stage6 || serviceData[0].stage5 || serviceData[0].stage4 || serviceData[0].stage3 || serviceData[0].stage2 || serviceData[0].stage1 || "0"}%, gray 0%, gray 100%)`,
                        }}>
                            <div className="time-line-second-container">
                                <div className='time-line-content'>
                                    <h4>Contact</h4>
                                    <p>{serviceData[0].stage1 ? "Completed" : "Pending"}</p>
                                </div>

                                <div className='time-line-content'>
                                    <h4>Prototype</h4>
                                    <p>{serviceData[0].stage2 ? "Completed" : "Pending"}</p>
                                </div>

                                <div className='time-line-content'>
                                    <h4>Advance payment</h4>
                                    <p>{serviceData[0].stage3 ? "Completed" : "Pending"}</p>
                                </div>

                                <div className='time-line-content'>
                                    <h4>Model Presentation</h4>
                                    <p>{serviceData[0].stage4 ? "Completed" : "Pending"}</p>
                                </div>

                                <div className='time-line-content'>
                                    <h4>Full Payment</h4>
                                    <p>{serviceData[0].stage5 ? "Completed" : "Pending"}</p>
                                </div>

                                <div className='time-line-content'>
                                    <h4>Deliver</h4>
                                    <p>{serviceData[0].stage6 ? "Completed" : "Pending"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TrackService
