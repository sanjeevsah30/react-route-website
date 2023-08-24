import React from "react";
import {Link} from "react-router-dom";
import {HashLink} from "react-router-hash-link";


const Header = () => {
  return (
    <nav>
        <h1>sanjeev sah </h1>
        <main>
            <HashLink to={"/#home"}>Home</HashLink>
            <HashLink to={"/#brand"}>brand</HashLink>

            <HashLink to={"/#about"}>about</HashLink>

            <Link to={"/contact"}>contact</Link>
            <Link to={"/Services"}>Services</Link>



        </main>
    </nav>
  )
};

export default Header;
