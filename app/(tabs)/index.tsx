// Dashboard screen
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { differenceInDays } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Counter from '../../components/Counter';
import ScreenLayout from '../../components/ScreenLayout';
import StatCard from '../../components/StatCard';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function Dashboard() {
  const { quitDate, setQuitDate, cigarettesPerDay, pricePerPack, resetData } = useApp();
  const router = useRouter();
  const [showSetup, setShowSetup] = useState(!quitDate);

  // Setup state
  const [tempDate, setTempDate] = useState(new Date().toISOString());
  const [tempCigs, setTempCigs] = useState('10');
  const [tempPrice, setTempPrice] = useState('10');

  const handleSetup = () => {
    setQuitDate(tempDate);
    // In a real app we'd save the other values too via context
    // For now assuming context has methods for these or we add them
    setShowSetup(false);
  };

  const calculateMoneySaved = () => {
    if (!quitDate) return '0.00';
    const days = differenceInDays(new Date(), new Date(quitDate));
    const dailyCost = (pricePerPack / 20) * cigarettesPerDay; // Assuming 20 cigs/pack
    return (days * dailyCost).toFixed(2);
  };

  const calculateCigsAvoided = () => {
    if (!quitDate) return '0';
    const days = differenceInDays(new Date(), new Date(quitDate));
    return (days * cigarettesPerDay).toString();
  };

  if (!quitDate) {
    return (
      <View style={styles.setupContainer}>
        <Text style={styles.setupTitle}>Welcome to BreatheFree</Text>
        <Text style={styles.setupSubtitle}>Let's start your journey.</Text>

        <TouchableOpacity
          style={styles.setupButton}
          onPress={() => setQuitDate(new Date().toISOString())}
        >
          <Text style={styles.setupButtonText}>I Quit Just Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.setupButton, { backgroundColor: COLORS.surface }]}
          onPress={() => {
            // For simplicity in this demo, just setting a date 2 days ago
            const d = new Date();
            d.setDate(d.getDate() - 2);
            setQuitDate(d.toISOString());
          }}
        >
          <Text style={styles.setupButtonText}>I Quit Before</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.background]}
          style={styles.header}
        >
          <Counter quitDate={quitDate} />
        </LinearGradient>

        <View style={styles.statsGrid}>
          <View style={styles.statCardWrapper}>
            <StatCard
              title="Money Saved"
              value={`$${calculateMoneySaved()}`}
              icon="dollar"
              color={COLORS.success}
            />
          </View>
          <View style={styles.statCardWrapper}>
            <StatCard
              title="Cigarettes Avoided"
              value={calculateCigsAvoided()}
              icon="ban"
              color={COLORS.accent}
            />
          </View>
        </View>

        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/log')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.warning + '20' }]}>
                <FontAwesome name="exclamation-triangle" size={24} color={COLORS.warning} />
              </View>
              <Text style={styles.actionTitle}>Log Craving</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/tasks')}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.secondary + '20' }]}>
                <FontAwesome name="list-ul" size={24} color={COLORS.secondary} />
              </View>
              <Text style={styles.actionTitle}>Healthy Tasks</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetData}>
          <Text style={styles.resetText}>Reset Progress (Debug)</Text>
        </TouchableOpacity>
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
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.l,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.m,
    marginTop: -SPACING.m,
    gap: SPACING.m,
  },
  statCardWrapper: {
    flex: 1,
    minWidth: 300, // Ensure cards don't get too small on wrap
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.m,
    paddingHorizontal: SPACING.m,
  },
  actionSection: {
    marginTop: SPACING.m,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.m,
    gap: SPACING.m,
  },
  actionCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: COLORS.surface,
    padding: SPACING.l,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
    // Add shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  actionTitle: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  setupContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  setupTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  setupSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  setupButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  setupButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  resetButton: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  resetText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});
