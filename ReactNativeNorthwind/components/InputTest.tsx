import React, { useState } from 'react';
import { Button, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalColors, globalStyles as styles } from "../styles/global";

export default function InputTest() {
    const [name, setName] = useState('');
    // const [output, setOutput] = useState(Array<string>());
    const [output, setOutput] = useState<string[]>([]);

    const showName = () => {
        if (!name.trim()) {
            return;
        }
        setOutput(names => [...names, name]);
        setName('');
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.headerInput}>
                <Text style={styles.textHW}>Anna nimi:</Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={text => setName(text)}
                    value={name}
                />
                <Button
                    title='Lisää henklilö'
                    onPress={showName}
                    color={globalColors.muddyGreen}
                />
                <TouchableOpacity
                    style={{
                        marginTop: 1,
                        backgroundColor: '#ccc'
                    }}
                    onPress={() => setOutput([])}
                >
                    <Text style={styles.listEmpty}>Tyhjennä</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView} fadingEdgeLength={180}>
                {output.map((name, idx) => (
                    <Text key={idx} style={styles.listItem}>{ name }</Text>
                ))}
            </ScrollView>
        </View>
    );
}