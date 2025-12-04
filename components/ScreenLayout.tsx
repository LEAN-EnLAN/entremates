import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

interface ScreenLayoutProps {
    children: React.ReactNode;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
}

export default function ScreenLayout({ children, style, contentContainerStyle }: ScreenLayoutProps) {
    return (
        <View style={[styles.container, style]}>
            <View style={[styles.contentContainer, contentContainerStyle]}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center', // Centers the content container horizontally
        width: '100%',
    },
    contentContainer: {
        width: '100%',
        maxWidth: 800, // Max width for web
        flex: 1,
        paddingHorizontal: Platform.OS === 'web' ? SPACING.xl : 0, // Extra padding on web
    },
});
