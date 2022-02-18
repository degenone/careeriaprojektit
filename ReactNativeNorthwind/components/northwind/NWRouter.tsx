import React, { useState, useEffect } from 'react';
import NWLogin from './NWLogin';
import * as SecureStore from 'expo-secure-store';
import NWProudctsList from './NWProductsList';

export default function NWRouter() {
    const [loggedIn, setLoggedIn] = useState(false);

    const logout = async () => {
        await SecureStore.deleteItemAsync('token-timeout');
        await SecureStore.deleteItemAsync('token');
        setLoggedIn(false);
    };
    const login = () => setLoggedIn(true);

    const getToken = async () => {
        let tokenTO = await SecureStore.getItemAsync('token-timeout');
        let token = await SecureStore.getItemAsync('token');
        if (!token || !tokenTO || (Date.now() - +tokenTO) > 86400000) {
            setLoggedIn(false);
            return;
        }
        setLoggedIn(true);
    };

    useEffect(() => { getToken() }, []);

    if (loggedIn) {
        return <NWProudctsList logout={logout} />;
    } else {
        return <NWLogin login={login} />
    }
}
