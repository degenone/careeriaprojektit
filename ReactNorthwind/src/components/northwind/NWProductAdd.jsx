import React, { useState } from 'react';
import { BASE_URL } from './NWConnection';

const NWProductAdd = ({ unmountMe }) => {
    const [productName, setProductName] = useState('');
    const [supplierId, setSupplierId] = useState('0');
    const [categoryId, setCategoryId] = useState('0');
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState(0.0);
    const [unitsInStock, setUnitsInStock] = useState(0);
    const [unitsOnOrder, setUnitsOnOrder] = useState(0);
    const [reorderLevel, setReorderLevel] = useState(0);
    const [discontinued, setDiscontinued] = useState(false);
    const [imageLink, setImageLink] = useState('');
    const [selectError, setSelectError] = useState('');
    const selectStyle = { width: '100%' };

    const handleSubmit = (e) => {
        let catInt = parseInt(categoryId);
        let suppInt = parseInt(supplierId);
        if (catInt < 1 || catInt > 8) {
            setSelectError('category');
        } else if (suppInt < 1 || suppInt > 29) {
            setSelectError('supplier');
        } else {
            setSelectError('');
            insertIntoNW();
        }
        e.preventDefault();
    };

    const insertIntoNW = async () => {
        let prodObj = {
            ProductName: productName,
            SupplierId: parseInt(supplierId),
            CategoryId: parseInt(categoryId),
            QuantityPerUnit: quantity,
            UnitPrice: parseFloat(unitPrice),
            UnitsInStock: parseInt(unitsInStock),
            UnitsOnOrder: parseInt(unitsOnOrder),
            ReorderLevel: parseInt(reorderLevel),
            Discontinued: discontinued,
            ImageLink: imageLink
        }
        let url = BASE_URL + 'product';
        let token = localStorage.getItem('token');
        let result = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(prodObj)
        });
        if (result.status === 200) {
            unmountMe();
        } else {
            console.log(result.status);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Anna tuotteen nimi</label>
            <input type='text' onChange={e => setProductName(e.target.value)} placeholder='Tuotteen nimi' required />
            <label>Valitse kategoria{selectError === 'category' && <span className='text-red'> HUOM! vaaditaan</span>}</label>
            <select onChange={e => setCategoryId(e.target.value)} style={selectStyle}>
                <option value='0'>Kategoriat</option>
                <optgroup label='Kategoriat'>
                    <option value='1'>Juomat</option>
                    <option value='2'>Mausteet</option>
                    <option value='3'>Makeiset</option>
                    <option value='4'>Maitotuotteet</option>
                    <option value='5'>Jyvät/Viljat</option>
                    <option value='6'>Liha/Siipikarja</option>
                    <option value='7'>Vihannekset</option>
                    <option value='8'>Kala/Äyriäiset</option>
                </optgroup>
            </select>
            <label>Valitse toimittaja{selectError === 'supplier' && <span className='text-red'> HUOM! vaaditaan</span>}</label>
            <select onChange={e => setSupplierId(e.target.value)} style={selectStyle}>
                <option value='0'>Toimittajat</option>
                <optgroup label='Toimittajat'>
                    <option value='1'>Exotic Liquids</option>
                    <option value='2'>New Orleans Cajun Delights</option>
                    <option value='3'>Grandma Kelly's Homestead</option>
                    <option value='4'>Tokyo Traders</option>
                    <option value='5'>Cooperativa de Quesos 'Las Cabras'</option>
                    <option value='6'>Mayumi's</option>
                    <option value='7'>Pavlova, Ltd.</option>
                    <option value='8'>Specialty Biscuits, Ltd.</option>
                    <option value='9'>PB Knäckebröd AB</option>
                    <option value='10'>Refrescos Americanas LTDA</option>
                    <option value='11'>Heli Süßwaren GmbH &amp; Co. KG</option>
                    <option value='12'>Plutzer Lebensmittelgroßmärkte AG</option>
                    <option value='13'>Nord-Ost-Fisch Handelsgesellschaft mbH</option>
                    <option value='14'>Formaggi Fortini s.r.l.</option>
                    <option value='15'>Norske Meierier</option>
                    <option value='16'>Bigfoot Breweries</option>
                    <option value='17'>Svensk Sjöföda AB</option>
                    <option value='18'>Aux joyeux ecclésiastiques</option>
                    <option value='19'>New England Seafood Cannery</option>
                    <option value='20'>Leka Trading</option>
                    <option value='21'>Lyngbysild</option>
                    <option value='22'>Zaanse Snoepfabriek</option>
                    <option value='23'>Karkki Oy</option>
                    <option value='24'>G'day, Mate</option>
                    <option value='25'>Ma Maison</option>
                    <option value='26'>Pasta Buttini s.r.l.</option>
                    <option value='27'>Escargots Nouveaux</option>
                    <option value='28'>Gai pâturage</option>
                    <option value='29'>Forêts d'érables</option>
                </optgroup>
            </select>
            <label>Anna määrä per tuote</label>
            <input type='text' onChange={e => setQuantity(e.target.value)} placeholder='esim. 12 pack' required/>
            <label>Tuotteen hinta</label>
            <input type='number' onChange={e => setUnitPrice(parseFloat(e.target.value).toFixed(4))} placeholder='0' step='0.01' required min='0'/>
            <label>Kappaletta varastossa</label>
            <input type='number' onChange={e => setUnitsInStock(e.target.value)} placeholder='0' required min='0'/>
            <label>Kappaletta tilattu</label>
            <input type='number' onChange={e => setUnitsOnOrder(e.target.value)} placeholder='0' required min='0'/>
            <label>Uudelleen tilauksen taso</label>
            <input type='number' onChange={e => setReorderLevel(e.target.value)} placeholder='0' required min='0'/>
            <label>Tuote lopetettu</label><br />
            <input type='checkbox' onChange={e => setDiscontinued(e.target.value)}/><br />
            <label>Tuotekuva</label>
            <input type='url' onChange={e => setImageLink(e.target.value)} placeholder='www.tuotekuva.fi'/>
            <input className='myButton' type='submit' value='Lisää tuote'/>
        </form>
    );
};

export default NWProductAdd;