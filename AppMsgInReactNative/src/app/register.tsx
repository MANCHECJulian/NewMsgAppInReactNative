
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

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');

  const handleRegister = async () => {
    if (!email.trim() || !username.trim() || !password || !confirmationPassword) {
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

      console.log('Compte créé !', userCredential.user.uid);

      // Ajouter ici la sauvegarde du username si nécessaire.
      // Puis rediriger vers l'écran suivant.
    } catch (error: any) {
      console.log('Erreur Firebase :', error.code, error.message);
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
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Image
              style={styles.logo}
              source={require('@/assets/logo.png')}
              resizeMode="contain"
            />

            <TextInput
              placeholder="your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="new username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              placeholder="new password"
              placeholderTextColor="#999"
              hide={true}
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              placeholder="confirmation password"
              placeholderTextColor="#999"
              hide={true}
              value={confirmationPassword}
              onChangeText={setConfirmationPassword}
            />

            <Button
              text="Create my account"
              onPress={handleRegister}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?
              </Text>

              <Pressable onPress={() => router.replace('/login')}>
                <Text style={styles.loginLink}>
                  Sign in
                </Text>
              </Pressable>
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
    flexGrow: 0,
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
});
