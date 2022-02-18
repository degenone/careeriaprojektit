import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import NWCustomersFetch from '../northwind/NWCustomersFetch';
import NWProductsFetch from '../northwind/NWProductsFetch';
import TypicodeFetch from './TypicodeFetch';
import Viestit from './Viestit';
import Md5Salaus from './Md5Salaus';
import App from './App';
import Footer from './Footer';
import Kirjautuminen from './Kirjautuminen';
import './Navigaatio.css';
import Profile from '../northwind/Profile';
import usericon from '../../usericon.png';

const useComponentVisbile = (initialStyle) => {
    const [modalStyle, setModalStyle] = useState(initialStyle);
    const ref = useRef(null);

    const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setModalStyle({
                pointerEvents: 'none', 
                opacity: 0
            });
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    });

    return { ref, modalStyle, setModalStyle };
};

const useWindowDimentions = () => {
    const hasWindow = typeof window !== 'undefined';

    const getWindowDimentions = useCallback(() => {
        const width = hasWindow ? window.innerWidth : null;
        const height = hasWindow ? window.innerHeight : null;

        return { width, height };
    }, [hasWindow]);

    const [windowDimentions, setWindowDimentions] = useState(getWindowDimentions());

    useEffect(() => {
        if (hasWindow) {
            const handleResize = () => setWindowDimentions(getWindowDimentions());

            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
    }, [getWindowDimentions, hasWindow]);

    return windowDimentions;
};

const Navigaation = () => {
    const [showing, setShowing] = useState('nav-links');
    const [animation, setAnimation] = useState(0);
    const [burger, setBurger] = useState('burger');
    const [loggedUser, setLoggedUser] = useState(localStorage.getItem('loggedUser') ? JSON.parse(localStorage.getItem('loggedUser')) : {});
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
    const [show, setShow] = useState('none');
    const { ref, modalStyle, setModalStyle } = useComponentVisbile({ pointerEvents: 'none', opacity: 0 });
    const { width } = useWindowDimentions();

    const handleClick = () => {
        if (width > 1180) {
            return;
        }
        setShowing(showing === 'nav-links' ? 'nav-links nav-active' : 'nav-links');
        setAnimation(animation ? 0 : 1);
        setBurger(burger === 'burger' ? 'burger cross' : 'burger');
    }

    const handleUserLogin = (user, logged) => {
        // console.log(`Navigaatio handleUserLogin | username-${username}, logged-${logged}`);
        setLoggedUser(user);
        setLoggedIn(logged);
        setModalStyle({
            pointerEvents: 'none', 
            opacity: 0
        });
    }

    const handleLogout = () => {
        localStorage.clear();
        handleUserLogin({}, false);
        setShow('none');
    };

    useEffect(() => {
        // console.log('Navigaatio useEffect');
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        localStorage.setItem('loggedIn', loggedIn);
    }, [loggedUser, loggedIn]);

    let b = '/react2020/oppilas33';
    const content = <Router>
        <nav>
            <div>
                <h2 className='nav-title'><Link to={`${b}/`}>Northwind React App 2020</Link></h2>
            </div>
            <ul className={showing}>
                {loggedIn && <li nlfade1={animation}><Link onClick={handleClick} to={`${b}/asiakkaat`}>Asiakkaat</Link></li>} 
                {loggedIn && <li nlfade1={animation}><Link onClick={handleClick} to={`${b}/tuotteet`}>Tuotteet</Link></li>} 
                {loggedIn && <li nlfade2={animation}><Link onClick={handleClick} to={`${b}/typicode`}>Typicode</Link></li>}
                <li nlfade3={animation}><Link onClick={handleClick} to={`${b}/viestit`}>Viestit</Link></li>
                <li nlfade4={animation}><Link onClick={handleClick} to={`${b}/salaus`}>Salaus</Link></li>
            </ul>
            {!loggedIn && <div className='nav-account'>
                <img src={usericon} className='user-icon' alt='usericon' onClick={() => setModalStyle({ pointerEvents: 'all', opacity: 1 })} />
            </div>}
            {loggedIn && <div className='nav-account'>
                <img src={usericon} className='user-icon' alt='usericon' onClick={() => setShow(show === 'none' ? 'block' : 'none')} />
                <ul className='nav-account-options' style={{display: show}}>
                    <li><Link onClick={() => setShow('none')} to={`${b}/profiili`}>Profiili</Link></li>
                    <li><a href='#0' onClick={handleLogout}>Kirjaudu ulos</a></li>
                </ul>
            </div>}
            <div className={burger} onClick={handleClick}>
                <div className='line1'></div>
                <div className='line2'></div>
                <div className='line3'></div>
            </div>
        </nav>
        <main>
            <Switch>
                <Route exact path={`${b}/`} component={App}/>
                <Route path={`${b}/asiakkaat`}>
                    {loggedIn ? <NWCustomersFetch handleLogout={handleLogout} /> : <Redirect to={`${b}/kirjautuminen`} />}
                </Route>
                <Route path={`${b}/tuotteet`}>
                    {loggedIn ? <NWProductsFetch handleLogout={handleLogout} /> : <Redirect to={`${b}/kirjautuminen`} />}
                </Route>
                <Route path={`${b}/typicode`}>
                    {loggedIn ? <TypicodeFetch /> : <Redirect to={`${b}/kirjautuminen`} />}
                </Route>
                <Route path={`${b}/viestit`} component={Viestit}/>
                <Route path={`${b}/salaus`} component={Md5Salaus}/>
                <Route path={`${b}/kirjautuminen`}>
                    {loggedIn ? <Redirect to={`${b}/`} /> : <Kirjautuminen handleUserLogin={handleUserLogin} /> }
                </Route>
                <Route path={`${b}/profiili`}>
                    {loggedIn ? <Profile user={loggedUser} handleUserLogin={handleUserLogin} /> : <Redirect to={`${b}/kirjautuminen`} /> }
                </Route>
            </Switch>
        </main>
        <Footer user={loggedUser.username}/>
        {!loggedIn &&
        <div className='modal' style={modalStyle}>
            <div ref={ref} className='modal-content'>
                <Kirjautuminen handleUserLogin={handleUserLogin} />
            </div>
        </div>}
    </Router>;
    
    return content;
};

export default Navigaation;