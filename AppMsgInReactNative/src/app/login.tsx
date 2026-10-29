// @ts-ignore React Native declarations require a newer moduleResolution setting.
import {
  StyleSheet,
  Image,
  Pressable,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';

import { TextInput } from '@/components/text-input';
import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';

// Firebase imports
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            console.log('Remplis tous les champs');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(
            auth,
            email.trim(),
            password
            );

            const user = userCredential.user;

            console.log('Connexion réussie !');
            console.log('UID :', user.uid);
            console.log('Email :', user.email);

            router.replace('/home');

        } catch (error: any) {
            console.log('Erreur Firebase :', error.code);

            switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                console.log('E-mail ou mot de passe incorrect');
                break;

            case 'auth/invalid-email':
                console.log('Adresse e-mail invalide');
                break;

            case 'auth/too-many-requests':
                console.log('Trop de tentatives. Réessaie plus tard.');
                break;

            default:
                console.log('Erreur de connexion :', error.message);
            }
        }
    };
    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formContainer}>
                <Image
                    style={styles.logo}
                    source={require('@/assets/logo.png')}
                    resizeMode="contain"
                />

                <TextInput
                    placeholder="email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholder="password"
                    placeholderTextColor="#999"
                    hide={true}
                    value={password}
                    onChangeText={setPassword}
                />

                <Button text="Sign in" onPress={handleLogin} />

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>
                    No account yet?
                    </Text>

                    <Pressable onPress={() => router.replace('/register')}>
                    <Text style={styles.loginLink}>
                        Create an account
                    </Text>
                    </Pressable>
                </View>

                <View style={styles.bottomContainer}>
                    <Checkbox text="Remember me" />
                </View>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30,
  },

  formContainer: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    gap: 20,
    flex: 1,
    justifyContent: 'center',
  },

  logo: {
    width: 150,
    height: 100,
    alignSelf: 'center',
    marginBottom: 12,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },

  loginText: {
    color: '#999999',
    fontWeight: '400',
    fontSize: 16,
  },

  loginLink: {
    color: '#5865F2',
    fontSize: 16,
    fontWeight: '400',
    borderBottomWidth: 1,
    borderBottomColor: '#5865F2',
  },

    bottomContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        paddingBottom: 20,
    },
});
