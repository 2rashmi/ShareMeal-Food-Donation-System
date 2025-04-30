import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import jsPDF from "jspdf";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import "../../App.css";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function AdminReports() {
    const [activeReport, setActiveReport] = useState("donations");
    const [donationReport, setDonationReport] = useState(null);
    const [claimsReport, setClaimsReport] = useState(null);
    const [deliveryReport, setDeliveryReport] = useState(null);
    const [userReport, setUserReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, [activeReport]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            console.log("Fetching report for:", activeReport);
            
            const endpoints = {
                donations: "/reports/donations",
                claims: "/reports/claims",
                deliveries: "/reports/deliveries",
                users: "/reports/users"
            };

            const response = await axios.get(`http://localhost:5001${endpoints[activeReport]}`);
            console.log(`Received ${activeReport} report data:`, response.data);
            
            if (!response.data) {
                throw new Error("No data received from server");
            }
            
            switch(activeReport) {
                case "donations":
                    setDonationReport(response.data);
                    break;
                case "claims":
                    setClaimsReport(response.data);
                    break;
                case "deliveries":
                    setDeliveryReport(response.data);
                    break;
                case "users":
                    setUserReport(response.data);
                    break;
            }
        } catch (err) {
            console.error(`Error fetching ${activeReport} report:`, err);
            const errorMessage = err.response?.data?.message || err.message || "Error generating report";
            alert(errorMessage);
            // Reset the report state based on active report
            switch(activeReport) {
                case "donations":
                    setDonationReport(null);
                    break;
                case "claims":
                    setClaimsReport(null);
                    break;
                case "deliveries":
                    setDeliveryReport(null);
                    break;
                case "users":
                    setUserReport(null);
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    const getChartColors = (count) => {
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
        ];
        return colors.slice(0, count);
    };

    const renderDonationCharts = () => {
        if (!donationReport) return null;

        const statusData = {
            labels: Object.keys(donationReport.donationsByStatus),
            datasets: [{
                data: Object.values(donationReport.donationsByStatus),
                backgroundColor: getChartColors(Object.keys(donationReport.donationsByStatus).length),
                borderWidth: 1
            }]
        };

        const foodTypeData = {
            labels: Object.keys(donationReport.donationsByFoodType),
            datasets: [{
                label: 'Donations by Food Type',
                data: Object.values(donationReport.donationsByFoodType),
                backgroundColor: getChartColors(Object.keys(donationReport.donationsByFoodType).length),
                borderWidth: 1
            }]
        };

        return (
            <div className="charts-container">
                <div className="chart-card">
                    <h3>Donations by Status</h3>
                    <Pie data={statusData} />
                </div>
                <div className="chart-card">
                    <h3>Donations by Food Type</h3>
                    <Bar data={foodTypeData} />
                </div>
            </div>
        );
    };

    const renderClaimsCharts = () => {
        if (!claimsReport) return null;

        const statusData = {
            labels: Object.keys(claimsReport.claimsByStatus),
            datasets: [{
                data: Object.values(claimsReport.claimsByStatus),
                backgroundColor: getChartColors(Object.keys(claimsReport.claimsByStatus).length),
                borderWidth: 1
            }]
        };

        return (
            <div className="charts-container">
                <div className="chart-card">
                    <h3>Claims by Status</h3>
                    <Pie data={statusData} />
                </div>
            </div>
        );
    };

    const renderDeliveryCharts = () => {
        if (!deliveryReport) return null;

        const statusData = {
            labels: Object.keys(deliveryReport.deliveriesByStatus),
            datasets: [{
                data: Object.values(deliveryReport.deliveriesByStatus),
                backgroundColor: getChartColors(Object.keys(deliveryReport.deliveriesByStatus).length),
                borderWidth: 1
            }]
        };

        return (
            <div className="charts-container">
                <div className="chart-card">
                    <h3>Deliveries by Status</h3>
                    <Pie data={statusData} />
                </div>
            </div>
        );
    };

    const renderUserCharts = () => {
        if (!userReport) return null;

        const roleData = {
            labels: Object.keys(userReport.usersByRole),
            datasets: [{
                data: Object.values(userReport.usersByRole),
                backgroundColor: getChartColors(Object.keys(userReport.usersByRole).length),
                borderWidth: 1
            }]
        };

        const statusData = {
            labels: Object.keys(userReport.usersByStatus),
            datasets: [{
                data: Object.values(userReport.usersByStatus),
                backgroundColor: getChartColors(Object.keys(userReport.usersByStatus).length),
                borderWidth: 1
            }]
        };

        return (
            <div className="charts-container">
                <div className="chart-card">
                    <h3>Users by Role</h3>
                    <Pie data={roleData} />
                </div>
                <div className="chart-card">
                    <h3>Users by Status</h3>
                    <Pie data={statusData} />
                </div>
            </div>
        );
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - 2 * margin;

        // Header
        doc.setFillColor(44, 62, 80);
        doc.rect(0, 0, pageWidth, 30, "F");
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text(`${activeReport.charAt(0).toUpperCase() + activeReport.slice(1)} Report`, pageWidth/2, 20, { align: "center" });
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth/2, 27, { align: "center" });

        let yPos = 40;

        // Summary Box
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(margin, yPos, contentWidth, 40, 3, 3, "F");
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);

        switch(activeReport) {
            case "donations":
                doc.text(`Total Donations: ${donationReport.totalDonations}`, margin + 15, yPos + 15);
                doc.setFontSize(10);
                doc.text("Status:", margin + 15, yPos + 30);
                Object.entries(donationReport.donationsByStatus).forEach(([status, count], index) => {
                    doc.text(`${status}: ${count}`, margin + 25, yPos + 40 + (index * 8));
                });
                doc.text("Food Types:", margin + contentWidth/2 + 15, yPos + 30);
                Object.entries(donationReport.donationsByFoodType).forEach(([type, count], index) => {
                    doc.text(`${type}: ${count}`, margin + contentWidth/2 + 25, yPos + 40 + (index * 8));
                });
                break;
            case "claims":
                doc.text(`Total Claims: ${claimsReport.totalClaims}`, margin + 15, yPos + 15);
                doc.setFontSize(10);
                doc.text("Status:", margin + 15, yPos + 30);
                Object.entries(claimsReport.claimsByStatus).forEach(([status, count], index) => {
                    doc.text(`${status}: ${count}`, margin + 25, yPos + 40 + (index * 8));
                });
                break;
            case "deliveries":
                doc.text(`Total Deliveries: ${deliveryReport.totalDeliveries}`, margin + 15, yPos + 15);
                doc.setFontSize(10);
                doc.text("Status:", margin + 15, yPos + 30);
                Object.entries(deliveryReport.deliveriesByStatus).forEach(([status, count], index) => {
                    doc.text(`${status}: ${count}`, margin + 25, yPos + 40 + (index * 8));
                });
                break;
            case "users":
                doc.text(`Total Users: ${userReport.totalUsers}`, margin + 15, yPos + 15);
                doc.setFontSize(10);
                doc.text("Roles:", margin + 15, yPos + 30);
                Object.entries(userReport.usersByRole).forEach(([role, count], index) => {
                    doc.text(`${role}: ${count}`, margin + 25, yPos + 40 + (index * 8));
                });
                break;
        }

        yPos += 50;

        // Chart
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);
        doc.text("Data Visualization", pageWidth/2, yPos, { align: "center" });
        yPos += 10;

        // Chart Box
        const chartWidth = contentWidth;
        const chartHeight = 50;
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(margin, yPos, chartWidth, chartHeight, 3, 3, "F");

        // Draw chart based on report type
        switch(activeReport) {
            case "donations":
                const statusColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
                const statusData = Object.values(donationReport.donationsByStatus);
                const statusLabels = Object.keys(donationReport.donationsByStatus);
                const maxStatusValue = Math.max(...statusData);
                const barWidth = (chartWidth - 40) / statusData.length;
                
                statusData.forEach((value, index) => {
                    const height = (value / maxStatusValue) * (chartHeight - 20);
                    doc.setFillColor(statusColors[index % statusColors.length]);
                    doc.roundedRect(
                        margin + 20 + index * barWidth,
                        yPos + chartHeight - height - 10,
                        barWidth - 5,
                        height,
                        2,
                        2,
                        "F"
                    );
                    doc.setTextColor(44, 62, 80);
                    doc.setFontSize(8);
                    doc.text(value.toString(), margin + 20 + index * barWidth + barWidth/2 - 2, yPos + chartHeight - height - 15, { align: "center" });
                    doc.setTextColor(108, 117, 125);
                    doc.text(statusLabels[index], margin + 20 + index * barWidth + barWidth/2 - 5, yPos + chartHeight - 5, { align: "center" });
                });
                break;
            case "claims":
                // Draw bar chart for claims by status
                const claimStatusColors = ['#FF6384', '#36A2EB', '#FFCE56'];
                const claimStatusData = Object.values(claimsReport.claimsByStatus);
                const claimStatusLabels = Object.keys(claimsReport.claimsByStatus);
                const maxClaimValue = Math.max(...claimStatusData);
                const claimBarWidth = chartWidth / claimStatusData.length;
                
                claimStatusData.forEach((value, index) => {
                    const height = (value / maxClaimValue) * chartHeight;
                    doc.setFillColor(claimStatusColors[index % claimStatusColors.length]);
                    doc.rect(margin + index * claimBarWidth, yPos + chartHeight - height, claimBarWidth - 2, height, "F");
                    doc.setTextColor(108, 117, 125);
                    doc.text(claimStatusLabels[index], margin + index * claimBarWidth + claimBarWidth/2 - 10, yPos + chartHeight + 10);
                });
                break;
            case "deliveries":
                // Draw bar chart for deliveries by status
                const deliveryStatusColors = ['#FF6384', '#36A2EB', '#FFCE56'];
                const deliveryStatusData = Object.values(deliveryReport.deliveriesByStatus);
                const deliveryStatusLabels = Object.keys(deliveryReport.deliveriesByStatus);
                const maxDeliveryValue = Math.max(...deliveryStatusData);
                const deliveryBarWidth = chartWidth / deliveryStatusData.length;
                
                deliveryStatusData.forEach((value, index) => {
                    const height = (value / maxDeliveryValue) * chartHeight;
                    doc.setFillColor(deliveryStatusColors[index % deliveryStatusColors.length]);
                    doc.rect(margin + index * deliveryBarWidth, yPos + chartHeight - height, deliveryBarWidth - 2, height, "F");
                    doc.setTextColor(108, 117, 125);
                    doc.text(deliveryStatusLabels[index], margin + index * deliveryBarWidth + deliveryBarWidth/2 - 10, yPos + chartHeight + 10);
                });
                break;
            case "users":
                // Draw bar chart for users by role
                const userRoleColors = ['#FF6384', '#36A2EB', '#FFCE56'];
                const userRoleData = Object.values(userReport.usersByRole);
                const userRoleLabels = Object.keys(userReport.usersByRole);
                const maxRoleValue = Math.max(...userRoleData);
                const roleBarWidth = chartWidth / userRoleData.length;
                
                userRoleData.forEach((value, index) => {
                    const height = (value / maxRoleValue) * chartHeight;
                    doc.setFillColor(userRoleColors[index % userRoleColors.length]);
                    doc.rect(margin + index * roleBarWidth, yPos + chartHeight - height, roleBarWidth - 2, height, "F");
                    doc.setTextColor(108, 117, 125);
                    doc.text(userRoleLabels[index], margin + index * roleBarWidth + roleBarWidth/2 - 10, yPos + chartHeight + 10);
                });
                break;
        }

        yPos += chartHeight + 15;

        // Recent Data Table
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);
        doc.text("Recent Data", pageWidth/2, yPos, { align: "center" });
        yPos += 10;

        // Table Headers
        doc.setFillColor(44, 62, 80);
        doc.roundedRect(margin, yPos, contentWidth, 8, 3, 3, "F");
        doc.setTextColor(255, 255, 255);

        let headers = [];
        let data = [];

        switch(activeReport) {
            case "donations":
                headers = ["Food Type", "Quantity", "Status", "Date"];
                data = donationReport.recentDonations.slice(0, 4).map(d => [
                    String(d.foodType || ''),
                    String(d.quantity || ''),
                    String(d.status || ''),
                    new Date(d.date).toLocaleDateString()
                ]);
                break;
            case "claims":
                headers = ["Food Type", "Quantity", "Status", "Date"];
                data = claimsReport.recentClaims.slice(0, 4).map(c => [
                    String(c.foodType || ''),
                    String(c.quantity || ''),
                    String(c.status || ''),
                    new Date(c.date).toLocaleDateString()
                ]);
                break;
            case "deliveries":
                headers = ["Food Type", "Quantity", "Status", "Date"];
                data = deliveryReport.recentDeliveries.slice(0, 4).map(d => [
                    String(d.foodType || ''),
                    String(d.quantity || ''),
                    String(d.status || ''),
                    new Date(d.date).toLocaleDateString()
                ]);
                break;
            case "users":
                headers = ["Username", "Role", "Status", "Date"];
                data = userReport.recentUsers.slice(0, 4).map(u => [
                    String(u.username || ''),
                    String(u.role || ''),
                    String(u.status || ''),
                    new Date(u.joinedAt).toLocaleDateString()
                ]);
                break;
        }

        // Draw Table
        const cellWidth = contentWidth / headers.length;
        const cellHeight = 8;

        headers.forEach((header, i) => {
            doc.setFontSize(8);
            doc.text(String(header), margin + i * cellWidth + cellWidth/2, yPos + 6, { align: "center" });
        });

        data.forEach((row, rowIndex) => {
            yPos += cellHeight;
            if (rowIndex % 2 === 0) {
                doc.setFillColor(248, 249, 250);
                doc.roundedRect(margin, yPos, contentWidth, cellHeight, 2, 2, "F");
            }
            row.forEach((cell, colIndex) => {
                doc.setTextColor(44, 62, 80);
                doc.setFontSize(7);
                doc.text(String(cell), margin + colIndex * cellWidth + cellWidth/2, yPos + 6, { align: "center" });
            });
        });

        // Footer
        const footerY = pageHeight - margin;
        doc.setDrawColor(44, 62, 80);
        doc.setLineWidth(1);
        doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
        doc.setFontSize(8);
        doc.setTextColor(108, 117, 125);
        doc.text("Food Donation Management System", pageWidth/2, footerY, { align: "center" });

        doc.save(`${activeReport}_report.pdf`);
    };

    const renderDonationReport = () => {
        if (!donationReport) return null;
        return (
            <div className="report-section">
                <div className="report-header">
                    <h2>Donation Statistics</h2>
                    <div className="download-buttons">
                        <button onClick={downloadPDF} className="download-btn pdf">Download Report</button>
                    </div>
                </div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Donations</h3>
                        <p className="stat-number">{donationReport.totalDonations}</p>
                    </div>
                    <div className="stat-card">
                        <h3>By Status</h3>
                        {Object.entries(donationReport.donationsByStatus).map(([status, count]) => (
                            <p key={status} className="stat-item">
                                {status}: {count}
                            </p>
                        ))}
                    </div>
                    <div className="stat-card">
                        <h3>By Food Type</h3>
                        {Object.entries(donationReport.donationsByFoodType).map(([type, count]) => (
                            <p key={type} className="stat-item">
                                {type}: {count}
                            </p>
                        ))}
                    </div>
                </div>
                {renderDonationCharts()}
                <h3>Recent Donations</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Food Type</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Donor</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donationReport.recentDonations.map(donation => (
                                <tr key={donation.id}>
                                    <td>{donation.foodType}</td>
                                    <td>{donation.quantity}</td>
                                    <td><span className={`status-badge ${donation.status.toLowerCase()}`}>{donation.status}</span></td>
                                    <td>{donation.donorId?.username || 'Unknown'}</td>
                                    <td>{new Date(donation.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderClaimsReport = () => {
        if (!claimsReport) return null;
        return (
            <div className="report-section">
                <div className="report-header">
                    <h2>NGO Claims Statistics</h2>
                    <div className="download-buttons">
                        <button onClick={downloadPDF} className="download-btn pdf">Download Report</button>
                    </div>
                </div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Claims</h3>
                        <p>{claimsReport.totalClaims}</p>
                    </div>
                    <div className="stat-card">
                        <h3>By Status</h3>
                        {Object.entries(claimsReport.claimsByStatus).map(([status, count]) => (
                            <p key={status}>{status}: {count}</p>
                        ))}
                    </div>
                </div>
                {renderClaimsCharts()}
                <h3>Recent Claims</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Food Type</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>NGO</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claimsReport.recentClaims.map(claim => (
                                <tr key={claim.id}>
                                    <td>{claim.foodType}</td>
                                    <td>{claim.quantity}</td>
                                    <td><span className={`status-badge ${claim.status.toLowerCase()}`}>{claim.status}</span></td>
                                    <td>{claim.ngoId?.username || 'Unknown'}</td>
                                    <td>{new Date(claim.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderDeliveryReport = () => {
        if (!deliveryReport) return null;
        return (
            <div className="report-section">
                <div className="report-header">
                    <h2>Delivery Statistics</h2>
                    <div className="download-buttons">
                        <button onClick={downloadPDF} className="download-btn pdf">Download Report</button>
                    </div>
                </div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Deliveries</h3>
                        <p>{deliveryReport.totalDeliveries}</p>
                    </div>
                    <div className="stat-card">
                        <h3>By Status</h3>
                        {Object.entries(deliveryReport.deliveriesByStatus).map(([status, count]) => (
                            <p key={status}>{status}: {count}</p>
                        ))}
                    </div>
                </div>
                {renderDeliveryCharts()}
                <h3>Recent Deliveries</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Food Type</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Delivery Agent</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveryReport.recentDeliveries.map(delivery => (
                                <tr key={delivery.id}>
                                    <td>{delivery.foodType}</td>
                                    <td>{delivery.quantity}</td>
                                    <td>{delivery.status}</td>
                                    <td>{delivery.deliveryAgent}</td>
                                    <td>{new Date(delivery.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderUserReport = () => {
        if (!userReport) return null;
        return (
            <div className="report-section">
                <div className="report-header">
                    <h2>User Statistics</h2>
                    <div className="download-buttons">
                        <button onClick={downloadPDF} className="download-btn pdf">Download Report</button>
                    </div>
                </div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <p>{userReport.totalUsers}</p>
                    </div>
                    <div className="stat-card">
                        <h3>By Role</h3>
                        {Object.entries(userReport.usersByRole).map(([role, count]) => (
                            <p key={role}>{role}: {count}</p>
                        ))}
                    </div>
                    <div className="stat-card">
                        <h3>By Status</h3>
                        {Object.entries(userReport.usersByStatus).map(([status, count]) => (
                            <p key={status}>{status}: {count}</p>
                        ))}
                    </div>
                </div>
                {renderUserCharts()}
                <h3>Recent Users</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userReport.recentUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>{user.email}</td>
                                    <td>{user.approved ? "Approved" : "Pending"}</td>
                                    <td>{new Date(user.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <Nav />
            <h1>Admin Reports</h1>
            <div className="report-nav">
                <button 
                    className={`report-btn ${activeReport === "donations" ? "active" : ""}`}
                    onClick={() => setActiveReport("donations")}
                >
                    Donations Report
                </button>
                <button 
                    className={`report-btn ${activeReport === "claims" ? "active" : ""}`}
                    onClick={() => setActiveReport("claims")}
                >
                    Claims Report
                </button>
                <button 
                    className={`report-btn ${activeReport === "deliveries" ? "active" : ""}`}
                    onClick={() => setActiveReport("deliveries")}
                >
                    Deliveries Report
                </button>
                <button 
                    className={`report-btn ${activeReport === "users" ? "active" : ""}`}
                    onClick={() => setActiveReport("users")}
                >
                    User Report
                </button>
            </div>
            {loading ? (
                <div className="loading">Loading report...</div>
            ) : (
                <>
                    {activeReport === "donations" && renderDonationReport()}
                    {activeReport === "claims" && renderClaimsReport()}
                    {activeReport === "deliveries" && renderDeliveryReport()}
                    {activeReport === "users" && renderUserReport()}
                </>
            )}
        </div>
    );
}

export default AdminReports; 