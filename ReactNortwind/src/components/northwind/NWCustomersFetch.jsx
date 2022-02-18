import React, { useState, useEffect } from 'react';
import './NWStyle.css';
import Helpit from '../base/Helpit';
import NWCustomerAdd from './NWCustomerAdd';
import NWCustomerEdit from './NWCustomerEdit';
import { BASE_URL } from './NWConnection';

export default function NWCustomersFetch({ handleLogout }) {
    const [customers, setCustomers] = useState([]);
    const [editCustomer, setEditCustomer] = useState({});
    const [count, setCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);
    const [country, setCountry] = useState('');
    const [visible, setVisible] = useState('table');
    const [refresh, setRefresh] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState('');
    const [prevDisabled, setPrevDisabled] = useState(true);
    const [nextDisabled, setNextDisabled] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [tokenExpired, setTokenExpired] = useState(false);

    function handleChildUnmount() {
        setRefresh(!refresh);
        handleClickTable()
    }

    function handleClickDelete(e, poistettava) {
        setCustomerToDelete(poistettava);
        setDeleteError('');
        setVisible('deleteform');
    }

    function handlePerformDelete() {
        let token = localStorage.getItem('token');
        let url = `${BASE_URL}customers/${customerToDelete}`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: null
        })
        .then(response => response.json())
        .then(json => {
            // console.log(JSON.stringify(json));
            if (json) {
                deletionComplete();
            }
        })
        .catch(error => {
            if (error instanceof TypeError) {
                setDeleteError('Asiakasta ei voida poistaa tietokannasta olemassaolevien tilausten vuoksi.');
            } else {
                setDeleteError(error.message);
            }
        });
    }

    function deletionComplete() {
        setRefresh(!refresh);
        handleClickTable();
        setCustomerToDelete('');
    }

    function handleClickEdit(e, dataObj) {
        // console.log(e.type);
        setEditCustomer(dataObj);
        setVisible('editform');
    }

    function handleClickPrev() {
        if ((offset - limit) < 0) {
            setOffset(0)
            setPrevDisabled(true);    
        } else {
            setOffset(offset - limit);
        }
        // console.log('NWCustomersFetch handleClickPrev');
    }

    function handleClickNext() {
        if (count >= limit) {
            setOffset(offset + limit);
            setPrevDisabled(false);
        }
        // console.log('NWCustomersFetch handleClickNext');
    }

    function handleLimitChange(e) {
        setLimit(parseInt(e.target.value));
        setOffset(0);
        setPrevDisabled(true);
        // console.log('NWCustomersFetch handleLimitChange');
    }

    function handleFilterChange(e) {
        setCountry(e.target.value.trim());
        setOffset(0);
        setPrevDisabled(true);
        // console.log(`NWCustomersFetch handleFilterChange (${e.target.value})`);
    }

    function handleClickTable() {
        setVisible('table');
    }

    function handleClickHelp() {
        setVisible('help');
    }

    function handleClickAdd() {
        setVisible('addform');
    }

    useEffect(() => {
        let token = localStorage.getItem('token');
        let uri = `${BASE_URL}customers/r?offset=${offset}&limit=${limit}`;
        if (country) {
            uri += `&country=${country}`;
        }
        // console.log(`NWCustomersFetch useEffect ${uri}`);
        fetch(uri, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(response => {
                if (response.status === 401) {
                    setTokenExpired(true);
                } else {
                    response.json()
                        .then(json => {
                            // console.log(JSON.stringify(json));
                            setCustomers(json);
                            let custCount = json.length;
                            setCount(custCount);
                            setNextDisabled(custCount < limit);
                        });
                }
            })
            .catch(error => console.error(error.message));
    }, [offset, limit, country, refresh]);

    if (visible === 'table') {
        return(
            <div className='nwCustomers'>
                <div>
                    {tokenExpired ? <div>
                        <h3 className='text-red'>Istunto on vanhentunut. Ole hyvä ja kirjaudu uudelleen.</h3>
                        <button className='myButton' onClick={() => handleLogout()}>Kirjaudu ulos</button><hr />
                    </div> : <div>
                    {count > 0 ? <h3>Asiakkaita haettu {count}.</h3> : <h3 className='loading'>Ladataan tietoja Northwind-tietokannasta</h3>}<hr />
                    </div>}
                    <div className='nwCustomers-buttons'>
                        <input type='text' onChange={handleFilterChange} placeholder='Anna maa' title='Hae asiakkaita maan perusteella' />
                        <select id='limits' onChange={handleLimitChange} value={limit} title='Asiakasta per sivu.'>
                            <option value='5'>5</option>
                            <option value='10'>10</option>
                            <option value='15'>15</option>
                            <option value='20'>20</option>
                        </select>
                        <button className='myButton' onClick={handleClickHelp}>Opasteet</button>
                        <button className='myButton' onClick={handleClickAdd}>Lisää asiakas</button>
                        <button className='myButton' onClick={handleClickPrev} disabled={prevDisabled}>Edelliset</button>
                        <button className='myButton' onClick={handleClickNext} disabled={nextDisabled}>Seuraavat</button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Asiakas ID</th>
                            <th>Yhtiön nimi</th>
                            <th>Yhteyshenkilö</th>
                            <th>Osoite</th>
                            <th>Toiminnat</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        customers.map((customer) => {
                            return(
                                <tr key={customer.customerId}>
                                    <td>{customer.customerId}</td>
                                    <td>{customer.companyName}</td>
                                    <td>{customer.contactName}</td>
                                    <td>{customer.address}</td>
                                    <td>
                                        <button className='myButton' onClick={(e) => handleClickEdit(e, customer)}>Muokkaa</button>
                                        <button className='myButton' onClick={(e) => handleClickDelete(e, customer.customerId)}>Poista</button>
                                    </td>
                                </tr>
                            ) 
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    } else if (visible === 'help') {
        return(
            <div className='nwCustomers'>
                <h3>Opaste</h3>
                <div className='nwCustomers-buttons'>
                    <button className='myButton' onClick={handleClickAdd}>Lisää asiakas</button>
                    <button className='myButton' onClick={handleClickTable}>Selaa asiakkaita</button>
                </div>
                <Helpit moduuli='NWCustomersFetch'/>
            </div>
        );
    } else if (visible === 'addform') {
        return(
            <div className='nwCustomers'>
                <h3>Lisää uusi asiakas.</h3><hr />
                <div className='nwCustomers-buttons'>
                    <button className='myButton' onClick={handleClickHelp}>Opasteet</button>
                    <button className='myButton' onClick={handleClickTable}>Selaa asiakkaita</button>
                </div>
                <NWCustomerAdd unmountMe={handleChildUnmount} />
            </div>
        );
    } else if (visible === 'editform') {
        return(
            <div className='nwCustomers'>
                <h3>Muokkaa asiakkaan {editCustomer.companyName} tietoja.</h3><hr />
                <div className='nwCustomers-buttons'>
                    <button className='myButton' onClick={handleClickHelp}>Näytä opaste</button>
                    <button className='myButton' onClick={handleClickTable}>Selaa asiakkaita</button>
                </div>
                <NWCustomerEdit asikasObj={editCustomer} unmountMe={handleChildUnmount} />
            </div>
        );
    } else if (visible === 'deleteform') {
        let toDelete = customers.find(customer => customer.customerId === customerToDelete);
        return(
            <div className='nwCustomers'>
                <h3 className='text-red' style={{textAlign: 'center'}}>Asiakaan "{toDelete.companyName}" tietojen poiston vahvistus.</h3><hr />
                <div className='nwCustomers-buttons'>
                    <button className='myButton' onClick={handleClickHelp}>Näytä opaste</button>
                    <button className='myButton' onClick={handleClickTable}>Selaa asiakkaita</button>
                </div>
                <input className='myButton' type='submit' onClick={handlePerformDelete} value='Vahvista poisto' style={{margin: '5px 25% 0% 25%'}} disabled={deleteError !== ''} />
                {deleteError && <p className='text-red' style={{textAlign: 'center'}}>{deleteError}</p>}
            </div>
        );
    } else {
        return <div className='nwCustomers'><h3>Hups... Tapahtui virhe. Yritä ladata sivu uudelleen. Jos ongelmä jatkuu, ota yhteyttä järjestelmänvalvojaan.</h3></div>;
    }
}