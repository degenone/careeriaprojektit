import React, { useState } from 'react';
import { BASE_URL } from './NWConnection';

const NWCustomerAdd = ({ unmountMe }) => {
    const [customerID, setCustomerID] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactTitle, setContactTitle] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [region, setRegion] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [fax, setFax] = useState('');

    const handleChangeCustomerID = e => setCustomerID(e.target.value.toUpperCase());
    const handleChangeCompanyName = e => setCompanyName(e.target.value);
    const handleChangeContactName = e => setContactName(e.target.value);
    const handleChangeContactTitle = e => setContactTitle(e.target.value);
    const handleChangeAddress = e => setAddress(e.target.value);
    const handleChangeCity = e => setCity(e.target.value);
    const handleChangeRegion = e => setRegion(e.target.value);
    const handleChangePostalCode = e => setPostalCode(e.target.value);
    const handleChangeCountry = e => setCountry(e.target.value);
    const handleChangePhone = e => setPhone(e.target.value);
    const handleChangeFax = e => setFax(e.target.value);
    const handleSubmit = e => {
        e.preventDefault();
        insertIntoNW();
    };

    const dismiss = () => unmountMe();

    const insertIntoNW = () => {
        let token = localStorage.getItem('token');
        let asiakas = {
            CustomerID: customerID,
            CompanyName: companyName,
            ContactName: contactName,
            ContactTitle: contactTitle,
            Address: address,
            City: city,
            Region: region,
            PostalCode: postalCode,
            Country: country,
            Phone: phone,
            Fax: fax
        };
        let asiakasJSON = JSON.stringify(asiakas);
        let apiUrl = BASE_URL + 'customers';
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: asiakasJSON
        }).then((response) => response.json())
        .then((json) => {
            let success = json;
            // console.log(`Response from server: ${success}`);
            if (success) {
                // alert('Asiakas tallennettu onnistuneesti.');
                dismiss();
            }
        });
    };

    return(
        <form onSubmit={handleSubmit}>
            <label>Anna asiakkaan ID<span className='text-red'>*</span></label>
            <input type='text' placeholder='Asiakas ID' title='Syötä asiakastunnus' required maxLength='5' onChange={handleChangeCustomerID} />
            <label>Anna yrityksen nimi<span className='text-red'>*</span></label>
            <input type='text' placeholder='Yrityksen nimi' required maxLength='40' onChange={handleChangeCompanyName} />
            <label>Anna yhteyshenkilön nimi</label>
            <input type='text' placeholder='Yhteyshenkilö' maxLength='30' onChange={handleChangeContactName} />
            <label>Anna yhteyshenkilön titteli</label>
            <input type='text' placeholder='Yhteyshenkilön titteli' maxLength='30' onChange={handleChangeContactTitle} />
            <label>Anna osoite</label>
            <input type='text' placeholder='Osoite' maxLength='60' onChange={handleChangeAddress} />
            <label>Anna kaupunki</label>
            <input type='text' placeholder='Kaupunki' maxLength='15' onChange={handleChangeCity} />
            <label>Anna seutu</label>
            <input type='text' placeholder='Seutu' maxLength='15' onChange={handleChangeRegion} />
            <label>Anna postinumero</label>
            <input type='text' placeholder='Postinumero' maxLength='10' onChange={handleChangePostalCode} />
            <label>Anna maa</label>
            <input type='text' placeholder='Maa' maxLength='15' onChange={handleChangeCountry} />
            <label>Anna puhelinnumero</label>
            <input type='text' placeholder='Puhelin' maxLength='24' onChange={handleChangePhone} />
            <label>Anna faksinumero</label>
            <input type='text' placeholder='Faksi' maxLength='24' onChange={handleChangeFax} />
            <input className='myButton' type='submit' value='Tallenna asiakas' />
        </form>
    );
};

export default NWCustomerAdd;