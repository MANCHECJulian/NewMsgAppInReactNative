// @ts-ignore React Native declarations require a newer moduleResolution setting.
import { StyleSheet, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';

import { TextInput } from '@/components/text-input';
import { Button } from '@/components/button';

// Firebase imports
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');

    const handleRegister = async () => {
        console.log('Registering with:', email, username, password, confirmationPassword);
        if (!email.trim() || !password || !confirmationPassword) {
            console.log('Veuillez remplir tous les champs');
            return;
        }

        if (password !== confirmationPassword) {
            console.log('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password
            );

            console.log('Compte créé !');
            console.log('UID :', userCredential.user.uid);
            console.log('Email :', userCredential.user.email);

            // Rediriger vers l'écran suivant si nécessaire

        } catch (error: any) {
            console.log('Erreur Firebase :', error.code);
            console.log('Détails :', error.message);
        }
    };
  return (
    <SafeAreaProvider style={styles.container}>
        <Image style={styles.logo} source={require('@/assets/logo.png')} />
      <SafeAreaView style={styles.formContainer}>
        <TextInput placeholder="your email" 
          value={email}
          onChangeText={setEmail}
        />
        <TextInput placeholder="new username" 
          value={username}
          onChangeText={setUsername}
        />
        <TextInput placeholder="new password" hide={true} 
          value={password}
          onChangeText={setPassword}
        />
        <TextInput placeholder="confirmation password" hide={true} 
          value={confirmationPassword}
          onChangeText={setConfirmationPassword}
        />
        <Button text="Create my account" onPress={handleRegister}/>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: '#999', fontWeight: '400', fontSize: 16, marginRight: 5 }}>
                Already have an account ?
            </Text>
            <Pressable onPress={() => router.replace('/login')}>
                <Text style={{ color: '#5865F2', fontSize: 16, fontWeight: '400', borderBottomWidth: 1, borderBottomColor: '#5865F2', }}>
                    Sign in
                </Text>
            </Pressable>
        </View>
      </SafeAreaView>
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
        marginBottom: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
});
