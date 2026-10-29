// @ts-ignore React Native declarations require a newer moduleResolution setting.
import { StyleSheet, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { useState } from 'react';

import { TextInput } from '@/components/text-input';
import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';

// Firebase imports
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

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

            // La navigation vers l'écran principal peut se faire ici.
            // router.replace('/contacts');

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
    <SafeAreaProvider style={styles.container}>
        <Image style={styles.logo} source={require('@/assets/logo.png')} />
      <SafeAreaView style={styles.formContainer}>
        <TextInput placeholder="email" 
          value={email}
          onChangeText={setEmail}
        />
        <TextInput placeholder="password" hide={true} 
          value={password}
          onChangeText={setPassword}
        />
        <Button text="Sign in" onPress={handleLogin} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: '#999', fontWeight: '400', fontSize: 16, marginRight: 5 }}>
                No account yet?
            </Text>
            <Pressable onPress={() => router.replace('/register')}>
                <Text style={{ color: '#5865F2', fontSize: 16, fontWeight: '400', borderBottomWidth: 1, borderBottomColor: '#5865F2', }}>
                    Create an account
                </Text>
            </Pressable>
        </View>
      </SafeAreaView>
      <View style={styles.bottomContainer}>
        <Checkbox text="Remember me" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        flex: 1,
        width: '90%',
        margin: 'auto',
        gap: 20,
    },
    logo: {
        width: 90,
        height: 70,
        justifyContent: 'center',
        alignSelf: 'center',   
    },
    bottomContainer: {
        width: '90%',
        marginBottom: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
});
