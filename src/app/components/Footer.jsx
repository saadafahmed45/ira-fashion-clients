import React from "react";

const Footer = () => {
  return (
    <div className="h-full px-4  md:px-24 bg-base-200">
      <footer className="footer p-10  text-base-content">
        <aside>
          <h3 className="text-2xl">
            Ira's <span className="text-[#FF3EA5]">Fashion</span>
          </h3>
          <p>
            Ira's Fashion Ltd.
            <br />
            Providing reliable tech since 2021
          </p>
        </aside>
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
