import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import MyHeader from '../../components/MyHeader'
import AppStyles from '../../styles/AppStyles'
import { StatusBar } from 'expo-status-bar'

interface NotificationsProps {
    navigation: any
}

export default function Notifications({ navigation }: NotificationsProps) {
    return (
        <SafeAreaProvider style={AppStyles.safeAreaStyle}>
            <View style={AppStyles.fullScreenAppContainer}>
                <StatusBar style='light' backgroundColor='#000' />
                <MyHeader
                    navigation={navigation}
                    hasGoBackArrow={true}
                    title={'Notifications'}
                >
                </MyHeader>
            </View>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({})