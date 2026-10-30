
import { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useRouter } from 'expo-router';

import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

import { auth, db } from '@/firebaseConfig';

type Conversation = {
  id: string;
  participants: string[];
  otherUserPseudo: string;
  lastMessage: string;
  lastMessageDate: Timestamp | null;
};

export default function MessagesScreen() {
  const router = useRouter();

  const userId = auth.currentUser?.uid;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Récupérer toutes les conversations de l'utilisateur
    const conversationsQuery = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(
      conversationsQuery,
      async (snapshot) => {
        try {
          const conversationsList = await Promise.all(
            snapshot.docs.map(async (conversationDoc) => {
              const data = conversationDoc.data();

              // Récupérer l'UID de l'autre participant
              const otherUserId = data.participants.find(
                (id: string) => id !== userId
              );

              // Récupérer les informations du correspondant
              let otherUserPseudo = 'Unknown user';

              if (otherUserId) {
                const userSnapshot = await getDocs(
                  query(
                    collection(db, 'users'),
                    where('__name__', '==', otherUserId)
                  )
                );

                if (!userSnapshot.empty) {
                  otherUserPseudo =
                    userSnapshot.docs[0].data().username || 'Unknown user';
                }
              }

              // Récupérer le dernier message
              const messagesQuery = query(
                collection(
                  db,
                  'conversations',
                  conversationDoc.id,
                  'messages'
                ),
                orderBy('createdAt', 'desc'),
                limit(1)
              );

              const messagesSnapshot = await getDocs(messagesQuery);

              let lastMessage = 'No messages yet';
              let lastMessageDate: Timestamp | null = null;

              if (!messagesSnapshot.empty) {
                const messageData = messagesSnapshot.docs[0].data();

                lastMessage = messageData.text || '';
                lastMessageDate = messageData.createdAt || null;
              }

              return {
                id: conversationDoc.id,
                participants: data.participants,
                otherUserPseudo,
                lastMessage,
                lastMessageDate,
              };
            })
          );

          // Trier les conversations par date du dernier message
          conversationsList.sort((a, b) => {
            const dateA = a.lastMessageDate?.toMillis() || 0;
            const dateB = b.lastMessageDate?.toMillis() || 0;

            return dateB - dateA;
          });

          setConversations(conversationsList);
          setLoading(false);
        } catch (error) {
          console.error('Error loading conversations:', error);
          setLoading(false);
        }
      },
      (error) => {
        console.error('Firestore listener error:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  // Formater la date
  const formatDate = (date: Timestamp | null) => {
    if (!date) return '';

    const messageDate = date.toDate();
    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return messageDate.toLocaleDateString();
  };

  // Afficher une conversation
  const renderConversation = ({ item }: { item: Conversation }) => {
    return (
      <Pressable
        style={styles.conversation}
        onPress={() => {
          router.push({
            pathname: '/chat',
            params: {
              conversationId: item.id,
            },
          });
        }}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.otherUserPseudo.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.topRow}>
            <Text style={styles.userEmail} numberOfLines={1}>
              {item.otherUserPseudo}
            </Text>

            <Text style={styles.date}>
              {formatDate(item.lastMessageDate)}
            </Text>
          </View>

          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.centered}>
        <Text>You must be logged in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            You don't have any conversations yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  list: {
    paddingHorizontal: 16,
  },

  conversation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#5865F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '600',
  },

  conversationContent: {
    flex: 1,
    gap: 6,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  userEmail: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  date: {
    fontSize: 11,
    color: '#999',
  },

  lastMessage: {
    fontSize: 14,
    color: '#888',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
  },
});
