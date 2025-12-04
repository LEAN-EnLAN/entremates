import { Platform } from 'react-native';

let Notifications: any = null;

if (Platform.OS !== 'web') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
}

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'web') return;
    let token;
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        return;
    }
}

export async function scheduleNotification(title: string, body: string, hour: number, minute: number) {
    if (Platform.OS === 'web') return;
    await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: { hour, minute, repeats: true, channelId: 'default' },
    });
}

export async function scheduleInstantNotification(title: string, body: string) {
    if (Platform.OS === 'web') return;
    await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: null,
    });
}
