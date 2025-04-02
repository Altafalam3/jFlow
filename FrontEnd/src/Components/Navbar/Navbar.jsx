import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { BiSearch } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose, MdOutlineLogout } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import image from "./logo.png";

const Navbar = () => {
    const [click, setClick] = useState(false);
    const handleClick = () => {
        setClick(!click);
    };

    // Get token and user data from localStorage
    const token = localStorage.getItem("token");
    const isLogin = !!token;
    const user = JSON.parse(localStorage.getItem("User")) || {};
    // Assume admin if user.role === "admin"
    const adminRole = user.role === "admin";

    const navigate = useNavigate();
    const logoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("User");
        navigate("/login");
    };

    const styleA = { left: "-100%" };
    const styleB = { left: "0%" };

    return (
        <div className="container">
            <div className="row v-center">
                <div className="nav-item item-left">
                    <div className="logo">
                        <Link to="/" style={{ fontSize: "30px" }}>
                            Jflow
                        </Link>
                    </div>
                </div>
                <div className="nav-item item-center">
                    <nav className="menu" style={click ? styleB : styleA}>
                        <ul className="menu-main">
                            <p className="mobItem">
                                <Link>LOOK AT</Link>
                                <MdClose
                                    className="cross"
                                    onClick={handleClick}
                                />
                            </p>
                            <li className="menuItem" onClick={handleClick}>
                                <Link to="/dash">Dashboard</Link>
                            </li>

                            <p className="mobItem" onClick={handleClick}>
                                {isLogin ? (
                                    <Link to="/profile">Profile</Link>
                                ) : (
                                    <Link to="/register">Login / Signup</Link>
                                )}
                            </p>
                            <p className="mobItem" onClick={handleClick}>
                                <Link to="/admin">Admin</Link>
                            </p>
                            <p className="mobItem" onClick={handleClick}>
                                <Link to="/profile">Profile</Link>
                            </p>
                        </ul>
                    </nav>
                </div>
                <div className="nav-item item-right">
                    <div className="navSearch">
                        <input type="text" placeholder="Search for jobs here" />
                        <BiSearch className="searchIcon" />
                    </div>
                    <div className="navIcons hide">
                        <BiSearch className="sideIcons" />
                    </div>
                    {adminRole && isLogin && (
                        <div className="navIcons display">
                            <Link to="/admin">
                                <RiAdminLine className="sideIcons" />
                                <p>Admin</p>
                            </Link>
                        </div>
                    )}
                    {isLogin ? (
                        <div className="navIcons">
                            <Link to="/profile">
                                <CgProfile className="sideIcons" />
                                <p className="display">Profile</p>
                            </Link>
                        </div>
                    ) : (
                        <div className="navIcons">
                            <Link to="/register">
                                <CgProfile className="sideIcons" />
                                <p className="display">Login</p>
                            </Link>
                        </div>
                    )}
                    {isLogin && (
                        <div className="navIcons" onClick={logoutUser}>
                            <Link to="#">
                                <MdOutlineLogout className="sideIcons" />
                                <p className="display">Logout</p>
                            </Link>
                        </div>
                    )}
                    <div className="navIcons hamburger">
                        <RxHamburgerMenu
                            className="sideIcons"
                            onClick={handleClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
