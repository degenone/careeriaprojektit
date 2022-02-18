import React from 'react';
import './App.css';

function Navbar(props) {
    return(
    <nav>
        <div className="nav-title">
            <a href="/react2020/oppilas33/">{props.appName}</a>
        </div>
        <ul className="nav-links">
        {
        // e.g.: [{name: "about": href: "/about"}, {name: "Google": href: "google.com", blank: true}]
        props.links.map((link, i) => {
            return <li key={i}><a href={link.href} target={(link.blank) ? "_blank" : "_self"}>{link.name}</a></li>
        })}
        </ul>
    </nav>
    )
}

export default Navbar;