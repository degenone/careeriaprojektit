import React from 'react';

export default function Footer({ user }) {
    const footerStyle = {
        minHeight: '10vh',
        backgroundColor: 'honeydew',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    };

    return(
        <footer style={footerStyle}>
            <em>
                &copy; {new Date().getFullYear()} - React Test App {user ? `- ${user}` : null}
            </em>
            <address>
                Contact: <a href="mailto:tero.kilpelainen@student.careeria.fi">tero.kilpelainen@student.careeria.fi</a>
            </address>
        </footer>
    );
};