"use client"
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

import Link from "next/link";
import styles from "./Header.module.css";
import { BiSearch } from "react-icons/bi";
import { MdClose, MdOutlineLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

function Header() {
  const [isLogin, setIsLogin] = useState(true);
  const [click, setClick] = useState(false);
  const [adminRole, setAdminRole] = useState(false);

  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(path)
  }, [])
  function getRoutLink(path) {
    router.push(path)
  }

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.itemLeft}>
          <div className={styles.logo} onClick={() => window.location.href = "http://localhost:3001/"}>
            <span style={{ fontSize: "30px" }}>Jflow</span>
          </div>
        </div>
        <div className={styles.itemCenter}>
          <nav className={`${styles.menu} ${click ? styles.active : ""}`}>
            <ul className={styles.menuMain}>
              <li className={styles.menuItem} onClick={() => window.location.href = "http://localhost:3001/dash"}>
                <span>Dashboard </span>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.itemRight}>
          <div className={styles.navSearch}>
            <input type="text" placeholder="Search for jobs here" />
            <BiSearch className={styles.searchIcon} />
          </div>
          {isLogin ? (
            <div className={styles.navIcons}>
                <CgProfile className={styles.sideIcons} />
                <p>Profile</p>
            </div>
          ) : (
            <div className={styles.navIcons}>
              <Link href="/register">
                <CgProfile className={styles.sideIcons} />
                <p>Login</p>
              </Link>
            </div>
          )}
          {isLogin && (
            <div className={styles.navIcons}>
              <MdOutlineLogout className={styles.sideIcons} />
              <p>Logout</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header;