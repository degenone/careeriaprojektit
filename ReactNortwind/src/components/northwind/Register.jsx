import React, { useState } from 'react';
import { BASE_URL } from './NWConnection';

const Register = ({ handleUserLogin, loading, setLoading }) => {
    const [etunimi, setEtunimi] = useState('');
    const [sukunimi, setSukunimi] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [matchingPW, setMatchingPW] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const handleConfirmPW = (e) => setMatchingPW(e.target.value === password);

    const handleSubmit = (e) => {
        if (!matchingPW || !password) {
            return;
        }
        if (errorMsg) {
            setErrorMsg('');
        }
        registerNewUser();
        e.preventDefault();
    };

    const registerNewUser = async () => {
        let url = `http://md5.jsontest.com/?text=${password}`;
        let apiUrl = BASE_URL + 'reactlogin';
        
        setLoading(true);
        const md5res = await fetch(url);
        const pwHash = await md5res.json();
        // console.log(pwHash);
        let userObj = {
            Etunimi: etunimi,
            Sukunimi: sukunimi,
            Email: email,
            Username: username,
            Password: pwHash.md5
        };
        // console.log(userObj);
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(userObj)
            });
            const newUser = await response.json();
            setLoading(false);
            if (newUser.status === 409) {
                setErrorMsg('Käyttäjänimi on jo käytössä, valitse toinen.');
            } else if (newUser.username) {
                localStorage.setItem('token', newUser.token);
                handleUserLogin({
                    loginId: newUser.loginId,
                    etunimi: newUser.etunimi,
                    sukunimi: newUser.sukunimi,
                    email: newUser.email,
                    username: newUser.username
                }, true);
            }
            // console.log(`Response from server: ${JSON.stringify(newUser)}`);
        } catch (error) {
            setLoading(false);
            if (error instanceof TypeError) {
                setErrorMsg('Serveri ei ole päällä. Yritä uudelleen myöhemmin.');
            } else if (error instanceof SyntaxError) {
                setErrorMsg('Tarkista, että täytit kentät oikein.');
            } else {
                setErrorMsg(error);
            }
        }
    };

    return(
        <div className='form-container' hidden={loading}>
            <form onSubmit={handleSubmit}>
                {errorMsg && <><label className='text-red'>{errorMsg}</label><br /></>}
                <label>Anna etunimesi</label>
                <input type='text' maxLength='50' placeholder='Etunimi' onChange={(e) => setEtunimi(e.target.value)} />
                <label>Anna sukunimesi</label>
                <input type='text' maxLength='50' placeholder='Sukunimi' onChange={(e) => setSukunimi(e.target.value)} />
                <label>Anna sähköpostiosoitteesi</label>
                <input type='email' placeholder='Sähköposti' maxLength='250' onChange={(e) => setEmail(e.target.value)} />
                <label>Anna käyttäjänimi<span className='text-red'>*</span></label>
                <input type='text' maxLength='50' placeholder='Käyttäjänimi' required onChange={(e) => setUsername(e.target.value)} />
                <label>Anna salasana<span className='text-red'>*</span></label>
                <input type='password' placeholder='Salasana' required onChange={(e) => setPassword(e.target.value)} />
                <label>Anna salasana uudelleen<span className='text-red'>*</span></label>
                <input type='password' placeholder='Salasana uudelleen' required onChange={handleConfirmPW} />
                { !matchingPW && <><label className='text-red'>Salasanojen täytyy täsmätä!</label><br /></> }
                <input className='myButton' type='submit' disabled={!matchingPW} value='Rekisteröidy' />
            </form>
        </div>
    );
};

export default Register;