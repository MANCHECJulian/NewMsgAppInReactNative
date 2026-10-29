
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function AddUserScreen() {
  const [email, setEmail] = useState('');

  const handleCreateConversation = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return;
    }

    // Étape suivante :
    // rechercher l'utilisateur dans Firestore,
    // puis ouvrir ou créer sa conversation.
    console.log('Utilisateur à rechercher :', normalizedEmail);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un utilisateur</Text>

      <Text style={styles.description}>
        Saisis l'adresse e-mail de la personne avec laquelle
        tu souhaites discuter.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Adresse e-mail"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <Pressable
        style={styles.button}
        onPress={handleCreateConversation}
      >
        <Text style={styles.buttonText}>
          Créer une conversation
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#777',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#222',
  },
  button: {
    backgroundColor: '#5865F2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
