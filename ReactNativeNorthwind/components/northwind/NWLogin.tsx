import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { BASE_URL } from "../../connections";
import * as SecureStore from 'expo-secure-store';
import { Entypo } from "@expo/vector-icons";
import globalStyles from '../../styles/global';

export default function NWLogin(props: { login: Function }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const LoginToNW = async () => {
        if (!username || !password) {
            alert('Anna käyttäjänimi ja salasana.');
            return;
        }
        setLoading(true);
        const pwResult = await fetch(`http://md5.jsontest.com/?text=${password}`);
        const pwJson = await pwResult.json();
        try {
            const result = await fetch(BASE_URL + 'reactlogin/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ Username: username, Password: pwJson.md5 })
            });
            setLoading(false);
            if (result.status === 200) {
                let token = (await result.json()).token;
                await SecureStore.setItemAsync('token', token);
                await SecureStore.setItemAsync('token-timeout', Date.now().toString());
                props.login();
            } else if (result.status === 404) {
                alert('Virheellinen käyttäjänimi ja/tai salasana.');
            } else {
                alert(`Kirjautuminen epäonnistui! Status: ${result.status}\nYritä uudelleen myöhemmin.`);
            }
        } catch (error) {
            setLoading(false);
            alert('Jotain meni pieleen :(');
        } 
    };

    return (
        <View style={globalStyles.loginContainer}>
            {loading ?
            <ActivityIndicator style={{ marginVertical: 5 }} size='large' color='#000' animating={loading} /> : <>
            <Text style={globalStyles.loginHeader}>Kirjautuminen</Text>
            <View style={globalStyles.separatorLine} />
            <Text style={globalStyles.loginLabel}>Anna käyttäjänimesi:</Text>
            <TextInput
                style={globalStyles.loginInput}
                placeholder='Käyttäjänimi'
                value={username}
                onChangeText={text => setUsername(text)}
            />
            <Text style={globalStyles.loginLabel}>Anna salasanasi:</Text>
            <TextInput
                style={globalStyles.loginInput}
                placeholder='Salasana'
                value={password}
                secureTextEntry={true} onChangeText={text => setPassword(text)}
            />
            <Pressable style={globalStyles.loginButton} onPress={LoginToNW} >
                <Entypo name='login' size={32} />
            </Pressable>
            </>}
        </View>
    );
}