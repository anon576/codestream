import { React, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import "../style/register.css"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Forgetpassword = (props) => {

    const { setProgress } = props

    const { register, handleSubmit, formState: { errors } } = useForm();

    const navigate = useNavigate()

    useEffect(() => {
        setProgress(40);

        setTimeout(() => {
            setProgress(100)
        }, 200)

    }, [setProgress])

    const [userInfo, setUserInfo] = useState({});

    const notifySuccess = (message) => toast.success(message, {
        position: "top-center",
        autoClose: 2000,
    });

    const notifyError = (message) => toast.error(message, {
        position: "top-center",
        autoClose: 2000,
    });

    const onSubmit = (data) => {
        setUserInfo(data);
        console.log(data)
        console.log(userInfo)
        verifyOtp(data)
    }

    const verifyOtp = async (data) => {
        try {
            const response = await axios.post('http://localhost:8080/forgetPassword', data);

            if (response.status === 200) {
                console.log(response.data.message);
                notifySuccess(response.data.message)
                navigate('/otp/forgetpasswordotp', { state: { email: data.email } });
            } else {
                console.error('Forget password failed:', response.data.message);
                notifyError(response.data.message)
            }
        } catch (error) {
            console.error('Error during varification of email:', error.message);
            // alert(`Error: ${error.response.data.message}`);
            notifyError(error.response.data.message)
        }
    }

    return (
        <div className='register'>
            <form action="" className='login-form otp-main-form' onSubmit={handleSubmit(onSubmit)}>
                <h1>Forget Password</h1>
                <div className="login-inputs">
                    <div>
                        <input
                            type="email"
                            name='email'
                            placeholder='Enter Registred Email'
                            {...register("email", {
                                required: "Please Enter Registred Email"
                            })}
                        />
                        <p>{errors?.otp?.message}</p>
                    </div>
                    <input type="submit" className='login-button' />
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Forgetpassword