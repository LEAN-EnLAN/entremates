import FontAwesome from '@expo/vector-icons/FontAwesome';
import { format, startOfDay, subDays } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenLayout from '../../components/ScreenLayout';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

const QUICK_TRIGGERS = ['Stress', 'Coffee', 'Alcohol', 'Boredom', 'After meal', 'Social'];

export default function LogCraving() {
    const router = useRouter();
    const { logCraving, cravings, tasks } = useApp();
    const [intensity, setIntensity] = useState(3);
    const [trigger, setTrigger] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    const handleLog = async () => {
        await logCraving(intensity, trigger);

        // Suggest a random task
        const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

        Alert.alert(
            'Stay Strong! 💪',
            `Craving logged. Try "${randomTask.title}" to distract yourself!`,
            [
                { text: 'Do Task', onPress: () => router.push('/tasks') },
                { text: 'Back Home', onPress: () => router.push('/'), style: 'cancel' },
            ]
        );
        setTrigger('');
        setIntensity(3);
    };

    // Calculate stats
    const stats = useMemo(() => {
        const today = startOfDay(new Date());
        const todayCravings = cravings.filter(c => new Date(c.timestamp) >= today);
        const last7Days = cravings.filter(c => new Date(c.timestamp) >= subDays(new Date(), 7));

        // Find peak hour
        const hourCounts: Record<number, number> = {};
        cravings.forEach(c => {
            const hour = new Date(c.timestamp).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];

        // Find most common trigger
        const triggerCounts: Record<string, number> = {};
        cravings.forEach(c => {
            if (c.trigger) {
                triggerCounts[c.trigger] = (triggerCounts[c.trigger] || 0) + 1;
            }
        });
        const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0];

        return {
            todayCount: todayCravings.length,
            weekCount: last7Days.length,
            totalCount: cravings.length,
            peakHour: peakHour ? `${peakHour[0]}:00` : '--',
            topTrigger: topTrigger ? topTrigger[0] : '--',
            avgIntensity: cravings.length > 0
                ? (cravings.reduce((s, c) => s + c.intensity, 0) / cravings.length).toFixed(1)
                : '0',
        };
    }, [cravings]);

    // Recent cravings (last 10)
    const recentCravings = cravings.slice(0, 10);

    return (
        <ScreenLayout>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Stats Summary */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.todayCount}</Text>
                        <Text style={styles.statLabel}>Today</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.weekCount}</Text>
                        <Text style={styles.statLabel}>This Week</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.avgIntensity}</Text>
                        <Text style={styles.statLabel}>Avg Intensity</Text>
                    </View>
                </View>

                {/* Log Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Log a Craving</Text>

                    <Text style={styles.label}>How strong is it?</Text>
                    <View style={styles.intensityContainer}>
                        {[1, 2, 3, 4, 5].map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.intensityButton,
                                    intensity === level && styles.intensityButtonActive,
                                ]}
                                onPress={() => setIntensity(level)}
                            >
                                <Text style={[styles.intensityText, intensity === level && styles.intensityTextActive]}>
                                    {level}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.intensityLabel}>
                        {intensity === 1 ? '😌 Mild' : intensity === 2 ? '😐 Low' : intensity === 3 ? '😟 Moderate' : intensity === 4 ? '😣 Strong' : '🔥 Severe'}
                    </Text>

                    <Text style={styles.label}>What triggered it?</Text>
                    <View style={styles.quickTriggers}>
                        {QUICK_TRIGGERS.map((t) => (
                            <Pressable
                                key={t}
                                style={[styles.triggerChip, trigger === t && styles.triggerChipActive]}
                                onPress={() => setTrigger(trigger === t ? '' : t)}
                            >
                                <Text style={[styles.triggerChipText, trigger === t && styles.triggerChipTextActive]}>{t}</Text>
                            </Pressable>
                        ))}
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Or type your own..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={trigger}
                        onChangeText={setTrigger}
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handleLog}>
                        <FontAwesome name="plus" size={16} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.submitButtonText}>Log Craving</Text>
                    </TouchableOpacity>
                </View>

                {/* Insights */}
                <View style={styles.insightsCard}>
                    <Text style={styles.insightsTitle}>📊 Your Patterns</Text>
                    <View style={styles.insightRow}>
                        <View style={styles.insightItem}>
                            <FontAwesome name="clock-o" size={20} color={COLORS.warning} />
                            <Text style={styles.insightLabel}>Peak Time</Text>
                            <Text style={styles.insightValue}>{stats.peakHour}</Text>
                        </View>
                        <View style={styles.insightItem}>
                            <FontAwesome name="bolt" size={20} color={COLORS.accent} />
                            <Text style={styles.insightLabel}>Top Trigger</Text>
                            <Text style={styles.insightValue}>{stats.topTrigger}</Text>
                        </View>
                        <View style={styles.insightItem}>
                            <FontAwesome name="bar-chart" size={20} color={COLORS.primary} />
                            <Text style={styles.insightLabel}>Total</Text>
                            <Text style={styles.insightValue}>{stats.totalCount}</Text>
                        </View>
                    </View>
                </View>

                {/* Recent History */}
                <View style={styles.historySection}>
                    <TouchableOpacity style={styles.historyHeader} onPress={() => setShowHistory(!showHistory)}>
                        <Text style={styles.historyTitle}>Recent Cravings</Text>
                        <FontAwesome name={showHistory ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.textSecondary} />
                    </TouchableOpacity>

                    {showHistory && (
                        <View style={styles.historyList}>
                            {recentCravings.length === 0 ? (
                                <Text style={styles.emptyText}>No cravings logged yet. Stay strong! 💪</Text>
                            ) : (
                                recentCravings.map((c) => (
                                    <View key={c.id} style={styles.historyItem}>
                                        <View style={styles.historyLeft}>
                                            <View style={[styles.intensityDot, { backgroundColor: getIntensityColor(c.intensity) }]} />
                                            <View>
                                                <Text style={styles.historyTrigger}>{c.trigger || 'No trigger noted'}</Text>
                                                <Text style={styles.historyTime}>{format(new Date(c.timestamp), 'MMM d, h:mm a')}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.historyIntensity}>{c.intensity}/5</Text>
                                    </View>
                                ))
                            )}
                        </View>
                    )}
                </View>

                {/* Tip */}
                <View style={styles.tipContainer}>
                    <FontAwesome name="lightbulb-o" size={24} color={COLORS.warning} style={{ marginRight: SPACING.m }} />
                    <Text style={styles.tipText}>
                        Most cravings last only 3-5 minutes. When you feel one coming, try a healthy task to ride it out!
                    </Text>
                </View>
            </ScrollView>
        </ScreenLayout>
    );
}

const getIntensityColor = (intensity: number) => {
    const colors = ['#10B981', '#84CC16', '#F59E0B', '#F97316', '#EF4444'];
    return colors[intensity - 1] || COLORS.textSecondary;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.l,
        paddingBottom: 40,
    },
    statsRow: {
        flexDirection: 'row',
        gap: SPACING.m,
        marginBottom: SPACING.l,
    },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
    },
    statValue: {
        color: COLORS.text,
        fontSize: 24,
        fontFamily: FONTS.bold,
    },
    statLabel: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginTop: 2,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: SPACING.l,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
        marginBottom: SPACING.l,
    },
    cardTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontFamily: FONTS.bold,
        marginBottom: SPACING.m,
    },
    label: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontFamily: FONTS.medium,
        marginBottom: SPACING.s,
        marginTop: SPACING.m,
    },
    intensityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    intensityButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
        borderWidth: 2,
        borderColor: COLORS.surfaceLight,
    },
    intensityButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    intensityText: {
        color: COLORS.textSecondary,
        fontSize: 18,
        fontFamily: FONTS.bold,
    },
    intensityTextActive: {
        color: '#FFF',
    },
    intensityLabel: {
        color: COLORS.text,
        textAlign: 'center',
        marginTop: SPACING.s,
        fontSize: 16,
    },
    quickTriggers: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
        marginBottom: SPACING.m,
    },
    triggerChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
    },
    triggerChipActive: {
        backgroundColor: COLORS.primary + '20',
        borderColor: COLORS.primary,
    },
    triggerChipText: {
        color: COLORS.textSecondary,
        fontSize: 13,
    },
    triggerChipTextActive: {
        color: COLORS.primary,
    },
    input: {
        backgroundColor: COLORS.background,
        color: COLORS.text,
        padding: SPACING.m,
        borderRadius: 12,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
    },
    submitButton: {
        backgroundColor: COLORS.accent,
        padding: SPACING.m,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    insightsCard: {
        backgroundColor: COLORS.surface,
        padding: SPACING.l,
        borderRadius: 16,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
    },
    insightsTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.bold,
        marginBottom: SPACING.m,
    },
    insightRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    insightItem: {
        alignItems: 'center',
        flex: 1,
    },
    insightLabel: {
        color: COLORS.textSecondary,
        fontSize: 11,
        marginTop: SPACING.xs,
    },
    insightValue: {
        color: COLORS.text,
        fontSize: 14,
        fontFamily: FONTS.bold,
        marginTop: 2,
    },
    historySection: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
        overflow: 'hidden',
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.m,
    },
    historyTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    historyList: {
        borderTopWidth: 1,
        borderTopColor: COLORS.surfaceLight,
    },
    emptyText: {
        color: COLORS.textSecondary,
        padding: SPACING.m,
        textAlign: 'center',
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceLight,
    },
    historyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    intensityDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: SPACING.m,
    },
    historyTrigger: {
        color: COLORS.text,
        fontSize: 14,
    },
    historyTime: {
        color: COLORS.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    historyIntensity: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontFamily: FONTS.bold,
    },
    tipContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 12,
        alignItems: 'center',
    },
    tipText: {
        color: COLORS.textSecondary,
        flex: 1,
        lineHeight: 20,
    },
});
