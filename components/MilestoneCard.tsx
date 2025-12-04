import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface MilestoneCardProps {
    title: string;
    description: string;
    isUnlocked: boolean;
    progress: number; // 0 to 1
}

export default function MilestoneCard({ title, description, isUnlocked, progress }: MilestoneCardProps) {
    return (
        <View style={[styles.container, isUnlocked && styles.unlockedContainer]}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: isUnlocked ? COLORS.success : COLORS.surfaceLight }]}>
                    <FontAwesome
                        name={isUnlocked ? 'check' : 'lock'}
                        size={16}
                        color={isUnlocked ? COLORS.text : COLORS.textSecondary}
                    />
                </View>
                <Text style={[styles.title, isUnlocked && styles.unlockedText]}>{title}</Text>
            </View>

            <Text style={styles.description}>{description}</Text>

            {!isUnlocked && (
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
        opacity: 0.8,
    },
    unlockedContainer: {
        borderColor: COLORS.success,
        opacity: 1,
        backgroundColor: COLORS.surface, // Keep surface color but maybe add a glow effect in future
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.s,
    },
    title: {
        color: COLORS.textSecondary,
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    unlockedText: {
        color: COLORS.text,
    },
    description: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginBottom: SPACING.s,
        lineHeight: 20,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 2,
        marginTop: SPACING.s,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
});
