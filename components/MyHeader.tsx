import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { withSafeAreaInsets } from 'react-native-safe-area-context'
import AppStyles, { primaryColor, mainDarkBackgroundColor, smallerSpacing } from '../styles/AppStyles'
import GoBackArrow from '../assets/icons/goBackArrow.svg';

interface MyHeaderProps {
    navigation: any,
    children?: any,
    hasGoBackArrow?: boolean,
    title?: string,
}

export default function MyHeader({ navigation, children, hasGoBackArrow, title }: MyHeaderProps) {
    return (
        <View style={styles.myHeaderStyle}>
            {
                hasGoBackArrow &&
                <View style={styles.goBackArrowContainerStyle}>
                    <GoBackArrow
                        width={40}
                        height={35}
                        fill={primaryColor}
                        style={styles.goBackArrowStyle}
                        onPress={() => navigation.goBack()} />
                </View>
            }
            {
                title &&
                <Text numberOfLines={2} adjustsFontSizeToFit={true} style={[styles.titleStyle, AppStyles.bigText]}>{title}</Text>
            }
            <View style={styles.otherHeaderIconsStyle}>{children}</View>
        </View>
    )
}

const styles = StyleSheet.create({
    myHeaderStyle: {
        height: 60,
        width: '100%',
        backgroundColor: mainDarkBackgroundColor,
        borderBottomColor: primaryColor,
        borderBottomWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    goBackArrowContainerStyle: {
        display: 'flex',
        flexGrow: 1,
        flex: 1,
    },
    goBackArrowStyle: {
        marginLeft: smallerSpacing,
    },
    titleStyle: {
        display: 'flex',
        flexGrow: 1,
        flex: 1,
        color: primaryColor,
        textAlign: 'center',
    },
    otherHeaderIconsStyle: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
    }
})