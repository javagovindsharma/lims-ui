/* eslint-disable react/jsx-no-target-blank */
import React from "react";

export default function Footer() {
  return (
     <footer className="py-8" id="footer-main">
        <div className="container">
           <div className="row align-items-center justify-content-xl-between">
              <div className="col-xl-6">
                 <div className="copyright text-center text-xl-left text-muted">
                    &copy; {new Date().getFullYear()}{" "}
                    <a
                       href="https://www.google.com/"
                       className="font-weight-bold ml-1"
                       target="_blank"
                    >
                       LIMS Clinical Solutions Strategies
                    </a>
                 </div>
              </div>
              <div className="col-xl-6">
                 <ul className="nav nav-footer justify-content-center justify-content-lg-end">
                    <li className="nav-item">
                       <a
                          href="https://www.google.com/"
                          className="nav-link"
                          target="_blank"
                       >
                          Platform
                       </a>
                    </li>
                    <li className="nav-item">
                       <a
                          href="https://www.google.com/"
                          className="nav-link"
                          target="_blank"
                       >
                          Services
                       </a>
                    </li>
                    <li className="nav-item">
                       <a
                          href="https://www.google.com/"
                          className="nav-link"
                          target="_blank"
                       >
                          Insights
                       </a>
                    </li>
                    <li className="nav-item">
                       <a
                          href="https://www.google.com/"
                          className="nav-link"
                          target="_blank"
                       >
                          About Us
                       </a>
                    </li>
                 </ul>
              </div>
           </div>
        </div>
     </footer>
  );
}
