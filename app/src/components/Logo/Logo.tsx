import React from "react";
import todoLogo from "assets/logo.png";
import { Link } from "react-router-dom";
import { urls } from "config";

export const Logo = () => (
  <Link className="btn center-logo" to={urls.home}>
    <img src={todoLogo} alt="Logo" width="100%" />
  </Link>
);
