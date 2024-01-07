import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminPrivateRoute = ({
    adminNavbar: AdminNavbar,
    component: Component,
}) => {

    const isAdminSignedIn = !!localStorage.getItem('adminToken')


    if (isAdminSignedIn) {

        return (
            <div>
                {AdminNavbar && <AdminNavbar />}
                <Component />
            </div>
        );


    }

    // Redirect to admin dashboard immediately upon successful login
    return <Navigate to="/adminlogin" />;
};

export default AdminPrivateRoute;
