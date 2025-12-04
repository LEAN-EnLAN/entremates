import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface TaskCardProps {
    title: string;
    desc: string;
    icon: string;
    color: string;
    onPress?: () => void;
}

export default function TaskCard({ title, desc, icon, color, onPress }: TaskCardProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <Pressable
            onPress={onPress}
            onHoverIn={() => setIsHovered(true)}
            onHoverOut={() => setIsHovered(false)}
            style={({ pressed }) => [
                styles.card,
                isHovered && styles.cardHovered,
                pressed && styles.cardPressed,
            ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <FontAwesome name={icon as any} size={24} color={color} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDesc}>{desc}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 280, // Responsive width
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
        flexDirection: 'row',
        alignItems: 'center',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        transitionDuration: '200ms', // Web transition
    } as any, // Cast to any for web-specific properties
    cardHovered: {
        transform: [{ scale: 1.02 }],
        borderColor: COLORS.primary,
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    cardPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.bold,
        marginBottom: 4,
    },
    cardDesc: {
        color: COLORS.textSecondary,
        fontSize: 12,
        lineHeight: 18,
    },
});
