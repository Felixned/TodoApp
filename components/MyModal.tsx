import { BackHandler, Modal, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect } from 'react'
import AppStyles, { mediumRadius, secondaryColor, smallerSpacing, smallFontSize, tertiaryColor, textFont, white } from '../styles/AppStyles';
import { useNavigation } from '@react-navigation/native';

interface MyModalProps {
    isModalVisible: boolean;
    setIsModalVisible: (arg: boolean) => void;
    children?: any;
    title?: string;
}

export default function MyModal({ isModalVisible, setIsModalVisible, children, title }: MyModalProps) {

    function pressBackGround() {
        setIsModalVisible(false);
    }

    const handleBackButtonPress = () => {
        setIsModalVisible(false);
    }

    return (
        <Modal
            visible={isModalVisible}
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
        >
            <Pressable
                onPress={(pressBackGround)}
                style={[styles.modalBackground]}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalContainer}>
                        {title &&
                            <View style={styles.titleContainerStyle}>
                                <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.titleStyle}>{title}</Text>
                            </View>
                        }
                        <View style={styles.contentContainerStyle}>{children}</View>
                    </View>
                </TouchableWithoutFeedback>
            </Pressable>
        </ Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        width: '80%',
        backgroundColor: secondaryColor,
        borderRadius: mediumRadius,
        elevation: 20,
        borderWidth: 1,
        borderColor: tertiaryColor
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    titleContainerStyle: {
        height: 60,
        width: '100%',
        borderBottomColor: tertiaryColor,
        borderBottomWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleStyle: {
        fontFamily: textFont,
        fontSize: smallFontSize,
        color: white,
        textAlign: 'center'
    },
    contentContainerStyle: {
        padding: smallerSpacing,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
})