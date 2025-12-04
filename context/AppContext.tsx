import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CravingLog {
    id: string;
    timestamp: string;
    intensity: number;
    trigger?: string;
}

interface Task {
    id: string;
    title: string;
    desc: string;
    icon: string;
    color: string;
    isCustom?: boolean;
}

interface CompletedTask {
    taskId: string;
    timestamp: string;
}

interface AppContextType {
    quitDate: string | null;
    setQuitDate: (date: string | null) => void;
    cigarettesPerDay: number;
    setCigarettesPerDay: (count: number) => void;
    pricePerPack: number;
    setPricePerPack: (price: number) => void;
    cravings: CravingLog[];
    logCraving: (intensity: number, trigger?: string) => void;
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'isCustom'>) => void;
    updateTask: (id: string, task: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    completeTask: (taskId: string) => void;
    completedTasks: CompletedTask[];
    isLoading: boolean;
    resetData: () => void;
}

const DEFAULT_TASKS: Task[] = [
    { id: '1', title: 'Deep Breathing', icon: 'heartbeat', color: '#F43F5E', desc: 'Take 10 deep breaths. Inhale for 4s, hold for 7s, exhale for 8s.' },
    { id: '2', title: 'Drink Water', icon: 'tint', color: '#3B82F6', desc: 'Drink a full glass of water slowly.' },
    { id: '3', title: 'Quick Walk', icon: 'blind', color: '#10B981', desc: 'Go for a 5-minute walk around the block.' },
    { id: '4', title: 'Push-ups', icon: 'fire', color: '#F59E0B', desc: 'Do as many push-ups as you can in 1 minute.' },
    { id: '5', title: 'Call a Friend', icon: 'phone', color: '#8B5CF6', desc: 'Call someone who supports your journey.' },
    { id: '6', title: 'Learn Something', icon: 'book', color: '#EC4899', desc: 'Read an article or watch an educational video.' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [quitDate, setQuitDateState] = useState<string | null>(null);
    const [cigarettesPerDay, setCigarettesPerDayState] = useState(10);
    const [pricePerPack, setPricePerPackState] = useState(10);
    const [cravings, setCravings] = useState<CravingLog[]>([]);
    const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
    const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const storedQuitDate = await AsyncStorage.getItem('quitDate');
            const storedCigarettes = await AsyncStorage.getItem('cigarettesPerDay');
            const storedPrice = await AsyncStorage.getItem('pricePerPack');
            const storedCravings = await AsyncStorage.getItem('cravings');
            const storedTasks = await AsyncStorage.getItem('tasks');
            const storedCompleted = await AsyncStorage.getItem('completedTasks');

            if (storedQuitDate) setQuitDateState(storedQuitDate);
            if (storedCigarettes) setCigarettesPerDayState(Number(storedCigarettes));
            if (storedPrice) setPricePerPackState(Number(storedPrice));
            if (storedCravings) setCravings(JSON.parse(storedCravings));
            if (storedTasks) setTasks(JSON.parse(storedTasks));
            if (storedCompleted) setCompletedTasks(JSON.parse(storedCompleted));
        } catch (e) {
            console.error('Failed to load data', e);
        } finally {
            setIsLoading(false);
        }
    };

    const setQuitDate = async (date: string | null) => {
        setQuitDateState(date);
        if (date) {
            await AsyncStorage.setItem('quitDate', date);
        } else {
            await AsyncStorage.removeItem('quitDate');
        }
    };

    const setCigarettesPerDay = async (count: number) => {
        setCigarettesPerDayState(count);
        await AsyncStorage.setItem('cigarettesPerDay', count.toString());
    };

    const setPricePerPack = async (price: number) => {
        setPricePerPackState(price);
        await AsyncStorage.setItem('pricePerPack', price.toString());
    };

    const logCraving = async (intensity: number, trigger?: string) => {
        const newLog: CravingLog = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            intensity,
            trigger,
        };
        const updatedCravings = [newLog, ...cravings];
        setCravings(updatedCravings);
        await AsyncStorage.setItem('cravings', JSON.stringify(updatedCravings));
    };

    const addTask = async (task: Omit<Task, 'id' | 'isCustom'>) => {
        const newTask: Task = {
            ...task,
            id: Date.now().toString(),
            isCustom: true,
        };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        const updatedTasks = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
        setTasks(updatedTasks);
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const deleteTask = async (id: string) => {
        const updatedTasks = tasks.filter(t => t.id !== id);
        setTasks(updatedTasks);
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const completeTask = async (taskId: string) => {
        const completion: CompletedTask = {
            taskId,
            timestamp: new Date().toISOString(),
        };
        const updated = [completion, ...completedTasks];
        setCompletedTasks(updated);
        await AsyncStorage.setItem('completedTasks', JSON.stringify(updated));
    };

    const resetData = async () => {
        await AsyncStorage.clear();
        setQuitDateState(null);
        setCigarettesPerDayState(10);
        setPricePerPackState(10);
        setCravings([]);
        setTasks(DEFAULT_TASKS);
        setCompletedTasks([]);
    };

    return (
        <AppContext.Provider
            value={{
                quitDate,
                setQuitDate,
                cigarettesPerDay,
                setCigarettesPerDay,
                pricePerPack,
                setPricePerPack,
                cravings,
                logCraving,
                tasks,
                addTask,
                updateTask,
                deleteTask,
                completeTask,
                completedTasks,
                isLoading,
                resetData,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
