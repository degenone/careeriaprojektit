import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { FontAwesome5, Octicons, Entypo } from "@expo/vector-icons";
import { globalColors, globalStyles } from "../../styles/global";
import { BASE_URL } from "../../connections";
import * as SecureStore from 'expo-secure-store';
import { Category, INWProductsResponse, INWSuppliersResponse } from './NWInterfaces';
import NWProductDetailsModal from './NWProductDetailsModal';
import NWProductImageModal from './NWProductImageModal';
import NWProductSaveModal from './NWProductSaveModal';
import NWCategoryPicker from './NWCategoryPicker';

const methods = {
    put: 'PUT',
    post: 'POST',
    get: 'GET',
    del: 'DELETE',
};

export default function NWProudctsList(props: { logout: Function }) {
    const [products, setProducts] = useState<INWProductsResponse[]>([]);
    const [productCount, setProductCount] = useState(0);
    // const [product, setProduct] = useState<Partial<INWProductsResponse>>({}); // https://stackoverflow.com/q/60109782 
    const [selectedProductId, setSelectedProductId] = useState(0);
    const [detailsModal, setDetailsModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [saveModal, setSaveModal] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [refreshProducts, setRefreshProducts] = useState(false);
    const [refreshIndicator, setRefreshIndicator] = useState(false);
    const [catId, setCatId] = useState('0');
    const [method, setMethod] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<INWSuppliersResponse[]>([]);

    const getProducts = async () => {
        let url = BASE_URL + 'product/';
        if (catId !== '0') {
            url += `c/${catId}`;
        }
        try {
            const token = await SecureStore.getItemAsync('token');
            const result = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (result.status === 200) {
                const json: INWProductsResponse[] = await result.json();
                setProducts(json);
                setProductCount(Object.keys(json).length);
            } else if (result.status === 401) {
                alert('Sessio vanhentunut. Ole hyvä, kirjaudu sisään uudelleen.');
                props.logout();
            } else {
                console.error(`Something went wrong: ${await result.json()}`);
            }
        } catch (error) {
            console.error(error);
        }
        setRefreshIndicator(false);
    };

    const getCategories = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            let result = await fetch(BASE_URL + 'product/categories', { headers: { 'Authorization': `Bearer ${token}` } });
            if (result.status === 200) {
                const json: Category[] = await result.json();
                setCategories(json);
            } else if (result.status === 401) {
                alert('Sessio vanhentunut. Ole hyvä, kirjaudu sisään uudelleen.');
                props.logout();
            } else {
                console.log(result.statusText);
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    const getSuppliers = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            let result = await fetch(BASE_URL + 'product/shippers', { headers: { 'Authorization': `Bearer ${token}` } });
            if (result.status === 200) {
                const json: INWSuppliersResponse[] = await result.json();
                setSuppliers(json);
            } else if (result.status === 401) {
                alert('Sessio vanhentunut. Ole hyvä, kirjaudu sisään uudelleen.');
                props.logout();
            } else {
                console.log(result.status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const refreshProductData = () => {
        setRefreshProducts(!refreshProducts);
    };

    const editProduct = (id: number) => {
        setSelectedProductId(id);
        setMethod(methods.put);
        setSaveModal(true);
    };

    const addProduct = () => {
        setSelectedProductId(0);
        setMethod(methods.post);
        setSaveModal(true);
    }

    const showProduct = (id: number) => {
        setSelectedProductId(id);
        setMethod(methods.get);
        setDetailsModal(true);
    };

    const deleteProduct = (id: number) => {
        setSelectedProductId(id);
        setMethod(methods.del);
        setDetailsModal(true);
    };

    const filterByCategory = (id: string) => {
        setCatId(id);
        setRefreshProducts(!refreshProducts);
    }

    useEffect(() => {
        setRefreshIndicator(true);
        getProducts();
    }, [refreshProducts]);

    useEffect(() => {
        getCategories();
        getSuppliers();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={globalStyles.topSection}>
                <Pressable style={globalStyles.iconBtn} onPress={() => setLogoutModal(true)}>
                    <FontAwesome5 name='boxes' size={24} color='#eee' />
                </Pressable>
                <Pressable style={globalStyles.iconBtn} onPress={addProduct}>
                    <Entypo name="add-to-list" size={24} color="#eee" />
                </Pressable>
                <Text style={{ fontSize: 18, color: '#eee', alignSelf: 'center' }}>Tuotteita yhteensä: { productCount }</Text>
                <ActivityIndicator size='small' color='#eee' animating={refreshIndicator} />
                <Pressable style={globalStyles.iconBtn} onPress={refreshProductData}>
                    <Octicons name='sync' size={24} color='#eee' />
                </Pressable>
            </View>
            <View style={globalStyles.pickerSection}>
                <NWCategoryPicker selectedCatId={catId} setSelectedCatId={filterByCategory} categories={categories} selectAll={true} />
            </View>
            <ScrollView>
                {products.map((item: INWProductsResponse, index: number) => (
                    <Pressable
                        onPress={() => showProduct(item.productId) }
                        onLongPress={() => {
                            setImgSrc(item.imageLink ? item.imageLink : 'https://www.tibs.org.tw/images/default.jpg');
                            setImageModal(true);
                        }}
                        style={({ pressed }) => ({ backgroundColor: pressed ? globalColors.muddyYellow : globalColors.lightGreen })}
                        key={index}
                    >
                        <View style={globalStyles.productsContainer}>
                            <Image
                                source={{ uri: item.imageLink ? item.imageLink : 'https://www.tibs.org.tw/images/default.jpg' }}
                                style={{ ...globalStyles.centerSection, ...globalStyles.listImage }}
                            />
                            <View style={{ justifyContent: 'space-evenly' }}>
                                <Text style={{ fontSize: 15, color: globalColors.yellowish }}>{ item.productName }</Text>
                                <Text style={{ color: globalColors.darkGreen, marginBottom: 10 }}>
                                    {`\u00e1 ${ item.unitPrice ? item.unitPrice.toFixed(2) : 'Price is missing' } \u20ac`}
                                </Text>
                            </View>
                            <View style={globalStyles.listItemEdit}>
                                <Pressable style={globalStyles.iconBtn} onPress={() => editProduct(item.productId)}>
                                    <Octicons name='pencil' size={24} color='#eee' />
                                </Pressable>
                                <Pressable style={globalStyles.iconBtn} onPress={() => deleteProduct(item.productId)}>
                                    <Octicons name='trashcan' size={24} color='#eee' />
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
            {detailsModal &&
            <NWProductDetailsModal
                selectedProductId={selectedProductId}
                setModalOpen={setDetailsModal}
                refreshAfterDelete={refreshProductData}
                method={method}
                categories={categories}
                suppliers={suppliers}
                logout={props.logout}
            />}
            {imageModal &&
            <NWProductImageModal
                source={imgSrc}
                setModalOpen={setImageModal}
            />}
            {saveModal &&
            <NWProductSaveModal
                selectedProductId={selectedProductId}
                setModalOpen={setSaveModal}
                refreshAfterEdit={refreshProductData}
                method={method}
                categories={categories}
                suppliers={suppliers}
                logout={props.logout}
            />}
            <Modal
                visible={logoutModal}
                transparent={true}
            >
                <Pressable
                    onPress={() => setLogoutModal(false)}
                    style={globalStyles.modalImageClose}
                />
                <View style={globalStyles.logoutModal}>
                    <Text style={{ ...globalStyles.loginHeader, marginTop: 10 }}>Kirjaudu ulos</Text>
                    <View style={globalStyles.logoutModalContent}>
                        <Entypo name='log-out' size={36} color='#000' onPress={() => props.logout()} />
                        <Octicons name='x' size={36} color='#000' onPress={() => setLogoutModal(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}