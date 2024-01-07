import React, { useEffect, useState } from 'react'
import { FaChartLine, FaChartPie, FaIndianRupeeSign, FaUser } from "react-icons/fa6";
import "../style/admindashboard.css"
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {

    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalActiveServices: 0,
        totalIncome: 0,
        totalSales: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {

            const adminToken = localStorage.getItem('adminToken');

            if (!adminToken) {
                console.error('Admin Token is missing or invalid.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/getDashboardCardData', {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                });
                console.log(response.data)
                setDashboardData(response.data);
                console.log(dashboardData)
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    // useEffect(() => {
    //     console.log(dashboardData)
    // }, [setDashboardData])



    return (
        <div className='admin-dashboard'>
            <div className="dashboard-cards">

                <div className="admin-info-card">
                    <div>
                        <p>Total Users</p>
                        <h2>{dashboardData.totalUsers}</h2>
                    </div>
                    <FaUser className='admin-icons' />
                </div>

                <div className="admin-info-card">
                    <div>
                        <p>Total Active Services</p>
                        <h2>{dashboardData.totalActiveServices}</h2>
                    </div>
                    <FaChartPie className='admin-icons' />
                </div>

                <div className="admin-info-card">
                    <div>
                        <p>Total Income</p>
                        <h2>{dashboardData.totalIncome || "0"}</h2>
                    </div>
                    <FaIndianRupeeSign className='admin-icons' />
                </div>

                <div className="admin-info-card">
                    <div>
                        <p>Total Sales</p>
                        <h2>{dashboardData.totalSales}</h2>
                    </div>
                    <FaChartLine className='admin-icons' />
                </div>

            </div>

            <div className="admin-tables">
                <div className="dashboard-service-table">
                    <div className='service-table-header'>
                        <h1>New Applicant</h1>
                        <Link><button className='admin-btn'>see more</button></Link>
                    </div>
                    <table>
                        <tr>
                            <th>Service ID</th>
                            <th>Service Type</th>
                            <th>Deadline</th>
                        </tr>

                        <tr>
                            <td>1</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>2</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>3</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>4</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>5</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>6</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>7</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>8</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>9</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>10</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>
                    </table>
                </div>

                <div className="dashboard-users-table">
                    <div className='service-table-header'>
                        <h1>New Users</h1>
                        <Link><button className='admin-btn'>see more</button></Link>
                    </div>
                    <table>
                        <tr>
                            <th>Service ID</th>
                            <th>Service Type</th>
                            <th>Deadline</th>
                        </tr>

                        <tr>
                            <td>1</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>2</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>3</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>4</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>5</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>6</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>7</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>8</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>9</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>

                        <tr>
                            <td>10</td>
                            <td>Android Development</td>
                            <td>30 days</td>
                        </tr>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default AdminDashboard
