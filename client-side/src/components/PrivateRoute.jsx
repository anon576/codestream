import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ authenticated, component: Component, navbar: ProfileNavbar, trigger, setProgress }) => {
    if (!authenticated) {
        trigger(true);
        return <Navigate to="/" />;
    }
    return (
        <>
            <Component setProgress={setProgress} />
            {ProfileNavbar && <ProfileNavbar />}
        </>
    );
};

export default PrivateRoute;