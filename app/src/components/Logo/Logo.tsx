import React from "react";
import todoLogo from "assets/logo.png";
import { Link } from "react-router-dom";
import { urls } from "config";

import styles from "./Logo.module.scss"

export const Logo = () => (
  <Link className={styles.centerLogo} to={urls.home}>
    <img src={todoLogo} alt="Logo" width="100%" />
  </Link>
);
