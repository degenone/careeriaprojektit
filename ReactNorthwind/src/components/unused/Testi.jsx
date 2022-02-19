import React, { useState, useEffect } from 'react';

const testiFunktio = (msg) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(msg.length);
        }, 2000);
    });
}

const TestiA = () => {
    const [value, setValue] = useState({ text: '', length: 0, submitted: false });

    const handleSubmit = (e) => {
        setValue({ ...value, length: 0, submitted: true });
        e.preventDefault();
    };

    useEffect(() => {
        let mounted = true;
        if (value.submitted) {
            testiFunktio(value.text)
            .then(data => {
                if (mounted) {
                    setValue({ text: '', length: data, submitted: false });
                }
            });
        }

        return () => mounted = false;
    }, [value.submitted, value.text]);

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>Selvitä merkkijonon pituus
                    <input type='text' onChange={({ target }) => setValue({ ...value, text: target.value })} placeholder='Syötä merkkijono' value={value.text} />
                </label>
                <input type='submit' className='myButton' value='Laske pituus' />
            </form>
            {value.length > 0 && <p>Merkkijonon pituus on {value.length} merkkiä.</p>}
        </div>
    );
}

const Testi = () => {
    const [show, setShow] = useState(false);

    return(
        <div>
            <button className='myButton' onClick={() => setShow(!show)}>{show ? 'Piilota' : 'Näytä'}</button>
            {show && <TestiA />}
        </div>
    );
};

export default Testi;