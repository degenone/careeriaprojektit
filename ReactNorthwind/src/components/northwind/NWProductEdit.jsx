import React from 'react';
import { useState } from 'react';
import { BASE_URL } from './NWConnection';

const NWProductEdit = ({ tuoteObj, unmountMe }) => {
    const [product, setProduct] = useState(tuoteObj);
    const selectStyle = { width: '100%' };

    const handleSubmit = e => {
        updateProduct();
        e.preventDefault();
    };

    const updateProduct = async () => {
        let prodObj = {
            ProductId: product.productId,
            ProductName: product.productName,
            SupplierId: parseInt(product.supplierId),
            CategoryId: parseInt(product.categoryId),
            QuantityPerUnit: product.quantityPerUnit,
            UnitPrice: parseFloat(product.unitPrice),
            UnitsInStock: parseInt(product.unitsInStock),
            UnitsOnOrder: parseInt(product.unitsOnOrder),
            ReorderLevel: parseInt(product.reorderLevel),
            Discontinued: product.discontinued,
            ImageLink: product.imageLink
        }
        let url = `${BASE_URL}product/${product.productId}`;
        let token = localStorage.getItem('token');
        let result = await fetch(url, {
            method: 'PUT',
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
            <label>Tuotteen nimi</label>
            <input type='text' onChange={e => setProduct({...product, productName: e.target.value})} value={product.productName} placeholder='Tuotteen nimi' required />
            <label>Valitse kategoria</label>
            <select onChange={e => setProduct({...product, categoryId: e.target.value})} style={selectStyle} value={product.categoryId}>
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
            <label>Valitse toimittaja</label>
            <select onChange={e => setProduct({...product, supplierId: e.target.value})} style={selectStyle} value={product.supplierId}>
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
            <label>Määrä per tuote</label>
            <input type='text' onChange={e => setProduct({...product, quantityPerUnit: e.target.value})} value={product.quantityPerUnit} placeholder='esim. 12 pack' required/>
            <label>Tuotteen hinta</label>
            <input type='number' onChange={e => setProduct({...product, unitPrice: parseFloat(e.target.value).toFixed(4)})} value={product.unitPrice} placeholder='0' step='0.01' required min='0'/>
            <label>Kappaletta varastossa</label>
            <input type='number' onChange={e => setProduct({...product, unitsInStock: e.target.value})} value={product.unitsInStock} placeholder='0' required min='0'/>
            <label>Kappaletta tilattu</label>
            <input type='number' onChange={e => setProduct({...product, unitsOnOrder: e.target.value})} value={product.unitsOnOrder} placeholder='0' required min='0'/>
            <label>Uudelleen tilauksen taso</label>
            <input type='number' onChange={e => setProduct({...product, reorderLevel: e.target.value})} value={product.reorderLevel} placeholder='0' required min='0'/>
            <label>Tuote lopetettu</label><br />
            <input type='checkbox' onChange={e => setProduct({...product, discontinued: e.target.value})} checked={product.discontinued}/><br />
            <label>Tuotekuva</label>
            <input type='url' onChange={e => setProduct({...product, imageLink: e.target.value})} value={product.imageLink ? product.imageLink : ''} placeholder='www.tuotekuva.fi'/>
            <input className='myButton' type='submit' value='Päivitä tuotteen teidot'/>
        </form>
    );
};

export default NWProductEdit;