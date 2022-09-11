import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import loaderGif from '../assets/gifs/loaderGif.gif';
import AppStyles from '../styles/AppStyles';
import { Image } from 'react-native'

interface LoaderProps {
    size: 'small' | 'medium' | 'large';
}

export default function Loader({ size }: LoaderProps) {

    function renderLoaderStyle(size: string) {
        if (size == 'small') {
            return styles.small
        }
        else if (size == 'medium') {
            return styles.medium
        }
        else if (size == 'large') {
            return styles.large
        }
        return null;
    }

    return (
        <View style={AppStyles.allScreenSpaceAvailableCenteredContainer}>
            <Image
                style={renderLoaderStyle(size)}
                source={loaderGif}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    small: {
        width: 35,
        height: 35,
    },
    medium: {
        width: 50,
        height: 50,
    },
    large: {
        width: 75,
        height: 75,
    }
})