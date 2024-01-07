import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ authenticated, component: Component, profileNavbar: ProfileNavbar, trigger, open, setProgress, navBar: NavBar, footer: Footer, login: Login }) => {
    if (!authenticated) {
        trigger(true);
        return <Navigate to="/" />;
    }
    return (
        <>
            <Component setProgress={setProgress} />
            {ProfileNavbar && <ProfileNavbar />}
            {NavBar && <NavBar trigger={trigger} />}
            {Footer && <Footer />}
            {Login && <Login trigger={open} close={trigger} />}
        </>
    );
};

export default PrivateRoute;