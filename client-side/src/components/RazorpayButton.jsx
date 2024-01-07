import axios from "axios";
import { useState, useEffect } from "react";
import logo from "../images/logo.png"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RazorpayButton = (props) => {

  const { serviceApplyID } = props;

  const [serviceData, setServiceData] = useState({});

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
    const fetchServiceData = async (serviceApplyID) => {
      try {
        // console.log('i am inside fetch service data', serviceApplyID);

        const response = await axios.get(`http://localhost:8080/getAppliedSpecificServiceData/${serviceApplyID}`);

        const data = response.data;

        if (data.success) {
          const user = data.servicedata[0];
          setServiceData(user);
          // console.log('please check me', user);
        } else {
          console.error('Error in response:', data.message);
        }
      } catch (error) {
        console.error('Error fetching Service data:', error);
      }
    };

    fetchServiceData(serviceApplyID);  // Pass the serviceApplyID here
  }, [serviceApplyID]);


  const initRazorpay = async () => {
    const razorpayScript = document.createElement("script");
    razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
    razorpayScript.async = true;
    razorpayScript.onload = () => {
      // Razorpay SDK has been loaded, you can now safely use it.
      console.log("Razorpay SDK loaded successfully");
    };
    document.head.appendChild(razorpayScript);
  };

  useEffect(() => {
    initRazorpay();
  }, []);

  const initPayment = (data) => {
    const options = {
      key: "rzp_test_Zjom8IGzUOcgy1", // Replace with your Razorpay key
      amount: serviceData.budget,
      currency: "INR",
      name: serviceData.serviceType,
      description: "Test Transaction",
      image: logo,
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyUrl = "http://localhost:8080/verify";
          const { data } = await axios.post(verifyUrl, response);
          addTransactionData(serviceData)
          // console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    // Check if Razorpay is initialized before creating an instance
    if (window.Razorpay) {
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      console.error("Razorpay SDK not initialized.");
    }
  };

  const handlePayment = async () => {
    try {
      const orderUrl = "http://localhost:8080/orders";
      const { data } = await axios.post(orderUrl, { amount: serviceData.budget });
      // console.log(data);
      initPayment(data.data);
    } catch (error) {
      console.log(error);
    }
  };


  const addTransactionData = async (data) => {
    try {
      console.log(data)
      const response = await axios.post(
        'http://localhost:8080/addtransactiondata', data);

      const responseData = response.data;

      if (responseData.success) {
        notifySuccess(responseData.message);
        // setTimeout(() => {
        //   navigate('/adminservices')
        // }, 1500);
      } else {
        notifyError(responseData.message);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      notifyError('Error updating user data:', error);
    }
  };


  return (
    <div className="App">
      {/* <button className="buy_btn"> */}
      <button
        onClick={handlePayment}
        className="buy_btn"
        style={{
          padding: "10px",
          cursor: "pointer"
        }}>
        Payment
      </button>
      <ToastContainer />
    </div>
  );
};

export default RazorpayButton;

