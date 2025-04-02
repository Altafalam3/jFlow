import React from "react";
import styles from "./Footer.module.css";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiOutlineTwitter,
  AiFillLinkedin,
} from "react-icons/ai";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div>
        <div>
          <div style={{ fontSize: "30px" }}>JFlow</div>
          <h3>Connect with us</h3>
          <span className={styles.footerIcons}>
            <AiFillFacebook />
            <AiFillInstagram />
            <AiOutlineTwitter />
            <AiFillLinkedin />
          </span>
        </div>
        <div>
          <h3>Useful Links</h3>
          <p>Home</p>
          <p>Jobs</p>
          <p>Companies</p>
          <p>Profile</p>
          <p>Admin</p>
        </div>
        <div>
          <h3>Need help?</h3>
          <p>About us</p>
          <p>Help center</p>
          <p>Summons/Notices</p>
          <p>Grievances</p>
          <p>Report issue</p>
        </div>
        <div>
          <h3>Our Policies</h3>
          <p>Career</p>
          <p>Fraud alert</p>
          <p>Trust & safety</p>
          <p>Terms and Conditions</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
