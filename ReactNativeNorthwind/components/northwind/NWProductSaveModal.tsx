import React, { useEffect, useState } from 'react';
import { Modal, Text, View, Platform, ScrollView, Pressable, TextInput, Switch, ActivityIndicator } from 'react-native';
import { globalColors, globalStyles } from "../../styles/global";
import { Category, INWProductsResponse, INWSuppliersResponse } from './NWInterfaces';
import { Octicons } from "@expo/vector-icons";
import { BASE_URL } from "../../connections";
import * as SecureStore from 'expo-secure-store';
import NWCategoryPicker from './NWCategoryPicker';
import NWSupplierPicker from './NWSupplierPicker';

// const expression = /^(https?:\/\/)(?:www\.|(?!www))?[a-zA-Z0-9]{2,256}((\.[a-z]{2,4})(\/(jpg|png|gif|jpeg|bmp|tiff|svg))?)$/gi;
const expression = /(https?:\/\/(?:www\.|(?!www))?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}\.(jpg|png|gif|jpeg|bmp|tiff|svg)|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}\.(jpg|png|gif|jpeg|bmp|tiff|svg)|https?:\/\/(?:www\.|(?!www))?[a-zA-Z0-9]+\.[^\s]{2,}\.(jpg|png|gif|jpeg|bmp|tiff|svg)|www\.[a-zA-Z0-9]+\.[^\s]{2,}\.(jpg|png|gif|jpeg|bmp|tiff|svg))/gi;
const regexp = new RegExp(expression); 
interface IProductValidation {
    name: boolean;
    quantity: boolean;
    price: boolean;
    inStock: boolean;
    onOrder: boolean;
    reorder: boolean;
    link: boolean;
}

export default function NWProductSaveModal(
    props: {
        selectedProductId: number,
        setModalOpen: Function,
        refreshAfterEdit: Function,
        method: string,
        categories: Category[],
        suppliers: INWSuppliersResponse[],
        logout: Function
    }) {
    const [product, setProduct] = useState<Partial<INWProductsResponse>>({});
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState('');
    const [validation, setValidation] = useState<Partial<IProductValidation>>({});
    const [changed, setChanged] = useState('');
    
    const changeCategoryId = (id: string) => setProduct({ ...product, categoryId: +id });
    const changeSupplierId = (id: string) => setProduct({ ...product, supplierId: +id });

    const saveProductOnPress = async () => {
        if (!productValid()) {
            let alertMsg = `Tuotetta ${product.productName ? `"${product.productName}" ` : ''}ei voitu tallentaa tietojen puutteellisuuden vuoksi!`;
            if (!validation.name) {
                alertMsg += '\n— Tuotenimi puuttuu.';
            }
            if (!validation.quantity) {
                alertMsg += '\n— Pakkauskoko puuttuu.';
            }
            if (!validation.price) {
                alertMsg += '\n— Hinta puuttuu.';
            }
            if (!validation.inStock) {
                alertMsg += '\n— Määrä varastossa puuttuu.';
            }
            if (!validation.reorder) {
                alertMsg += '\n— Hälytysraja puuttuu.';
            }
            if (!validation.onOrder) {
                alertMsg += '\n— Määrä tilauksessa puuttuu.';
            }
            if (validation.link === false) {
                alertMsg += '\n— Linkki on virheellinen.';
            }
            alert(alertMsg);
        } else {
            await saveProduct();
            if (Platform.OS === 'web') {
                console.log(`Tuote ${product.productName} ${(props.method === 'PUT' ? 'muokattiin' : 'lisättiin')} onnistuneesti!`);
            }
            props.refreshAfterEdit();
            props.setModalOpen(false);
        }
    };

    useEffect(() => {
        switch (changed) {
            case 'name':
                setValidation({ ...validation, name: validString(product.productName) });
                break;
            case 'quantity':
                setValidation({ ...validation, quantity: validString(product.quantityPerUnit) });
                break;
            case 'price':
                setValidation({ ...validation, price: validString(price) });
                break;
            case 'inStock':
                setValidation({ ...validation, inStock: validInteger(product.unitsInStock) });
                break;
            case 'onOrder':
                setValidation({ ...validation, onOrder: validInteger(product.unitsOnOrder) });
                break;
            case 'reorder':
                setValidation({ ...validation, reorder: validInteger(product.reorderLevel) });
                break;
            case 'link':
                setValidation({ ...validation, link: product.imageLink !== undefined && regexp.test(product.imageLink) || product.imageLink === '' });
                break;
            default:
                break;
        }
    }, [changed, product, price]);

    useEffect(() => {
        if (props.selectedProductId > 0) {
            setLoading(true);
            (async () => {
                try {
                    const token = await SecureStore.getItemAsync('token');
                    let result = await fetch(`${BASE_URL}/product/${props.selectedProductId}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'content-type': 'application/json; charset=utf-8',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    if (result.status === 200) {
                        const json: INWProductsResponse = await result.json();
                        setProduct(json);
                        setPrice(json.unitPrice.toFixed(2));
                    } else if (result.status === 401) {
                        alert('Sessio vanhentunut. Ole hyvä, kirjaudu sisään uudelleen.');
                        props.logout();
                    } else {
                        console.error(`Something went wrong: ${await result.json()}`);
                    }
                } catch (error) {
                    alert(error);
                    console.error(error);
                }
                setLoading(false);
            })();
        } else {
            setProduct({ ...product, categoryId: 1, supplierId: 1 });
        }
    }, [props.selectedProductId]);

    const saveProduct = async () => {
        product.productName = product.productName?.trim();
        product.quantityPerUnit = product.quantityPerUnit?.trim();
        product.unitPrice = +price.replace(',', '.');
        try {
            const token = await SecureStore.getItemAsync('token');
            let url: string = `${BASE_URL}/product/`;
            if (props.method === 'PUT') {
                url+= product.productId?.toString();
            }
            let result = await fetch(url, {
                method: props.method,
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(product)
            });
            if (result.status === 200) {
                alert(`Tuote ${product.productName} ${(props.method === 'PUT' ? 'muokattiin' : 'lisättiin')} onnistuneesti!`);
            } else if (result.status === 401) {
                alert('Sessio vanhentunut. Ole hyvä, kirjaudu sisään uudelleen.');
                props.logout();
            } else {
                console.error(`Something went wrong: ${await result.json()}`);
            }
        } catch (error) {
            alert(error);
            console.error(error);
        }
    };

    const validString = (str: string|undefined) => {
        if (str === undefined) {
            return false;
        } else if (str.trim() === '') {
            return false;
        }
        return true;
    };
    const validInteger = (num: number|undefined) => num !== undefined && num >= 0 && num <= 32767;
    const priceHasDecimal = () => {
        let count = 0;
        for (let index = 0; index < price.length; index++) {
            const element = price[index];
            if (element === '.' || element === ',') {
                count++;
            }
        }
        return count >= 1;
    };
    const isNumeric = (num: string) => !isNaN(+num);
    const priceValidation = (value: string) => {
        value = value.trim();
        let vLength: number = value.length;
        if (vLength === 0) {
            setPrice(value);
            return;
        } else if (vLength === 1) {
            if (isNumeric(value)) {
                setPrice(value);
            }
            return;
        } else if (vLength < price.length) {
            setPrice(value);
            return;
        }
        let lastChar = value.slice(-1);
        if (isNumeric(lastChar)) {
            setPrice(value);
        } else if ((lastChar === '.' || lastChar === ',') && !priceHasDecimal()) {
            setPrice(value);
        }
    };
    const productValid = () => {
        if (props.method === 'PUT') {
            return (
                validation.name !== false &&
                validation.quantity !== false &&
                validation.price !== false &&
                validation.inStock !== false &&
                validation.onOrder !== false &&
                validation.reorder !== false &&
                validation.link !== false
            );
        }
        return (
            validation.name &&
            validation.quantity &&
            validation.price &&
            validation.inStock &&
            validation.onOrder &&
            validation.reorder &&
            validation.link !== false
        );
    };

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={true}
        >
            <View style={globalStyles.editContainer}>
                <View style={{ marginBottom: 5 }}>
                    <View style={globalStyles.editButtons}>
                        <Pressable onPress={saveProductOnPress} style={{ ...globalStyles.editButton, borderColor: globalColors.lightGreen }}>
                            <Octicons name='check' size={24} color={globalColors.lightGreen} />
                        </Pressable>
                        <Pressable onPress={() => props.setModalOpen(false)} style={{ ...globalStyles.editButton, borderColor: 'red' }}>
                            <Octicons name='x' size={24} color='red' />
                        </Pressable>
                    </View>
                    {loading ? 
                        <ActivityIndicator style={{ marginVertical: 5 }} size='large' color='#eee' animating={loading} /> : 
                        <Text style={globalStyles.modalTitle}>{props.method === 'PUT' ? `Tuotteen "${product.productName}" muokkaus` : 'Lisää uusi tuote'}</Text>}
                </View>
                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <View key={product.productId}>
                            {props.method === 'PUT' && <>
                            <Text style={globalStyles.inputTitle}>ID:</Text>
                            <TextInput style={globalStyles.inputEditNoBorder}
                                underlineColorAndroid='transparent'
                                defaultValue={product.productId?.toString()}
                                autoCapitalize='none'
                                editable={false}
                            /></>}
                            <Text style={globalStyles.inputTitle}>Tuotenimi:</Text>
                            <TextInput style={globalStyles.inputEdit}
                                underlineColorAndroid='transparent'
                                onChangeText={val => {
                                    setProduct({ ...product, productName: val });
                                    setChanged('name');
                                }}
                                maxLength={40}
                                value={product.productName}
                                autoCapitalize='none'
                                selectTextOnFocus={true}
                                placeholder='Tuotteen nimi'
                            />
                            {validation.name === false && <Text style={globalStyles.errorText}>Tuotenimi vaaditaan.</Text>}
                            <Text style={globalStyles.inputTitle}>Kategoria:</Text>
                            <NWCategoryPicker selectedCatId={product.categoryId ? product.categoryId.toString() : '1'} setSelectedCatId={changeCategoryId} categories={props.categories} selectAll={false} />
                            <Text style={globalStyles.inputTitle}>Toimittaja:</Text>
                            <NWSupplierPicker selectedSuppId={product.supplierId ? product.supplierId.toString() : '1'} setSelectedSuppId={changeSupplierId} suppliers={props.suppliers} />
                            <Text style={globalStyles.inputTitle}>Pakkauskoko:</Text>
                            <TextInput style={globalStyles.inputEdit}
                                underlineColorAndroid='transparent'
                                onChangeText={val => {
                                    setProduct({ ...product, quantityPerUnit: val });
                                    setChanged('quantity');
                                }}
                                maxLength={20}
                                value={product.quantityPerUnit}
                                autoCapitalize='none'
                                selectTextOnFocus={true}
                                placeholder='esim. 12-pack'
                            />
                            {validation.quantity === false && <Text style={globalStyles.errorText}>Pakkauskoko vaaditaan.</Text>}
                            <Text style={globalStyles.inputTitle}>Hinta:</Text>
                            <TextInput style={globalStyles.inputEdit}
                                underlineColorAndroid='transparent'
                                onChangeText={val => {
                                    priceValidation(val);
                                    setChanged('price');
                                }}
                                value={price}
                                keyboardType='numeric'
                                autoCapitalize='none'
                                selectTextOnFocus={true}
                                placeholder='Tuotteen hinta (##.##)'
                            />
                            {validation.price === false && <Text style={globalStyles.errorText}>Hinta vaaditaan.</Text>}
                            <Text style={globalStyles.inputTitle}>Varastossa:</Text>
                            <TextInput style={globalStyles.inputEdit}
                                underlineColorAndroid='transparent'
                                onChangeText={val => {
                                    if (val === '') {
                                        setProduct({ ...product, unitsInStock: -1 });
                                    } else if (isNumeric(val)) {
                                        setProduct({ ...product, unitsInStock: +val });
                                    }
                                    setChanged('inStock');
                                }}
                                value={(product.unitsInStock === undefined || product.unitsInStock < 0) ? '' : product.unitsInStock.toString()}
                                maxLength={5}
                                keyboardType='numeric'
                                autoCapitalize='none'
                                selectTextOnFocus={true}
                                placeholder='Klp varastossa'
                            />
                            {validation.inStock === false && <Text style={globalStyles.errorText}>Määrä varastossa vaaditaan.</Text>}
                            <Text style={globalStyles.inputTitle}>Hälytysraja:</Text>
                            <TextInput style={globalStyles.inputEdit}
                                underlineColorAndroid='transparent'
                                onChangeText={val => {
                                    if (val === '') {
                                        setProduct({ ...product, reorderLevel: -1 });
                                    } else if (isNumeric(val)) {
                                        setProduct({ ...product, reorderLevel: +val });
                                    }
                                    setChanged('reorder');
                                }}
                                value={(product.reorderLevel === undefined || product.reorderLevel < 0) ? '' : product.reorderLevel.toString()}
                                maxLength={5}
                                keyboardType='numeric'
                                autoCapitalize='none'
                                selectTextOnFocus={true}
                                placeholder='Min kpl oltava varastossa'
                            />
                            {validation.reorder === false && <Text style={globalStyles.errorText}>Hälytysraja vaaditaan.</Text>}
                            <Text style={globalStyles.inputTitle}>Tilauksessa:</Text>
                            <TextInput style={globalStyles.inputEdit}
                                underlineColorAndroid='transparent'
                                onChangeText={val => {
                                    if (val === '') {
                                        setProduct({ ...product, unitsOnOrder: -1 });
                                    } else if (isNumeric(val)) {
                                        setProduct({ ...product, unitsOnOrder: +val });
                                    }
                                    setChanged('onOrder');
                                }}
                                value={(product.unitsOnOrder === undefined || product.unitsOnOrder < 0) ? '' : product.unitsOnOrder.toString()}
                                maxLength={5}
                                keyboardType='numeric'
                                autoCapitalize='none'
                                selectTextOnFocus={true}
                                placeholder='Klp tilauksessa'
                            />
                            {validation.onOrder === false && <Text style={globalStyles.errorText}>Määrä tilauksessa vaaditaan.</Text>}
                            <Text style={globalStyles.inputTitle}>Tuote poistunut:</Text>
                            <View style={{ flexDirection: 'row', marginLeft: 14, marginTop: 4 }}>
                                <Text style={{ marginHorizontal: 4, color: globalColors.yellowish, alignSelf: 'center' }}>Ei</Text>
                                <Switch
                                    value={product.discontinued}
                                    onValueChange={val => setProduct({...product, discontinued: val})}
                                />
                                <Text style={{ marginHorizontal: 4, color: globalColors.yellowish, alignSelf: 'center' }}>Kyllä</Text>
                            </View>
                            <Text style={globalStyles.inputTitle}>Kuvan linkki:</Text>
                            <TextInput style={globalStyles.inputEdit}
                                underlineColorAndroid='transparent'
                                onChangeText={val => setProduct({ ...product, imageLink: val })}
                                onBlur={() => setChanged('link')}
                                value={product.imageLink?.toString() || ''}
                                maxLength={200}
                                autoCapitalize='none'
                                selectTextOnFocus={true}
                                placeholder='www.esimerkki.fi/kuva.jpg'
                            />
                            {validation.link === false ? <Text style={globalStyles.errorText}>Tarkista linkin muoto.</Text> : <Text style={{ height : 20 }}></Text>}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
