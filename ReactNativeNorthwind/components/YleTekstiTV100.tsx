import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { api_id, api_key } from "../ApiKeys";
import { globalStyles } from "../styles/global";

export default function YleTekstiTV100() {
    const imageUrl = `https://external.api.yle.fi/v1/teletext/images/100/1.png?app_id=${api_id}&app_key=${api_key}&date=${Date.now()}`;

    return (
        <View style={globalStyles.mainContainer}>
            <ScrollView contentContainerStyle={globalStyles.scrollViewPage}>
                <Text style={globalStyles.title}>Ylen TekstiTVn Pääsivu</Text>
                <View style={globalStyles.separatorLine} />
                <View style={globalStyles.imageSection}>
                    <Image
                        style={globalStyles.yleTextTV}
                        resizeMode={'contain'}
                        source={{
                            uri: imageUrl,
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}