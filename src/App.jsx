import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import "./styles/App.scss";
import "./styles/header.scss";
import "./styles/home.scss";
import "./styles/footer.scss";
import "./styles/contact.scss";

import "./styles/mediaquery.scss";

import Home from "./components/Home.jsx";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import Service from "./components/Service";

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/services' element={<Service />} />
        </Routes>

        <Footer />
      </Router>
    </>
  );
};

export default App;
