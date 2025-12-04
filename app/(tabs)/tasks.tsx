import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenLayout from '../../components/ScreenLayout';
import TaskModal from '../../components/TaskModal';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function Tasks() {
    const { tasks, addTask, deleteTask, completeTask } = useApp();
    const [modalVisible, setModalVisible] = useState(false);
    const [completedId, setCompletedId] = useState<string | null>(null);

    const handleComplete = (taskId: string, taskTitle: string) => {
        completeTask(taskId);
        setCompletedId(taskId);
        setTimeout(() => setCompletedId(null), 1500);
        Alert.alert('Great job!', `You completed "${taskTitle}"! Keep going! 💪`);
    };

    const handleDelete = (taskId: string, isCustom?: boolean) => {
        if (!isCustom) {
            Alert.alert('Cannot delete', 'Default tasks cannot be deleted.');
            return;
        }
        Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteTask(taskId) },
        ]);
    };

    return (
        <ScreenLayout>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Beat the Craving</Text>
                <Text style={styles.subtitle}>Pick a task to distract yourself and get a dopamine hit naturally.</Text>

                <View style={styles.grid}>
                    {tasks.map((task) => (
                        <Pressable
                            key={task.id}
                            style={({ pressed }) => [
                                styles.card,
                                pressed && styles.cardPressed,
                                completedId === task.id && styles.cardCompleted,
                            ]}
                            onPress={() => handleComplete(task.id, task.title)}
                            onLongPress={() => handleDelete(task.id, task.isCustom)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: task.color + '20' }]}>
                                <FontAwesome name={task.icon as any} size={24} color={task.color} />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{task.title}</Text>
                                <Text style={styles.cardDesc} numberOfLines={2}>{task.desc}</Text>
                            </View>
                            {task.isCustom && (
                                <View style={styles.customBadge}>
                                    <Text style={styles.customBadgeText}>Custom</Text>
                                </View>
                            )}
                            {completedId === task.id && (
                                <View style={styles.checkOverlay}>
                                    <FontAwesome name="check-circle" size={40} color={COLORS.success} />
                                </View>
                            )}
                        </Pressable>
                    ))}
                </View>
            </ScrollView>

            {/* Floating Add Button */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <FontAwesome name="plus" size={24} color="#FFF" />
            </TouchableOpacity>

            <TaskModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={(task) => addTask(task)}
                mode="create"
            />
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
        paddingBottom: 100,
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
        marginBottom: SPACING.xl,
        lineHeight: 24,
    },
    grid: {
        gap: SPACING.m,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    cardPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    cardCompleted: {
        borderColor: COLORS.success,
        borderWidth: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.m,
    },
    cardContent: {
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
    customBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.primary + '30',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    customBadgeText: {
        color: COLORS.primary,
        fontSize: 10,
        fontFamily: FONTS.medium,
    },
    checkOverlay: {
        position: 'absolute',
        right: SPACING.m,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});
