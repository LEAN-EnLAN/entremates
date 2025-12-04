import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ComponentProps<typeof FontAwesome>['name'];
    color?: string;
}

export default function StatCard({ title, value, icon, color = COLORS.primary }: StatCardProps) {
    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <FontAwesome name={icon} size={20} color={color} />
            </View>
            <View>
                <Text style={styles.value}>{value}</Text>
                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    value: {
        color: COLORS.text,
        fontSize: 18,
        fontFamily: FONTS.bold,
        marginBottom: 2,
    },
    title: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontFamily: FONTS.medium,
    },
});
