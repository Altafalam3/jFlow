import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { allApplyJobs, allSavedJobs } from "../../Redux/Jobs/actions";
import axiosInstance from "../../utils/axiosInstance";
import "./Home.css";

const Home = () => {
  // 1. Call hooks at the top level, unconditionally.
  const dispatch = useDispatch();
  const savedJobs = useSelector((store) => store.job.allSavedJobs);
  const appliedJobs = useSelector((store) => store.job.allApplyJobs);

  // If you are storing user details in localStorage:
  // const user = JSON.parse(localStorage.getItem("User")) || {};
  // Local state to hold user data
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    resume: null, 
    urls: [],
  });

  // 2. Use an effect to fetch data (unconditionally).
  useEffect(() => {
    dispatch(allSavedJobs());
    dispatch(allApplyJobs());
  }, [dispatch]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosInstance.get("/api/user");
        if (response.data && response.data.user) {
          // Use the fetched user data
          setUser(response.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  // 3. After calling hooks, check the token and redirect if needed.
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 4. Render the UI if the user has a token.
  return (
    <div className="home">
      <div>
        <div className="homeJob">
          <div className="homeHeader">New Recommended Job(s)</div>
          <div className="homeMiddle">
            <Link to="/jobs">
              <div className="homeRecJob">
                <h2>Urgent Hiring!!! BPO/KPO-Voice and Non Voice Executive</h2>
                <p>Pyramid Jobs</p>
                <p>₹ 1,75,000 - 2,50,000 P.A.</p>
              </div>
            </Link>
            <Link to="/jobs">
              <div className="homeRecJob">
                <h2>Sales Executive</h2>
                <p>Tushar Hr Consultancy</p>
                <p>Not Disclosed</p>
              </div>
            </Link>
          </div>
          <Link to="/jobs">
            <div className="homeFooter">VIEW ALL</div>
          </Link>
        </div>
        <div className="homeProfile">
          <div className="homeProfileImg">
            <img src="./assets/user.png" alt="User" />
          </div>
          <div className="homeProfileName">
            <h2>
              {user.first_name} {user.last_name}
            </h2>
            <p>{user.email}</p>
            <p>{user.phone}</p>
            <p>{user.location}</p>
            <p>Job Category</p>
            <Link to="/profile">
              <h3>UPDATE PROFILE</h3>
            </Link>
          </div>
        </div>
      </div>
      <div className="homeDiv">
        <div>
          <div className="homeHeader">Job Applications</div>
          <div className="homeMiddle">
            {appliedJobs.map((el) => {
              // Adjust as needed based on your data structure
              if (el.userId === user._id) {
                return (
                  <Link to="/jobs" key={el._id}>
                    <div className="homeRecJob">
                      <h2>{el.title}</h2>
                      <p>{el.company}</p>
                      <p>{el.salary}</p>
                    </div>
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
        <div>
          <div className="homeHeader">Saved Job(s)</div>
          <div className="homeMiddle">
            {savedJobs.map((el) => {
              if (el.userId === user._id) {
                return (
                  <Link to="/jobs" key={el._id}>
                    <div className="homeRecJob">
                      <h2>{el.title}</h2>
                      <p>{el.company}</p>
                      <p>{el.salary}</p>
                    </div>
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
