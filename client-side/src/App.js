import Header from "./components/Navbar";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Register from "./components/Register";
import Contact from "./components/Contact";
import Otp from "./components/Otp";
import ServicesDetail from "./components/ServicesDetail";
import Errorpage from "./components/Errorpage";
import ScrollToTop from "./components/ScrollToTop";
import Forgetpassword from "./components/ForgetPassword";
import "./style/light-theme-colors.css";
import LoadingBar from 'react-top-loading-bar'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Services from "./components/Services";
import About from "./components/About";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import ApplyService from "./components/ApplyService";
import ProfileNavbar from "./components/ProfileNavbar";
import EnrolledService from "./components/EnrolledService";
import TrackService from "./components/TrackService";
import InternshipPage from "./components/InternshipPage";

function App() {

  const isUserSignedIn = !!localStorage.getItem('token')

  let [openLogin, setOpenlogin] = useState(false)

  let [progress, setProgress] = useState(0)

  return (


    <div className="App" >
      <Router>
        <ScrollToTop />
        <LoadingBar
          color='#001d3d'
          progress={progress}
        />
        <Header trigger={setOpenlogin} />
        <Login trigger={openLogin} close={setOpenlogin} />
        <Routes>
          <Route path="/" element={<Homepage setProgress={setProgress} />} />
          <Route path="/signup" element={<Register setProgress={setProgress} trigger={setOpenlogin} />} />
          <Route path="/contact" element={<Contact setProgress={setProgress} />} />
          <Route path="/services" element={<Services setProgress={setProgress} />} />
          <Route path="/service/:serviceID" element={<ServicesDetail setProgress={setProgress} />} />
          <Route path="/about" element={<About setProgress={setProgress} />} />

          <Route path="/profile"
            element={<PrivateRoute
              component={Profile}
              navbar={ProfileNavbar}
              authenticated={isUserSignedIn}
              trigger={setOpenlogin}
              setProgress={setProgress} />}
          />


          <Route path="/applyservice/:serviceID" element={<ApplyService />} />

          <Route path="/enrolledservices" element={<><EnrolledService /> <ProfileNavbar /></>} />

          <Route path="/trackservice/:serviceApplyID" element={<><TrackService />  <ProfileNavbar /></>} />

          <Route path="/internship" element={<InternshipPage />} />

          <Route path="/otp/:otptype" element={<Otp setProgress={setProgress} trigger={setOpenlogin} />} />
          <Route path="/forgetpassword" element={<Forgetpassword setProgress={setProgress} />} />


          <Route path="*" element={<Errorpage setProgress={setProgress} trigger={setOpenlogin} />} />

        </Routes>
        <Footer />
      </Router>


    </div>
  );
}

export default App;
