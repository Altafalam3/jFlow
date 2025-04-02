import { Route, Routes } from "react-router-dom";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";
import Admin from "../Pages/Admin/Admin";
import AdminCompanies from "../Pages/Admin/AdminCompanies";
import AdminJobs from "../Pages/Admin/AdminJobs";
import AdminUsers from "../Pages/Admin/AdminUsers";
import Company from "../Pages/Company/Company";
import CompanyPage from "../Pages/Company/CompanyPage";
import Home from "../Pages/Home/Home";
import Jobs from "../Pages/Jobs/Jobs";
import JobsPage from "../Pages/Jobs/JobsPage";
import LoginPage from "../Pages/Login/LoginPage";
import Profile from "../Pages/Profile/Profile";
import Register from "../Pages/Register/Register";
import Dashboard from "../Pages/Dashboard/Dashboard";
import AssistantPage from "../Pages/Assistant/AssistantPage";
import AlumniSearch from "../Pages/Alumni/AlumniSearch";
import ApplicationTracker from "../Pages/Applications/ApplicationTracker";

const AllRoutes = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Navbar /> <Home /> <Footer />
                        </>
                    }
                ></Route>
                <Route
                    path="/login"
                    element={
                        <>
                            <Navbar /> <LoginPage />
                            <Footer />
                        </>
                    }
                ></Route>
                <Route
                    path="/register"
                    element={
                        <>
                            <Navbar /> <Register />
                            <Footer />
                        </>
                    }
                ></Route>
                <Route
                    path="/jobs"
                    element={
                        <>
                            <Navbar /> <Jobs />
                            <Footer />
                        </>
                    }
                ></Route>
                <Route
                    path="/jobspage/:id"
                    element={
                        <>
                            <Navbar /> <JobsPage />
                            <Footer />
                        </>
                    }
                ></Route>

                <Route
                    path="/assistant"
                    element={
                        <>
                            <Navbar /> <AssistantPage /> <Footer />
                        </>
                    }
                />

                <Route
                    path="/company"
                    element={
                        <>
                            <Navbar /> <Company />
                            <Footer />
                        </>
                    }
                ></Route>
                <Route
                    path="/companypage/:id"
                    element={
                        <>
                            <Navbar /> <CompanyPage />
                            <Footer />
                        </>
                    }
                ></Route>
                <Route
                    path="/profile"
                    element={
                        <>
                            <Navbar /> <Profile />
                            <Footer />
                        </>
                    }
                ></Route>
                <Route path="/alumni-search" element={<AlumniSearch />} />
                <Route path="/application-tracker" element={<ApplicationTracker />} />
                <Route path="/admin" element={<Admin />}></Route>
                <Route
                    path="/dash"
                    element={
                        <>
                            <Navbar />
                            <Dashboard />
                            <Footer />
                        </>
                    }
                ></Route>
                <Route path="/adminJobs" element={<AdminJobs />}></Route>
                <Route
                    path="/adminCompanies"
                    element={<AdminCompanies />}
                ></Route>
                <Route path="/users" element={<AdminUsers />}></Route>
            </Routes>
        </>
    );
};

export default AllRoutes;