
import { useState } from 'react';

import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';

import { useRouter } from 'expo-router';

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from '@/firebaseConfig';

import { TextInput } from '@/components/text-input';
import { Button } from '@/components/button';

type SelectedUser = {
  id: string;
  email: string;
  username: string;
};

export default function AddUserScreen() {
  const [email, setEmail] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);

  const router = useRouter();

  // Ajouter un utilisateur à la liste
  const handleAddUser = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert('Error', 'Please enter an email address.');
      return;
    }

    try {
      setLoadingUser(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in.');
        return;
      }

      // Rechercher l'utilisateur
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', normalizedEmail)
      );

      const usersSnapshot = await getDocs(usersQuery);

      if (usersSnapshot.empty) {
        Alert.alert('Error', 'No user found with this email.');
        return;
      }

      const userDoc = usersSnapshot.docs[0];

      // Vérifier que ce n'est pas l'utilisateur connecté
      if (userDoc.id === currentUser.uid) {
        Alert.alert('Error', 'You cannot add yourself.');
        return;
      }

      // Vérifier que l'utilisateur n'est pas déjà sélectionné
      if (selectedUsers.some(user => user.id === userDoc.id)) {
        Alert.alert('Info', 'This user has already been added.');
        return;
      }

      // Ajouter l'utilisateur à la liste
      const userData = userDoc.data();

      const newUser: SelectedUser = {
        id: userDoc.id,
        email: userData.email,
        username: userData.username || userData.pseudo || userData.email,
      };

      setSelectedUsers(previous => [...previous, newUser]);

      setEmail('');

    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', 'Unable to find this user.');
    } finally {
      setLoadingUser(false);
    }
  };

  // Retirer un utilisateur de la liste
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(previous =>
      previous.filter(user => user.id !== userId)
    );
  };

  // Créer la conversation de groupe
  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Error', 'Please add at least one user.');
      return;
    }

    try {
      setLoadingConversation(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in.');
        return;
      }

      // Récupérer tous les UID des participants
      const participants = [
        currentUser.uid,
        ...selectedUsers.map(user => user.id),
      ];

      // Créer la conversation
      const conversationRef = await addDoc(
        collection(db, 'conversations'),
        {
          participants,
          createdAt: serverTimestamp(),
        }
      );

      // Redirection vers le chat
      router.replace({
        pathname: '/chat',
        params: {
          conversationId: conversationRef.id,
        },
      });

    } catch (error) {
      console.error('Error creating conversation:', error);

      Alert.alert(
        'Error',
        'Unable to create the conversation.'
      );
    } finally {
      setLoadingConversation(false);
    }
  };

  return (
    <View style={styles.container}>

      <Image
        style={styles.logo}
        source={require('@/assets/logo.png')}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        New conversation
      </Text>

      <Text style={styles.description}>
        Add the people you want to chat with.
      </Text>

      {/* Champ email et bouton d'ajout */}
      <View style={styles.addUserContainer}>
        <TextInput
          placeholder="Friend email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        <Button text={loadingUser ? '...' : 'Add'} type="secondary" onPress={handleAddUser}/>
      </View>

      {/* Liste des utilisateurs sélectionnés */}
      <Text style={styles.sectionTitle}>
        Participants ({selectedUsers.length})
      </Text>

      <ScrollView
        style={styles.usersList}
        keyboardShouldPersistTaps="handled"
      >
        {selectedUsers.length === 0 ? (
          <Text style={styles.emptyText}>
            No users added yet.
          </Text>
        ) : (
          selectedUsers.map(user => (
            <View key={user.id} style={styles.userItem}>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.username.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.username}>
                  {user.username}
                </Text>

                <Text style={styles.userEmail}>
                  {user.email}
                </Text>
              </View>

              {/* Bouton pour supprimer */}
              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemoveUser(user.id)}
              >
                <Text style={styles.removeButtonText}>
                  ×
                </Text>
              </Pressable>

            </View>
          ))
        )}
      </ScrollView>

      {/* Création de la conversation */}
      <Button
        text={
          loadingConversation
            ? 'Creating...'
            : 'Create new conversation'
        }
        type="primary"
        onPress={handleCreateConversation}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    backgroundColor: '#fff',
  },

  logo: {
    width: 150,
    height: 100,
    alignSelf: 'center',
    marginBottom: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#777',
    textAlign: 'center',
  },

  addUserContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 10,
  },

  addButton: {
    backgroundColor: '#5865F2',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 10,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  sectionTitle: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 8,
  },

  usersList: {
    flex: 1,
  },

  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
  },

  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#5865F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  userInfo: {
    flex: 1,
  },

  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  userEmail: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },

  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeButtonText: {
    fontSize: 22,
    color: '#E53935',
    lineHeight: 25,
  },
});
