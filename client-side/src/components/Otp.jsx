import { React, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import "../style/register.css"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Otp = (props) => {

    const { setProgress } = props

    const { register, handleSubmit, formState: { errors } } = useForm();

    const location = useLocation();

    const email = location.state ? location.state.email : null;

    const [showPasswordInput, setShowPasswordInput] = useState(false)

    // const navigate = useNavigate();

    const openLogin = () => { props.trigger(true) }

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

    const { otptype } = useParams();
    console.log(otptype)
    console.log(typeof (otptype))

    // Use the useState hook to declare state
    const [showPassword, setShowPassword] = useState(false);


    // Use useEffect to set the initial value based on otptype
    useEffect(() => {
        if (otptype === "forgetpasswordotp") {
            setShowPasswordInput(true);
        } else {
            setShowPasswordInput(false);
        }
    }, [otptype]);


    const onSubmit = (data) => {
        data.email = email
        setUserInfo(data);
        console.log(data)
        console.log(userInfo)
        if (otptype === "registerotp") {
            verifyRegisterOtp(data)
        }
        if (otptype === "forgetpasswordotp") {
            verifyForgetPasswordOtp(data)
        }
    }

    const verifyRegisterOtp = async (data) => {
        try {
            const response = await axios.post('http://localhost:8080/verifyOTP', data);

            if (response.status === 200) {
                console.log(response.data.message);
                notifySuccess(response.data.message)
                openLogin()
            } else {
                console.error('otp varification failed:', response.data.message);
                notifyError(response.data.message)
            }
        } catch (error) {
            console.error('Error during varification:', error.message);
            // alert(`Error: ${error.response.data.message}`);
            notifyError(error.response.data.message)
        }
    }

    const verifyForgetPasswordOtp = async (data) => {
        try {
            const response = await axios.post('http://localhost:8080/verifyForgetOTP', data);

            if (response.status === 200) {
                console.log(response.data.message);
                notifySuccess(response.data.message)
                openLogin()
            } else {
                console.error('forget password otp varification failed:', response.data.message);
                notifyError(response.data.message)
            }
        } catch (error) {
            console.error('Error during varification forget password otp:', error.message);
            // alert(`Error: ${error.response.data.message}`);
            notifyError(error.response.data.message)
        }
    }

    return (
        <div className='register'>
            <form action="" className='login-form otp-main-form' onSubmit={handleSubmit(onSubmit)}>
                <h1>OTP Verification</h1>
                <div className="login-inputs">
                    <div className='otp-form'>
                        <input
                            type="text"
                            name='otp'
                            placeholder='Enter OTP'
                            {...register("otp", {
                                required: "please Enter Valid OTP"
                            })}
                        />
                        <p>{errors?.otp?.message}</p>

                        {showPasswordInput &&
                            <div>
                                <input
                                    type={showPassword ? "text" : 'password'}
                                    name='password'
                                    placeholder='Enter New password'
                                    {...register("password", {
                                        required: "please Enter new password",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters long",
                                        },
                                        maxLength: {
                                            value: 12,
                                            message: "Legth of password must be less than 12 characters",
                                        }
                                    })}
                                />
                                <p>{errors?.password?.message}</p>

                                <div className="password">
                                    <input type="checkbox" id='showpassword' value={showPassword}
                                        onChange={() =>
                                            setShowPassword((prev) => !prev)
                                        } />
                                    <label htmlFor="showpassword">Show password</label>
                                </div>
                            </div>
                        }
                    </div>
                    <input type="submit" className='login-button' />
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Otp