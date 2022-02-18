import React, { useState } from 'react';
import { Text, View } from 'react-native';
import InputTest from './InputTest';
import { globalStyles as styles }  from "../styles/global";

export default function HelloWorld() {
    const [counter, setCounter] = useState(0);
    setTimeout(() => setCounter(counter > 9 ? 0 : counter + 1), 1000);

    return (
        <View style={styles.containerHW}>
            <View style={styles.headerHW}>
                <Text style={styles.textHW}>Terve Maailma!</Text>
                <Text style={styles.bigCentered}>{counter}</Text>
            </View>
            <View style={styles.mainHW}>
                <InputTest />
            </View>
        </View>
    );
}