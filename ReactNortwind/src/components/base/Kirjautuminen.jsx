import React, { useState } from 'react';
import Login from '../northwind/Login';
import Register from '../northwind/Register';

const Kirjautuminen = ({ handleUserLogin }) => {
    const [selection, setSelection] = useState(true);
    const [processing, setProcessing] = useState(false);
    const center = {
        textAlign: 'center'
    };

    return(
        <div className='kirjautuminen'>
            <h3 style={center}>Kirjaudu sisään tai rekisteröidy sivulle.</h3>
            <div style={center}>
                <button className='myButton' onClick={() => setSelection(true)}>Kirjaudu sisään</button>
                <button className='myButton' onClick={() => setSelection(false)}>Rekisteröidy</button>
            </div>
            {selection 
                ? <Login handleUserLogin={handleUserLogin} loading={processing} setLoading={setProcessing} /> 
                : <Register handleUserLogin={handleUserLogin} loading={processing} setLoading={setProcessing} />
            }
            {processing && <p className='loading' style={center}>Käsitellään</p>}
        </div>
    );
};

export default Kirjautuminen;