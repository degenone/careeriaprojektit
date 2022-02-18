import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { api_id, api_key } from "../ApiKeys";
import { globalStyles } from "../styles/global";

export default function YleTekstiTV() {
    const [imageUrl, setImageUrl] = useState<string>();
    const [channel, setChannel] = useState(100);
    const [channelUp, setChannelUp] = useState(false);
    const [channelDown, setChannelDown] = useState(false);
    const [noContentChannels, setNoContentChannels] = useState<number[]>([]);
    const staticImage = 'https://yle.fi/uutiset/assets/img/share_image_v1.png';

    const handleChannelUp = () => {
        setChannel(current => {
            return current < 899 ? current + 1 : 100;
        });
        setChannelUp(true);
        setChannelDown(false);
    };
    const handleChannelDown = () => {
        setChannel(current => {
            return current > 100 ? current - 1 : 899;
        });
        setChannelUp(false);
        setChannelDown(true);
    };
    
    useEffect(() => {
        if (channel < 100) {
            return;
        } else if (noContentChannels.includes(channel)) {
            if (channelUp) {
                setChannel(current => {
                    return current < 899 ? current + 1 : 100;
                });
            } else if (channelDown) {
                setChannel(current => {
                    return current > 100 ? current - 1 : 899;
                });
            } else {
                if (imageUrl !== staticImage) {
                    setImageUrl(staticImage);
                }
            }
            return;
        }
        
        let url: string = `https://external.api.yle.fi/v1/teletext/images/${channel}/1.png?app_id=${api_id}&app_key=${api_key}&date=${Date.now()}`;
        fetch(url)
            .then(response => {
                if (response.status === 404) {
                    setImageUrl(staticImage);
                    setNoContentChannels(arr => [...arr, channel]);
                    if (channelUp) {
                        setChannel(current => {
                            return current <= 899 ? current + 1 : 100;
                        });
                    } else if (channelDown) {
                        setChannel(current => {
                            return current >= 100 ? current - 1 : 899;
                        });
                    }
                } else {
                    setChannelDown(false);
                    setChannelUp(false);
                    setImageUrl(url);
                }
            })
    }, [channel])

    return (
        <View style={globalStyles.mainContainer}>
            <ScrollView contentContainerStyle={globalStyles.scrollViewPage}>
                <Text style={globalStyles.title}>Ylen TekstiTV</Text>
                <View style={globalStyles.separatorLine} />
                <View style={globalStyles.searchSection}>
                    <TouchableOpacity
                        style={globalStyles.searchButton}
                        onPress={handleChannelDown}
                    >
                        <MaterialIcons
                            name='navigate-before'
                            color='#eee'
                            size={35}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={globalStyles.searchInput}
                        onChangeText={text => {
                            if (!text) {
                                return setChannel(0);
                            }
                            let num = parseInt(text);
                            if (num && num < 900) {
                                return setChannel(num);
                            }
                        }}
                        value={channel === 0 ? '' : channel.toString()}
                        keyboardType='numeric'
                        maxLength={3}
                    />
                    <TouchableOpacity
                        style={globalStyles.searchButton}
                        onPress={handleChannelUp}
                    >
                        <MaterialIcons
                            name='navigate-next'
                            color='#eee'
                            size={35}
                        />
                    </TouchableOpacity>
                </View>
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