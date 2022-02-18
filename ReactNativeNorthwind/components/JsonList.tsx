import React, { useState } from 'react';
import { Text, View, FlatList, Button, Pressable } from 'react-native';
import globalStyles, { globalColors } from '../styles/global';
// https://stackoverflow.com/questions/44743904/virtualizedlist-you-have-a-large-list-that-is-slow-to-update
// https://hackernoon.com/react-native-basics-implementing-infinite-scroll-hs143ur5
export default function JsonList() {
    const [todos, setTodos] = useState();

    const getData = () => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => response.json())
            .then(data => setTodos(data))
            .catch(error => console.log(error));
    };

    return (
        <View style={globalStyles.containerTODO}>
            <Button
                onPress={getData}
                title='Lataa todoot'
                color={globalColors.muddyGreen}
            />
            <FlatList
                data={todos}
                keyExtractor={item => item.id.toString()}
                initialNumToRender={10}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => {

                        }}
                        style={({ pressed }) => (
                            { backgroundColor: pressed ? globalColors.muddyYellow : 'transparent' }
                        )}
                    >
                        {({ pressed }) => (
                            <View>
                                <View style={globalStyles.separatorLine} />
                                <Text style={globalStyles.itemTODOtext}>{pressed ? 'Painoit minua' : 'Paina minua'}</Text>
                                {pressed && <Text  style={globalStyles.itemTODOtext}>Pääavain: { item.id }</Text>}
                                <Text style={globalStyles.itemItalic}>UserId: { item.userId }</Text>
                                <Text style={globalStyles.itemBolded}>Title: { item.title }</Text>
                                <Text style={globalStyles.itemUnderlined}>Status: { item.completed ? 'Valmis' : 'Kesken' }</Text>
                            </View>
                        )}
                    </Pressable>
                )}
            />
        </View>
    );
}