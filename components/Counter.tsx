import { differenceInSeconds } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface CounterProps {
    quitDate: string;
}

export default function Counter({ quitDate }: CounterProps) {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const start = new Date(quitDate);

            const totalSeconds = differenceInSeconds(now, start);

            const days = Math.floor(totalSeconds / (3600 * 24));
            const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            setTime({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, [quitDate]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Smoke Free For</Text>
            <View style={styles.row}>
                <TimeBlock value={time.days} label="DAYS" />
                <TimeBlock value={time.hours} label="HRS" />
                <TimeBlock value={time.minutes} label="MINS" />
                <TimeBlock value={time.seconds} label="SECS" />
            </View>
        </View>
    );
}

const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <View style={styles.block}>
        <Text style={styles.value}>{value.toString().padStart(2, '0')}</Text>
        <Text style={styles.label}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: SPACING.l,
    },
    title: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontFamily: FONTS.medium,
        marginBottom: SPACING.m,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.m,
    },
    block: {
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 12,
        minWidth: 70,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
    },
    value: {
        color: COLORS.primary,
        fontSize: 24,
        fontFamily: FONTS.bold,
        marginBottom: SPACING.xs,
    },
    label: {
        color: COLORS.textSecondary,
        fontSize: 10,
        fontFamily: FONTS.regular,
    },
});
