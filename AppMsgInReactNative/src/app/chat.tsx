
import { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Send, ChevronLeft } from 'lucide-react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

import { auth, db } from '@/firebaseConfig';

type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: Timestamp | null;
};

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams<{
    conversationId: string;
  }>();

  const router = useRouter();

  const userId = auth.currentUser?.uid;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef<FlatList<Message>>(null);

  // Écouter les messages en temps réel
  useEffect(() => {
    if (!conversationId || !userId) {
      setLoading(false);
      return;
    }

    const messagesRef = collection(
      db,
      'conversations',
      conversationId,
      'messages'
    );

    const messagesQuery = query(
      messagesRef,
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messagesList: Message[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            text: data.text,
            senderId: data.senderId,
            createdAt: data.createdAt ?? null,
          };
        });

        setMessages(messagesList);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading messages:', error);
        setLoading(false);
        Alert.alert('Error', 'Unable to load messages.');
      }
    );

    return unsubscribe;
  }, [conversationId, userId]);

  // Envoyer un message
  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim();

    if (!trimmedMessage || !conversationId || !userId || sending) {
      return;
    }

    try {
      setSending(true);

      const messagesRef = collection(
        db,
        'conversations',
        conversationId,
        'messages'
      );

      await addDoc(messagesRef, {
        text: trimmedMessage,
        senderId: userId,
        createdAt: serverTimestamp(),
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Unable to send message.');
    } finally {
      setSending(false);
    }
  };

  // Afficher un message
  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === userId;

    return (
      <View
        style={[
          styles.messageRow,
          isMyMessage ? styles.myMessageRow : styles.otherMessageRow,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessage : styles.otherMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMyMessage && styles.myMessageText,
            ]}
          >
            {item.text}
          </Text>

          {item.createdAt && (
            <Text
              style={[
                styles.messageTime,
                isMyMessage && styles.myMessageTime,
              ]}
            >
              {item.createdAt.toDate().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (!conversationId || !userId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text>Conversation not found or user not connected.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
            <View style={styles.headerSide}>
                <Pressable
                onPress={() => router.replace('/home')}
                hitSlop={15}
                style={styles.backButtonContainer}
                >
                    <ChevronLeft size={30} color="#5865F2" />
                </Pressable>
            </View>

            <View style={styles.headerCenter} pointerEvents="none">
                <Text style={styles.headerTitle}>Chat</Text>
            </View>

            <View style={styles.headerSide} />
        </View>

      {/* Contenu du chat */}
      <KeyboardAvoidingView
        style={styles.chatContent}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >

        {/* Messages */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#5865F2" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            style={styles.messagesList}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContainer}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No messages yet. Say hello!
              </Text>
            }
          />
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write a message..."
            placeholderTextColor="#999"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />

          <Pressable
            style={[
              styles.sendButton,
              (!newMessage.trim() || sending) && styles.disabledButton,
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator color="#5865F2" size="small" />
            ) : (
              <Send size={25} color="#5865F2" />
            )}
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header identique à Home
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  headerSide: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222222',
  },

  chatContent: {
    flex: 1,
  },

  messagesList: {
    flex: 1,
  },

  messagesContainer: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },

  messageRow: {
    width: '100%',
    marginVertical: 5,
    flexDirection: 'row',
  },

  myMessageRow: {
    justifyContent: 'flex-end',
  },

  otherMessageRow: {
    justifyContent: 'flex-start',
  },

  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  myMessage: {
    backgroundColor: '#5865F2',
    borderBottomRightRadius: 4,
  },

  otherMessage: {
    backgroundColor: '#EAEAEA',
    borderBottomLeftRadius: 4,
  },

  messageText: {
    fontSize: 16,
    color: '#222',
  },

  myMessageText: {
    color: '#FFFFFF',
  },

  messageTime: {
    fontSize: 10,
    color: '#777',
    textAlign: 'right',
    marginTop: 5,
  },

  myMessageTime: {
    color: '#DCEBFF',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 10,
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    backgroundColor: '#F2F2F2',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#222',
    textAlignVertical: 'center',
  },

  sendButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.5,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
  },
});
