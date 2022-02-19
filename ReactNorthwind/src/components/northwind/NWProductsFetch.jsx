import React, { useState, useEffect } from 'react';
import { BASE_URL } from './NWConnection';
import Helpit from '../base/Helpit';
import NWProductEdit from './NWProductEdit';
import './NWStyle.css';
import NWProductAdd from './NWProductAdd';

const NWProductsFetch = ({ handleLogout }) => {
    const [visible, setVisible] = useState('table');
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState(0);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [categoryId, setCategoryId] = useState('0');
    const [prevDisabled, setPrevDisabled] = useState(true);
    const [nextDisabled, setNextDisabled] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [editProduct, setEditProduct] = useState({});
    const [productToDelete, setProductToDelete] = useState(0);
    const [deleteError, setDeleteError] = useState('');
    const [tokenExpired, setTokenExpired] = useState(false);

    const handleChildUnmount = () => {
        setVisible('table');
        setRefresh(!refresh);
    };
    const handleClickNext = () => {
        if (count >= limit) {
            setOffset(offset + limit);
            setPrevDisabled(false);
        } else {
            setNextDisabled(true);
        }
    };
    const handleClickPrev = () => {
        if ((offset - limit) < 0) {
            setOffset(0)
            setPrevDisabled(true);
        } else {
            setOffset(offset - limit)
        }
    };
    const handleLimitChange = e => {
        setLimit(parseInt(e.target.value));
        setOffset(0)
        setPrevDisabled(true);
    };
    const handleCategoryIdChange = e => {
        setCategoryId(e.target.value);
        setOffset(0)
        setPrevDisabled(true);
    };
    const handleClickEdit = (dataObj) => {
        setEditProduct(dataObj);
        setVisible('editform');
    };
    const handleClickDelete = (poistettava) => {
        setProductToDelete(poistettava);
        setDeleteError('');
        setVisible('deleteform');
    };
    const handlePerformDelete = async () => {
        if (productToDelete < 1) {
            return;
        }
        let token = localStorage.getItem('token');
        try {
            let result = await fetch(`${BASE_URL}product/${productToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: null
            });
            if (result.status === 200) {
                deletionComplete();
            } else {
                console.log(result.status);
            }
        } catch (error) {
            if (error instanceof TypeError) {
                setDeleteError('Tuotetta ei voida poistaa tietokannasta olemassaolevien tilausten vuoksi.');
            } else {
                setDeleteError(error.message);
            }
        }

    };
    const deletionComplete = () => {
        setVisible('table');
        setRefresh(!refresh);
        setProductToDelete(0);
    };

    useEffect(() => {
        let url = `${BASE_URL}product/r?offset=${offset}&limit=${limit}`;
        if (parseInt(categoryId) > 0) {
            url += `&categoryId=${categoryId}`;
        }
        let token = localStorage.getItem('token');
        (async () => {
            let result = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (result.status === 401) {
                setTokenExpired(true);
            } else if (result.status === 200) {
                let resultJSON = await result.json();
                setProducts(resultJSON);
                let prodCount = resultJSON.length;
                setCount(prodCount);
                setNextDisabled(prodCount < limit);
            } else {
                console.error(result.status);
            }
        })();
    }, [offset, limit, categoryId, refresh]);

    let content;
    if (visible === 'table') {
        content = <div className='nwProducts'>
            {tokenExpired ? <div>
                <h3 className='text-red'>Istunto on vanhentunut. Ole hyvä ja kirjaudu uudelleen.</h3>
                <button className='myButton' onClick={() => handleLogout()}>Kirjaudu ulos</button><hr />
            </div> : <div>
                {count > 0 ? <h3>Tuotteita haettu {count}.</h3> : <h3 className='loading'>Ladataan tietoja Northwind-tietokannasta</h3>}<hr />
            </div>}
            <div>
                <select onChange={handleCategoryIdChange} value={categoryId}>
                    <option value='0'>Valitse kategoria</option>
                    <option value='1'>Juomat</option>
                    <option value='2'>Mausteet</option>
                    <option value='3'>Makeiset</option>
                    <option value='4'>Maitotuotteet</option>
                    <option value='5'>Jyvät/Viljat</option>
                    <option value='6'>Liha/Siipikarja</option>
                    <option value='7'>Vihannekset</option>
                    <option value='8'>Kala/Äyriäiset</option>
                </select>
                <select onChange={handleLimitChange} value={limit} title='Tuotetta per sivu'>
                    <option value='5'>5</option>
                    <option value='10'>10</option>
                    <option value='15'>15</option>
                    <option value='20'>20</option>
                </select>
                <button className='myButton' onClick={() => setVisible('help')}>Opaste</button>
                <button className='myButton' onClick={() => setVisible('addform')}>Lisää tuote</button>
                <button className='myButton' onClick={handleClickPrev} disabled={prevDisabled}>Edelliset</button>
                <button className='myButton' onClick={handleClickNext} disabled={nextDisabled}>Seuraavat</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Tuotteen nimi</th>
                        <th>Hinta</th>
                        <th>Määrä</th>
                        <th>Kpl varastossa</th>
                        <th>Lopetettu</th>
                        <th>Toiminnot</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => {
                        return (
                            <tr key={product.productId}>
                                <td>{product.productName}</td>
                                <td>{product.unitPrice}</td>
                                <td>{product.quantityPerUnit}</td>
                                <td>{product.unitsInStock}</td>
                                <td><input type='checkbox' disabled checked={product.discontinued} /></td>
                                <td>
                                    <button className='myButton' onClick={() => handleClickEdit(product)}>Muokkaa</button>
                                    <button className='myButton' onClick={() => handleClickDelete(product.productId)}>Poista</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>;
    } else if (visible === 'help') {
        content = <div className='nwProducts'>
            <h3>Opaste</h3>
            <div>
                <button className='myButton' onClick={() => setVisible('table')}>Selaa tuotteita</button>
                <button className='myButton' onClick={() => setVisible('addform')}>Lisää tuote</button>
            </div>
            <Helpit moduuli='NWProductsFetch' />
        </div>;
    } else if (visible === 'editform') {
        content = <div className='nwProducts'>
            <h3>Muokkaa tuotteen {editProduct.productName} tietoja.</h3><hr />
            <div>
                <button className='myButton' onClick={() => setVisible('table')}>Selaa tuotteita</button>
                <button className='myButton' onClick={() => setVisible('help')}>Opaste</button>
            </div>
            <NWProductEdit tuoteObj={editProduct} unmountMe={handleChildUnmount} />
        </div>;
    } else if (visible === 'addform') {
        content = <div className='nwProducts'>
            <h3>Lisää uusi tuote.</h3><hr />
            <div>
                <button className='myButton' onClick={() => setVisible('table')}>Selaa tuotteita</button>
                <button className='myButton' onClick={() => setVisible('help')}>Opaste</button>
            </div>
            <NWProductAdd unmountMe={handleChildUnmount} />
        </div>;
    } else if (visible === 'deleteform') {
        content = <div className='nwProducts'>
            <h3 className='text-red' style={{textAlign: 'center'}}>Tuotteen "{(products.find(product => product.productId === productToDelete)).productName}" tietojen poiston vahvistus.</h3>
            <hr />
            <div>
                <button className='myButton' onClick={() => setVisible('table')}>Selaa tuotteita</button>
                <button className='myButton' onClick={() => setVisible('help')}>Opaste</button>
            </div>
            <input className='myButton' type='submit' onClick={handlePerformDelete} value='Vahvista poisto' style={{margin: '5px 25% 0% 25%'}} disabled={deleteError !== ''} />
            {deleteError && <p className='text-red' style={{textAlign: 'center'}}>{deleteError}</p>}
        </div>;
    } else {
        content = <div className='nwProducts'><h3 style={{textAlign: 'center'}}>Hups... Jotain meni pieleen.</h3></div>;
    }

    return content;
};

export default NWProductsFetch;