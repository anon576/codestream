import React, { useEffect, useState } from 'react';
import { FaUser, FaShop, FaEllipsisVertical, FaX, FaXmark } from 'react-icons/fa6';
import '../style/profile.css';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useForm } from 'react-hook-form';

const Profile = (props) => {

  const { setProgress } = props

  useEffect(() => {
    setProgress(40);

    setTimeout(() => {
      setProgress(100)
    }, 200)

  }, [setProgress])

  // const [profileNavbar, setProfileNavbar] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);

  // const { register, handleSubmit, formState: { errors } } = useForm();  

  const [completeForm, setCompleteForm] = useState(false)

  // const openProfileNavbar = () => {
  //   setProfileNavbar(!profileNavbar);
  // };

  const activeUpdateForm = () => {
    setOpenUpdateForm(!openUpdateForm);
  };

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

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    mobile: '',
    address: '',
    college: ''
  });

  const [userData, setUserData] = useState({});

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

        if (user.college === null) {
          setCompleteForm(true);
        } else {
          setCompleteForm(false);
        }
      } else {
        console.error('Error in response:', data.message);
      }
    } catch (error) {
      console.error('Error fetching user profile data:', error);
      notifyError('Error fetching user profile data:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);


  useEffect(() => {
    setFormData({
      name: userData.name || '',
      dob: formateDate(userData.dob) || '',
      mobile: userData.mobile || '',
      address: userData.address || '',
      college: userData.college || '',
    });
  }, [userData]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const submit = async (e) => {
    e.preventDefault();
    formData.id = userData.userID;
    // console.log(formData)
    submitUpdate(formData)
  }

  const submitUpdate = async (data) => {
    try {
      const response = await axios.put(
        'http://localhost:8080/updateUserData', data);

      const responseData = response.data;

      if (responseData.success) {
        notifySuccess(responseData.message);
        fetchUserProfile();
        activeUpdateForm();
      } else {
        notifyError(responseData.message);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      notifyError('Error updating user data:', error);
    }
  };

  const calculateAge = (dob) => {
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      return age;
    } else {
      return 'not given';
    }
  };

  const formateDate = (dob) => {
    if (dob) {
      const dobDate = new Date(dob);
      dobDate.setDate(dobDate.getDate());
      const formattedDate = dobDate.toLocaleDateString('en-CA'); // Adjust the locale if needed

      return formattedDate;
    } else {
      return 'not given';
    }
  };




  return (
    <div className='profile'>


      <div className="personal-info-container">
        <div className="personal-info">
          <h1>My Profile</h1>
          <div className="personal-header">
            <p className='name-first-letter'>{(userData.name && userData.name.length > 0) ? userData.name[0] : "X"}</p>
            <button className='home-button' onClick={activeUpdateForm}>{completeForm ? "Complete Your Form" : "update"}</button>
          </div>

          <div className="personal-content">
            <div className='personal-content-detail'>
              <span>Name:-</span><p>{userData.name || 'not given'}</p>
            </div>
            <div className='personal-content-detail'>
              <span>Email:-</span><p>{userData.email || 'not given'}</p>
            </div>
            <div className='personal-content-detail'>
              <span>Mobile Number:-</span><p>{userData.mobile || 'not given'}</p>
            </div>
            <div className='personal-content-detail'>
              <span>Age:-</span><p>{userData.dob ? calculateAge(formateDate(userData.dob)) : 'not given'}</p>
            </div>
            <div className='personal-content-detail'>
              <span>Address:-</span><p>{userData.address || 'not given'}</p>
            </div>
            <div className='personal-content-detail'>
              <span>College:-</span><p>{userData.college || 'not given'}</p>
            </div>
          </div>
        </div>

        <div className={`updateform ${openUpdateForm ? 'updateform-active' : null}`}>

          <form action="" className='updatedataform' onSubmit={submit}>

            <div className="updateform-cross" onClick={activeUpdateForm}><FaXmark /></div>

            <h1>Update Form</h1>

            <div className='form-input'>
              <p>Name</p>
              <input type="text" name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
              />

            </div>

            <div className='form-input'>
              <p>Email</p>
              <input className='email-input' type="text" name='email' value={userData.email} disabled
              />
            </div>

            <div className='form-input'>
              <p>Mobile no.</p>
              <input type="number" name='mobile'
                value={formData.mobile}
                onChange={handleInputChange} required />
            </div>

            <div className='form-input'>
              <p>Date of Birth</p>
              <input type="date" name='dob'
                value={formData.dob.slice(0, 10)}
                onChange={handleInputChange} required />
            </div>

            <div className='form-input'>
              <p>Address</p>
              <input type="text" name='address'
                value={formData.address}
                onChange={handleInputChange} required />
            </div>

            <div className='form-input'>
              <p>College</p>
              <input type="text" name='college'
                value={formData.college}
                onChange={handleInputChange} required />
            </div>

            <input className='submit-updateform' type="submit" />

          </form>

          <div className={`updateform-overlay ${openUpdateForm ? 'updateform-overlay-active' : null}`} onClick={activeUpdateForm}></div>

        </div>

      </div>



      <ToastContainer />
    </div>
  )
}

export default Profile
