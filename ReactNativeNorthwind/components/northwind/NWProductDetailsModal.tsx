import React, { useEffect, useState } from 'react';
import { Modal, Text, View, Image, TouchableHighlight, ActivityIndicator, Pressable } from 'react-native';
import { globalColors, globalStyles } from "../../styles/global";
import { Category, INWProductsResponse, INWSuppliersResponse } from './NWInterfaces';
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "../../connections";
import { Octicons } from "@expo/vector-icons";

export default function NWProductDetailsModal(
    props: { 
        selectedProductId: number,
        setModalOpen: Function,
        refreshAfterDelete: Function,
        method: string,
        categories: Category[],
        suppliers: INWSuppliersResponse[],
        logout: Function
    }) {
    const [product, setProduct] = useState<Partial<INWProductsResponse>>({});
    const [loading, setLoading] = useState(false);

    const deleteProduct = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            let result = await fetch(`${BASE_URL}/product/${props.selectedProductId}`, {
                method: props.method,
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (result.status === 200) {
                props.refreshAfterDelete()
                props.setModalOpen(false);
                alert(`Tuote id: ${props.selectedProductId} poistettu.`);
            } else if (result.status === 401) {
                alert('Sessio vanhentunut. Ole hyvä, kirjaudu sisään uudelleen.');
                props.logout();
            } else {
                alert(`Jotain meni pieleen tuotteen "${product.productName}" poistossa.`);
                console.error(`Something went wrong: ${await result.json()}`);
            }
        } catch (error) {
            alert(error);
            console.error(error);
        }
    };

    useEffect(() => {
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
    }, [])

    return(
        <Modal
            animationType='slide'
            transparent={true}
            visible={true}
        >
            <View style={globalStyles.centeredView}>
                <View style={globalStyles.modalView}>
                    <ActivityIndicator size='large' color='#000' animating={loading} />
                    <Text style={globalStyles.modalTitle}>{props.method === 'DELETE' ? 'Poistettavan tuotteen tiedot' : 'Tuotteen tiedot'}</Text>
                    <View style={globalStyles.modalSection}>
                        <Text style={globalStyles.modalTextTitle}>product id:</Text>
                        <Text style={globalStyles.modalText}>{ product.productId }</Text>
                    </View>
                    <View style={globalStyles.modalSection}>
                        <Text style={globalStyles.modalTextTitle}>product name:</Text>
                        <Text style={globalStyles.modalText}>{ product.productName }</Text>
                    </View>
                    <View style={globalStyles.modalSection}>
                        <Text style={globalStyles.modalTextTitle}>supplier:</Text>
                        <Text style={globalStyles.modalText}>{ props.suppliers.find(s => s.supplierId === product.supplierId)?.companyName }</Text>
                    </View>
                    <View style={globalStyles.modalSection}>
                        <Text style={globalStyles.modalTextTitle}>categoty:</Text>
                        <Text style={globalStyles.modalText}>{ props.categories.find(c => c.categoryId === product.categoryId)?.categoryName }</Text>
                    </View>
                    <View style={globalStyles.modalSection}>
                        <Text style={globalStyles.modalTextTitle}>quantity per unit:</Text>
                        <Text style={globalStyles.modalText}>{ product.quantityPerUnit }</Text>
                    </View>
                    <View style={globalStyles.modalSection}>
                        <Text style={globalStyles.modalTextTitle}>unit price:</Text>
                        <Text style={globalStyles.modalText}>
                            { product.unitPrice ? `\u00e1 ${product.unitPrice.toFixed(2)} \u20ac` : 'Price is missing' }
                        </Text>
                    </View>
                    <View style={globalStyles.modalSection}>
                        <Text style={globalStyles.modalTextTitle}>units in stock:</Text>
                        <Text style={globalStyles.modalText}>{ product.unitsInStock }</Text>
                    </View>
                    <View style={globalStyles.modalSection}>
                        <Text style={globalStyles.modalTextTitle}>units on order:</Text>
                        <Text style={globalStyles.modalText}>{ product.unitsOnOrder }</Text>
                    </View>
                    <View style={globalStyles.modalSection}>
                        <Text style={globalStyles.modalTextTitle}>reorder level:</Text>
                        <Text style={globalStyles.modalText}>{ product.reorderLevel }</Text>
                    </View>
                    <View style={globalStyles.modalSection}>
                        <Text style={globalStyles.modalTextTitle}>discontinued:</Text>
                        <Text style={globalStyles.modalText}>{ product.discontinued ? 'true' : 'false' }</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={globalStyles.modalTextTitle}>image:</Text>
                        <Image
                            source={{ uri: product.imageLink ? product.imageLink : 'https://www.tibs.org.tw/images/default.jpg' }}
                            style={{ ...globalStyles.centerSection, height: 60, width: 60, backgroundColor: '#eee', margin: 6, alignSelf: 'center' }}
                        />
                    </View>
                    {props.method === 'GET' ?
                        <TouchableHighlight
                        style={{ ...globalStyles.openButton, backgroundColor: globalColors.lightGreen }}
                        onPress={() => props.setModalOpen(false)}
                        >
                            <Text style={globalStyles.textStyle}>Sulje</Text>
                        </TouchableHighlight> :
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                            <Pressable onPress={deleteProduct} style={{ ...globalStyles.editButton, borderColor: 'red' }}>
                                <Octicons name='trashcan' size={24} color='red' />
                            </Pressable>
                            <TouchableHighlight
                                style={{ ...globalStyles.openButton, backgroundColor: globalColors.lightGreen, width: '30%' }}
                                onPress={() => props.setModalOpen(false)}
                                >
                                <Text style={globalStyles.textStyle}>Sulje</Text>
                            </TouchableHighlight>
                        </View>
                    }
                </View>
            </View>
        </Modal>
    );
}