import React, { useState } from 'react';
import { BASE_URL } from './NWConnection';

const Login = ({ handleUserLogin, loading, setLoading }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (e) => {
        loginToNorthwind();
        e.preventDefault();
    };

    const loginToNorthwind = async () => {
        setLoading(true);
        const response = await fetch(`http://md5.jsontest.com/?text=${password}`);
        const resJSON = await response.json();
        let bodyObj = { Username: username, Password: resJSON.md5 };
        try {
            const result = await fetch(BASE_URL + 'reactlogin/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(bodyObj)
            });
            if (result.status === 200) {
                const loggedIn = await result.json();
                setLoading(false);
                localStorage.setItem('token', loggedIn.token);
                handleUserLogin({
                    loginId: loggedIn.loginId,
                    etunimi: loggedIn.etunimi,
                    sukunimi: loggedIn.sukunimi,
                    email: loggedIn.email,
                    username: loggedIn.username
                }, true);
            } else if (result.status === 404) {
                setLoading(false);
                setErrorMsg('Virheellinen käyttäjänimi ja/tai salasana.');
            } else {
                setLoading(false);
                setErrorMsg(`Jotain meni pieleen. Status code: ${result.status}`);
            }
        } catch (error) {
            setLoading(false);
            setErrorMsg('Serveri ei ole toiminassa. Yritä uudelleen myöhemmin.')
        }
    };

    return(
        <div className='form-container' hidden={loading}>
            <form onSubmit={handleSubmit}>
                {errorMsg && <><label className='text-red'>{errorMsg}</label><br /></>}
                <label>Anna käyttäjänimesi</label>
                <input type='text' placeholder='Käyttäjänimi' maxLength='50' onChange={(e) => setUsername(e.target.value)} required/>
                <label>Anna salasanasi</label>
                <input type='password' placeholder='Salasana' onChange={(e) => setPassword(e.target.value)} required/>
                <input className='myButton' type="submit" value='Kirjaudu' />
            </form>
        </div>
    );
};

export default Login;