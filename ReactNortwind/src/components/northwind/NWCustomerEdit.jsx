import React, { useState } from 'react';
import { BASE_URL } from './NWConnection';

const NWCustomerEdit = ({ asikasObj, unmountMe }) => {
    const [asiakas, setAsiakas] = useState(asikasObj);
    const [errorMsg, setErrorMsg] = useState('');

    const dismiss = () => unmountMe('edit');

    const handleSubmit = (e) => {
        updateCustomer();
        e.preventDefault();
    }

    const updateCustomer = async () => {
        let token = localStorage.getItem('token');
        let url = `${BASE_URL}customers/${asiakas.customerId}`;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(asiakas)
            });
            const updatedCustomer = await response.json();
            if (updatedCustomer.status === 400) {
                setErrorMsg('Käyttäjänimi on jo käytössä, valitse toinen.');
            } else if (updatedCustomer) {
                dismiss();
            }
            // console.log(`Response from server: ${JSON.stringify(updatedCustomer)}`);
        } catch (error) {
            if (error instanceof TypeError) {
                setErrorMsg('Serveri ei ole päällä. Yritä uudelleen myöhemmin.');
            } else if (error instanceof SyntaxError) {
                setErrorMsg('Tarkista, että täytit kentät oikein.');
            } else {
                setErrorMsg(`${error.name} - ${error.message}`);
            }
        }
    };

    return(
        <>{asiakas ? (
            <form onSubmit={handleSubmit}>
                {errorMsg && <label className='text-red'>{errorMsg}</label>}
                <label>Asiakkaan ID</label>
                <input
                    type='text'
                    value={asiakas.customerId}
                    onChange={(e) => setAsiakas({...asiakas, customerId: e.target.value.toUpperCase()})}
                    placeholder='Asiakas ID'
                    required
                    maxLength='5'
                />
                <label>Yrityksen nimi</label>
                <input
                    type='text'
                    value={asiakas.companyName}
                    onChange={(e) => setAsiakas({...asiakas, companyName: e.target.value})}
                    placeholder='Yrityksen nimi'
                    required
                    maxLength='40'
                />
                <label>Yhteyshenkilön nimi</label>
                <input
                    type='text'
                    value={asiakas.contactName ? asiakas.contactName : ''}
                    onChange={(e) => setAsiakas({...asiakas, contactName: e.target.value})}
                    placeholder='Yhteyshenkilö'
                    maxLength='30'
                />
                <label>Yhteyshenkilön titteli</label>
                <input
                    type='text'
                    value={asiakas.contactTitle ? asiakas.contactTitle : ''}
                    onChange={(e) => setAsiakas({...asiakas, contactTitle: e.target.value})}
                    placeholder='Yhteyshenkilön titteli'
                    maxLength='30'
                />
                <label>Osoite</label>
                <input
                    type='text'
                    value={asiakas.address ? asiakas.address : ''}
                    onChange={(e) => setAsiakas({...asiakas, address: e.target.value})}
                    placeholder='Osoite'
                    maxLength='60'
                />
                <label>Kaupunki</label>
                <input
                    type='text'
                    value={asiakas.city ? asiakas.city : ''}
                    onChange={(e) => setAsiakas({...asiakas, city: e.target.value})}
                    placeholder='Kaupunki'
                    maxLength='15'
                />
                <label>Seutu</label>
                <input
                    type='text'
                    value={asiakas.region ? asiakas.region : ''}
                    onChange={(e) => setAsiakas({...asiakas, region: e.target.value})}
                    placeholder='Seutu'
                    maxLength='15'
                />
                <label>Postinumero</label>
                <input
                    type='text'
                    value={asiakas.postalCode ? asiakas.postalCode : ''}
                    onChange={(e) => setAsiakas({...asiakas, postalCode: e.target.value})}
                    placeholder='Postinumero'
                    maxLength='10'
                />
                <label>Maa</label>
                <input
                    type='text'
                    value={asiakas.country ? asiakas.country : ''}
                    onChange={(e) => setAsiakas({...asiakas, country: e.target.value})}
                    placeholder='Maa'
                    maxLength='15'
                />
                <label>Puhelinnumero</label>
                <input
                    type='text'
                    value={asiakas.phone ? asiakas.phone : ''}
                    onChange={(e) => setAsiakas({...asiakas, phone: e.target.value})}
                    placeholder='Puhelin'
                    maxLength='24'
                />
                <label>Faksinumero</label>
                <input
                    type='text'
                    value={asiakas.fax ? asiakas.fax : ''}
                    onChange={(e) => setAsiakas({...asiakas, fax: e.target.value})}
                    placeholder='Faksi'
                    maxLength='24'
                />
                <input className='myButton' type='submit' value='Päivitä asiakkaan tiedot' />
            </form>) : <p className='text-red'>Jotain meni pieleen. Yritä uudelleen!</p>}
        </>
    );
};

export default NWCustomerEdit;