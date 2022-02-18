import React from 'react'
import { Image, Modal, Pressable } from 'react-native';
import { globalStyles } from "../../styles/global";

export default function NWProductImageModal(props: { source: string, setModalOpen: Function }) {
    return (
        <Modal
            visible={true}
            transparent={true}
            animationType='slide'
        >
            <Pressable
                onPress={() => props.setModalOpen(false)}
                style={globalStyles.modalImageClose}
            />
            <Image
                source={{ uri: props.source }}
                style={globalStyles.modalImage}
            />
        </Modal>
    );    
}