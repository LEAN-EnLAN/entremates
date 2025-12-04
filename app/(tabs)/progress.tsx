import FontAwesome from '@expo/vector-icons/FontAwesome';
import { differenceInDays, differenceInHours, format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenLayout from '../../components/ScreenLayout';
import { MILESTONES } from '../../constants/milestones';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function Progress() {
    const { quitDate, cravings, completedTasks } = useApp();
    const [hoursSinceQuit, setHoursSinceQuit] = useState(0);
    const [, setTick] = useState(0);

    useEffect(() => {
        if (quitDate) {
            setHoursSinceQuit(differenceInHours(new Date(), new Date(quitDate)));
        }
        const interval = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(interval);
    }, [quitDate]);

    const getStats = () => {
        const totalCravings = cravings.length;
        const tasksCompleted = completedTasks.length;
        const avgIntensity = totalCravings > 0
            ? (cravings.reduce((sum, c) => sum + c.intensity, 0) / totalCravings).toFixed(1)
            : '0';

        // Calculate streak (days without craving)
        let streak = 0;
        if (quitDate) {
            const daysSinceQuit = differenceInDays(new Date(), new Date(quitDate));
            const cravingDays = new Set(cravings.map(c => format(new Date(c.timestamp), 'yyyy-MM-dd')));
            streak = daysSinceQuit - cravingDays.size;
        }

        return { totalCravings, tasksCompleted, avgIntensity, streak };
    };

    const stats = getStats();
    const unlockedCount = MILESTONES.filter(m => hoursSinceQuit >= m.hours).length;
    const nextMilestone = MILESTONES.find(m => hoursSinceQuit < m.hours);

    return (
        <ScreenLayout>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Your Progress</Text>
                <Text style={styles.subtitle}>Track your journey to a smoke-free life.</Text>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <FontAwesome name="fire" size={20} color={COLORS.warning} />
                        <Text style={styles.statValue}>{stats.totalCravings}</Text>
                        <Text style={styles.statLabel}>Cravings Logged</Text>
                    </View>
                    <View style={styles.statCard}>
                        <FontAwesome name="check-circle" size={20} color={COLORS.success} />
                        <Text style={styles.statValue}>{stats.tasksCompleted}</Text>
                        <Text style={styles.statLabel}>Tasks Done</Text>
                    </View>
                    <View style={styles.statCard}>
                        <FontAwesome name="line-chart" size={20} color={COLORS.accent} />
                        <Text style={styles.statValue}>{stats.avgIntensity}</Text>
                        <Text style={styles.statLabel}>Avg Intensity</Text>
                    </View>
                    <View style={styles.statCard}>
                        <FontAwesome name="calendar-check-o" size={20} color={COLORS.primary} />
                        <Text style={styles.statValue}>{stats.streak}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                </View>

                {/* Next Milestone */}
                {nextMilestone && (
                    <View style={styles.nextMilestone}>
                        <Text style={styles.nextLabel}>NEXT MILESTONE</Text>
                        <View style={styles.nextContent}>
                            <FontAwesome name={nextMilestone.icon as any} size={28} color={COLORS.primary} />
                            <View style={styles.nextText}>
                                <Text style={styles.nextTitle}>{nextMilestone.title}</Text>
                                <Text style={styles.nextDesc}>{nextMilestone.description}</Text>
                            </View>
                        </View>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${Math.min((hoursSinceQuit / nextMilestone.hours) * 100, 100)}%` }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {Math.round((hoursSinceQuit / nextMilestone.hours) * 100)}% complete
                        </Text>
                    </View>
                )}

                {/* Achievement Summary */}
                <View style={styles.achievementSummary}>
                    <FontAwesome name="trophy" size={24} color={COLORS.warning} />
                    <Text style={styles.achievementText}>
                        {unlockedCount} of {MILESTONES.length} milestones unlocked
                    </Text>
                </View>

                {/* Timeline */}
                <Text style={styles.sectionTitle}>Health Timeline</Text>
                <View style={styles.timeline}>
                    {MILESTONES.map((milestone, index) => {
                        const isUnlocked = hoursSinceQuit >= milestone.hours;
                        const progress = Math.min(hoursSinceQuit / milestone.hours, 1);

                        return (
                            <View key={milestone.id} style={styles.milestoneRow}>
                                {/* Timeline connector */}
                                <View style={styles.timelineConnector}>
                                    <View style={[
                                        styles.timelineDot,
                                        isUnlocked && styles.timelineDotUnlocked
                                    ]}>
                                        <FontAwesome
                                            name={isUnlocked ? 'check' : (milestone.icon as any)}
                                            size={12}
                                            color={isUnlocked ? '#FFF' : COLORS.textSecondary}
                                        />
                                    </View>
                                    {index < MILESTONES.length - 1 && (
                                        <View style={[
                                            styles.timelineLine,
                                            isUnlocked && styles.timelineLineUnlocked
                                        ]} />
                                    )}
                                </View>

                                {/* Milestone content */}
                                <View style={[
                                    styles.milestoneCard,
                                    isUnlocked && styles.milestoneCardUnlocked
                                ]}>
                                    <View style={styles.milestoneHeader}>
                                        <Text style={[
                                            styles.milestoneTitle,
                                            isUnlocked && styles.milestoneTitleUnlocked
                                        ]}>
                                            {milestone.title}
                                        </Text>
                                        <Text style={styles.milestoneTime}>
                                            {milestone.hours < 24
                                                ? `${milestone.hours}h`
                                                : `${Math.round(milestone.hours / 24)}d`}
                                        </Text>
                                    </View>
                                    <Text style={styles.milestoneDesc}>{milestone.description}</Text>
                                    {isUnlocked && (
                                        <Text style={styles.milestoneBenefit}>🎉 {milestone.benefit}</Text>
                                    )}
                                    {!isUnlocked && progress > 0 && (
                                        <View style={styles.milestoneProgress}>
                                            <View style={[styles.milestoneProgressFill, { width: `${progress * 100}%` }]} />
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.l,
        paddingBottom: 40,
    },
    title: {
        color: COLORS.text,
        fontSize: 24,
        fontFamily: FONTS.bold,
        marginBottom: SPACING.s,
    },
    subtitle: {
        color: COLORS.textSecondary,
        fontSize: 16,
        marginBottom: SPACING.l,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.m,
        marginBottom: SPACING.xl,
    },
    statCard: {
        flex: 1,
        minWidth: 140,
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
    },
    statValue: {
        color: COLORS.text,
        fontSize: 28,
        fontFamily: FONTS.bold,
        marginVertical: SPACING.xs,
    },
    statLabel: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    nextMilestone: {
        backgroundColor: COLORS.surface,
        padding: SPACING.l,
        borderRadius: 16,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.primary + '40',
    },
    nextLabel: {
        color: COLORS.primary,
        fontSize: 12,
        fontFamily: FONTS.bold,
        marginBottom: SPACING.m,
    },
    nextContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    nextText: {
        marginLeft: SPACING.m,
        flex: 1,
    },
    nextTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontFamily: FONTS.bold,
    },
    nextDesc: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginTop: 4,
    },
    progressBar: {
        height: 8,
        backgroundColor: COLORS.background,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    },
    progressText: {
        color: COLORS.textSecondary,
        fontSize: 12,
        marginTop: SPACING.s,
        textAlign: 'right',
    },
    achievementSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.m,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        marginBottom: SPACING.xl,
    },
    achievementText: {
        color: COLORS.text,
        fontSize: 16,
        marginLeft: SPACING.m,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontFamily: FONTS.bold,
        marginBottom: SPACING.m,
    },
    timeline: {
        gap: 0,
    },
    milestoneRow: {
        flexDirection: 'row',
    },
    timelineConnector: {
        width: 40,
        alignItems: 'center',
    },
    timelineDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.surface,
        borderWidth: 2,
        borderColor: COLORS.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineDotUnlocked: {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: COLORS.surfaceLight,
    },
    timelineLineUnlocked: {
        backgroundColor: COLORS.success,
    },
    milestoneCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 12,
        marginBottom: SPACING.m,
        marginLeft: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
        opacity: 0.7,
    },
    milestoneCardUnlocked: {
        opacity: 1,
        borderColor: COLORS.success + '40',
    },
    milestoneHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    milestoneTitle: {
        color: COLORS.textSecondary,
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    milestoneTitleUnlocked: {
        color: COLORS.text,
    },
    milestoneTime: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    milestoneDesc: {
        color: COLORS.textSecondary,
        fontSize: 13,
        lineHeight: 18,
    },
    milestoneBenefit: {
        color: COLORS.success,
        fontSize: 12,
        marginTop: SPACING.s,
        fontFamily: FONTS.medium,
    },
    milestoneProgress: {
        height: 4,
        backgroundColor: COLORS.background,
        borderRadius: 2,
        marginTop: SPACING.s,
        overflow: 'hidden',
    },
    milestoneProgressFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
});
