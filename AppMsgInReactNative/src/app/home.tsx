// @ts-ignore React Native declarations require a newer moduleResolution setting.
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';

import { auth, db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function HomeScreen() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
            setUsername('');
            setLoading(false);
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {
            setUsername(userDoc.data().username ?? '');
            }
        } catch (error) {
            console.error('Erreur de récupération du profil :', error);
        } finally {
            setLoading(false);
        }
        });

        return unsubscribe;
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <SafeAreaView edges={['top', 'bottom']}>
            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        <Text>Bienvenue {username} !</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  
});
