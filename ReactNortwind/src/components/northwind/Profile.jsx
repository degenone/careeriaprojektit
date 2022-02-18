import React, { useState } from 'react';
import { BASE_URL } from './NWConnection';

const Profile = ({user, handleUserLogin }) => {
    const [userProfile, setUserProfile] = useState(user);
    const [editOn, setEditOn] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [pwReset, setPwReset] = useState({oldPassword: '', newPassword: ''});
    const [pwConfirm, setPwConfirm] = useState('');
    const [matchingPW, setMatchingPW] = useState(true);
    const [pwResetView, setPwResetView] = useState(true);
    const [pwResetDisplay, setPwResetDisplay] = useState('none');
    const [processing, setProcessing] = useState(false);
    const center = {
        textAlign: 'center'
    };

    const handleSubmit = (e) => {
        try {
            if (e.target.name === 'profile') {
                updateUserProfile();
            } else if (e.target.name === 'resetpw') {
                resetPassword();
            }
        } catch (error) {
            console.log(error);
            console.log(error.message);
        }
        e.preventDefault();
    };

    const updateUserProfile = async () => {
        setProcessing(true);
        let token = localStorage.getItem('token');
        const result = await fetch(`${BASE_URL}reactlogin/${userProfile.loginId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userProfile)
        });
        // console.log(`Profile - updateUserProfile - ${JSON.stringify(userProfile)}`);
        if (result.status === 200) {
            setUserProfile(await result.json());
            handleUserLogin(userProfile, true);
            setEditOn(!editOn);
        } else if (result.status === 409) {
            setErrorMsg('Käyttäjänimi on jo käytössä. Valitse toinen.');
        } else {
            setErrorMsg('Jotain meni pieleen. Yritä uudelleen. Jos vika jatkuu, kirjaudu ulos ja takaisin sisään ja yritä uudelleen.')
        }
        setProcessing(false);
    };

    const resetPassword = async () => {
        setProcessing(true);
        const pwHashGet = {
            oldPassword: await (await fetch(`http://md5.jsontest.com/?text=${pwReset.oldPassword}`)).json(), 
            newPassword: await (await fetch(`http://md5.jsontest.com/?text=${pwReset.newPassword}`)).json()
        };
        let token = localStorage.getItem('token');
        const result = await fetch(`${BASE_URL}reactlogin/resetpassword/${userProfile.loginId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({oldPassword: pwHashGet.oldPassword.md5, newPassword: pwHashGet.newPassword.md5})
        });
        if (result.status === 200) {
            setPwReset({oldPassword: '', newPassword: ''});
            setPwConfirm('');
            setMatchingPW(true);
            setErrorMsg('');
            handlePwResetView();
        } else if(result.status === 400) {
            setErrorMsg('Annoit väärän salasanan. Yritä uudelleen');
        } else {
            setErrorMsg(`Jotain meni pieleen. Yritä uudelleen. Status koodi serveriltä: ${result.status}.`);
        }
        setProcessing(false);
    };

    const handleEditing = (e) => {
        setEditOn(!editOn);
        e.preventDefault();
    };

    const handleConfirmPW = (e) => {
        setPwConfirm(e.target.value);
        setMatchingPW(e.target.value === pwReset.newPassword);
    };

    const handlePwResetView = () => {
        setPwResetView(!pwResetView);
        setPwResetDisplay(pwResetDisplay === 'none' ? 'block' : 'none');
    };

    return (
        <div>
            {errorMsg && <><label className='text-red' style={center}>{errorMsg}</label><br /></>}
            <div>
                <h3 style={center}>Käyttäjäprofiili</h3>
                {processing && <p className='loading' style={center}>Käsitellään</p>}
                <form name='profile' onSubmit={handleSubmit}>
                    <label htmlFor='enimi'>Etunimi</label>
                    <input 
                        type='text' 
                        value={userProfile.etunimi} 
                        disabled={!editOn} 
                        onChange={(e) => setUserProfile({...userProfile, etunimi: e.target.value})} 
                        placeholder='Etunimi'
                        name='enimi'
                    />
                    <label htmlFor='snimi'>Sukunimi</label>
                    <input 
                        type='text' 
                        value={userProfile.sukunimi} 
                        disabled={!editOn} 
                        onChange={(e) => setUserProfile({...userProfile, sukunimi: e.target.value})} 
                        placeholder='Sukunimi'
                        name='snimi'
                    />
                    <label htmlFor='sposti'>Sähköposti</label>
                    <input 
                        type='text' 
                        value={userProfile.email} 
                        disabled={!editOn} 
                        onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} 
                        placeholder='Sähköposti'
                        name='sposti'
                    />
                    <label htmlFor='nic'>Käyttäjänimi<span className='text-red'>*</span></label>
                    <input 
                        type='text' 
                        value={userProfile.username} 
                        disabled={!editOn} 
                        onChange={(e) => setUserProfile({...userProfile, username: e.target.value})} 
                        placeholder='Käyttäjänimi'
                        required
                        name='nic'
                    />
                    <button className='myButton' onClick={handleEditing} style={{minWidth: '48%'}}>{editOn ? 'Peruuta' : 'Muokkaa'}</button>
                    {editOn && <input className='myButton' type='submit' value='Tallenna' />}
                </form>
            </div><br />
            <div style={{width: 'max(33%, 150px)', margin: 'auto'}}>
                <button className='myButton' onClick={handlePwResetView} style={{marginLeft: '1.5px', width: '48%'}}>{pwResetView ? 'Muuta salasana' : 'Peruuta'}</button>
            </div>
            <div style={{display: pwResetDisplay}}>
                <h3 style={center}>Muuta salasana.</h3>
                <form name='resetpw' onSubmit={handleSubmit}>
                    <label htmlFor='oldPassword'>Anna nykyinen salasana<span className='text-red'>*</span></label>
                    <input
                        type='password'
                        value={pwReset.oldPassword}
                        placeholder='Nykyinen salasana'
                        onChange={(e) => setPwReset({...pwReset, [e.target.name]: e.target.value})}
                        required
                        name='oldPassword'
                    />
                    <label htmlFor='newPassword'>Anna uusi salasana<span className='text-red'>*</span></label>
                    <input
                        type='password'
                        value={pwReset.newPassword}
                        placeholder='Uusi salasana'
                        onChange={(e) => setPwReset({...pwReset, [e.target.name]: e.target.value})}
                        required
                        name='newPassword'
                    />
                    <label htmlFor='repeatnewpw'>Anna uusi salasana uudelleen<span className='text-red'>*</span></label>
                    <input
                        type='password'
                        value={pwConfirm}
                        placeholder='Uusi salasana uudelleen'
                        onChange={handleConfirmPW}
                        required
                        name='repeatnewpw'
                    />
                    {!matchingPW && <><label className='text-red'>Salasanojen täytyy täsmätä!</label><br /></>}
                    <input className='myButton' type="submit" disabled={!matchingPW} value="Päivitä salasana" />
                </form>
            </div>
        </div>
    );
};

export default Profile;