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
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Services from "./components/Services";
import About from "./components/About";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import ApplyService from "./components/ApplyService";
import ProfileNavbar from "./components/ProfileNavbar";
import EnrolledService from "./components/EnrolledService";
import TrackService from "./components/TrackService";
import InternshipPage from "./components/InternshipPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminNavBar from "./components/AdminNavBar";
import AdminUsers from "./components/AdminUsers";
import AdminLogin from "./components/AdminLogin";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import AdminServices from "./components/AdminServices";
import AdminServiceDetail from "./components/AdminServiceDetail";
import ServiceChanges from "./components/ServiceChanges";
import { useHotkeys } from "react-hotkeys-hook";
import ActiveServices from "./components/ActiveServices";
// import RazorpayButton from "./components/RazorpayButton";


function App() {

  const isUserSignedIn = !!localStorage.getItem('token')

  // const [adminLogin, setAdminLogin] = useState()

  let [openLogin, setOpenlogin] = useState(false)

  let [progress, setProgress] = useState(0)

  useHotkeys("ctrl+alt+a", () => {
    window.location.href = "/admindashboard";
  });

  return (


    <div className="App" >
      <Router>
        <ScrollToTop />
        <LoadingBar
          color='#001d3d'
          progress={progress}
        />

        <Routes>

          <Route path="/" element={
            <>
              <Homepage setProgress={setProgress} />
              <Header trigger={setOpenlogin} />
              <Login trigger={openLogin} close={setOpenlogin} />
              <Footer />
            </>
          } />

          <Route path="/signup" element={
            <>
              <Register setProgress={setProgress} trigger={setOpenlogin} />
              <Header trigger={setOpenlogin} />
              <Login trigger={openLogin} close={setOpenlogin} />
              {/* <Footer /> */}
            </>
          } />

          <Route path="/contact" element={
            <>
              <Contact setProgress={setProgress} />
              <Header trigger={setOpenlogin} />
              <Login trigger={openLogin} close={setOpenlogin} />
              <Footer />
            </>
          } />

          <Route path="/services" element={
            <>
              <Services setProgress={setProgress} />
              <Header trigger={setOpenlogin} />
              <Login trigger={openLogin} close={setOpenlogin} />
              <Footer />
            </>
          } />

          <Route path="/service/:serviceID" element={
            <>
              <ServicesDetail setProgress={setProgress} />
              <Header trigger={setOpenlogin} />
              <Login trigger={openLogin} close={setOpenlogin} />
              <Footer />
            </>
          } />

          <Route path="/about" element={
            <>
              <About setProgress={setProgress} />
              <Header trigger={setOpenlogin} />
              <Login trigger={openLogin} close={setOpenlogin} />
              <Footer />
            </>
          } />

          <Route path="/profile"
            element={<PrivateRoute
              navBar={Header}
              login={Login}
              footer={Footer}
              component={Profile}
              profileNavbar={ProfileNavbar}
              authenticated={isUserSignedIn}
              open={openLogin}
              trigger={setOpenlogin}
              setProgress={setProgress}
            />}
          />

          <Route path="/enrolledservices"
            element={<PrivateRoute
              navBar={Header}
              login={Login}
              footer={Footer}
              component={EnrolledService}
              profileNavbar={ProfileNavbar}
              authenticated={isUserSignedIn}
              open={openLogin}
              trigger={setOpenlogin}
              setProgress={setProgress}
            />}
          />

          <Route path="/trackservice/:serviceApplyID"
            element={<PrivateRoute
              navBar={Header}
              login={Login}
              footer={Footer}
              component={TrackService}
              profileNavbar={ProfileNavbar}
              authenticated={isUserSignedIn}
              open={openLogin}
              trigger={setOpenlogin}
              setProgress={setProgress}
            />}
          />

          <Route path="/applyservice/:serviceID"
            element={<PrivateRoute
              navBar={Header}
              login={Login}
              footer={Footer}
              component={ApplyService}
              authenticated={isUserSignedIn}
              open={openLogin}
              trigger={setOpenlogin}
              setProgress={setProgress}
            />}
          />

          <Route path="/internship" element={
            <>
              <InternshipPage setProgress={setProgress} />
              <Header trigger={setOpenlogin} />
              <Login trigger={openLogin} close={setOpenlogin} />
              <Footer />
            </>
          } />

          {/* <Route path="/internship" element={<InternshipPage />} /> */}

          <Route path="/otp/:otptype" element={<Otp setProgress={setProgress} trigger={setOpenlogin} />} />

          <Route path="/forgetpassword" element={<Forgetpassword setProgress={setProgress} />} />

          <Route path="*" element={<Errorpage setProgress={setProgress} trigger={setOpenlogin} />} />



          <Route path="/adminlogin" element={<AdminLogin />} />

          <Route path="/admindashboard"
            element={
              <AdminPrivateRoute
                adminNavbar={AdminNavBar}
                component={AdminDashboard}
              />
            } />

          <Route path="/adminusers"
            element={
              <AdminPrivateRoute
                adminNavbar={AdminNavBar}
                component={AdminUsers}
              />
            } />

          <Route path="/adminservices"
            element={
              <AdminPrivateRoute
                adminNavbar={AdminNavBar}
                component={AdminServices}
              />
            } />

          <Route path="/adminservicedetail/:serviceID"
            element={
              <AdminPrivateRoute
                adminNavbar={AdminNavBar}
                component={AdminServiceDetail}
              />
            } />

          <Route path="/servicechanges/:serviceID/:changetype"
            element={
              <AdminPrivateRoute
                adminNavbar={AdminNavBar}
                component={ServiceChanges}
              />
            } />

          <Route path="/activeservices"
            element={
              <AdminPrivateRoute
                adminNavbar={AdminNavBar}
                component={ActiveServices}
              />
            } />




        </Routes>

      </Router>


    </div>
  );
}

export default App;
