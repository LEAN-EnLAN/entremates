import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const ICON_OPTIONS = ['heartbeat', 'tint', 'blind', 'fire', 'phone', 'book', 'music', 'gamepad', 'coffee', 'leaf', 'sun-o', 'moon-o'];
const COLOR_OPTIONS = ['#F43F5E', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

interface TaskModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (task: { title: string; desc: string; icon: string; color: string }) => void;
    initialValues?: { title: string; desc: string; icon: string; color: string };
    mode: 'create' | 'edit';
}

export default function TaskModal({ visible, onClose, onSave, initialValues, mode }: TaskModalProps) {
    const [title, setTitle] = useState(initialValues?.title || '');
    const [desc, setDesc] = useState(initialValues?.desc || '');
    const [icon, setIcon] = useState(initialValues?.icon || 'heartbeat');
    const [color, setColor] = useState(initialValues?.color || '#F43F5E');

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({ title: title.trim(), desc: desc.trim(), icon, color });
        setTitle('');
        setDesc('');
        setIcon('heartbeat');
        setColor('#F43F5E');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{mode === 'create' ? 'New Task' : 'Edit Task'}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome name="times" size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="e.g., Meditation"
                            placeholderTextColor={COLORS.textSecondary}
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={desc}
                            onChangeText={setDesc}
                            placeholder="Describe what to do..."
                            placeholderTextColor={COLORS.textSecondary}
                            multiline
                            numberOfLines={3}
                        />

                        <Text style={styles.label}>Icon</Text>
                        <View style={styles.optionsRow}>
                            {ICON_OPTIONS.map((ic) => (
                                <Pressable
                                    key={ic}
                                    style={[styles.iconOption, icon === ic && { borderColor: color, backgroundColor: color + '20' }]}
                                    onPress={() => setIcon(ic)}
                                >
                                    <FontAwesome name={ic as any} size={20} color={icon === ic ? color : COLORS.textSecondary} />
                                </Pressable>
                            ))}
                        </View>

                        <Text style={styles.label}>Color</Text>
                        <View style={styles.optionsRow}>
                            {COLOR_OPTIONS.map((c) => (
                                <Pressable
                                    key={c}
                                    style={[styles.colorOption, { backgroundColor: c }, color === c && styles.colorSelected]}
                                    onPress={() => setColor(c)}
                                />
                            ))}
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={[styles.saveButton, { backgroundColor: color }]} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>{mode === 'create' ? 'Add Task' : 'Save Changes'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        paddingBottom: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.l,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceLight,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONTS.bold,
        color: COLORS.text,
    },
    content: {
        padding: SPACING.l,
    },
    label: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
        marginTop: SPACING.m,
    },
    input: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: SPACING.m,
        color: COLORS.text,
        fontSize: 16,
        borderWidth: 1,
        borderColor: COLORS.surfaceLight,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
    },
    iconOption: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorOption: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    colorSelected: {
        borderColor: COLORS.text,
    },
    saveButton: {
        marginHorizontal: SPACING.l,
        padding: SPACING.m,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
});
