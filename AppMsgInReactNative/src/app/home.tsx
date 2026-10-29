
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';

import { Menu } from 'lucide-react-native';

import MessagesScreen from '@/components/home/MessagesScreen';
import AddUserScreen from '@/components/home/AddUserScreen';
import ProfileScreen from '@/components/home/ProfileScreen';
import SettingsScreen from '@/components/home/SettingsScreen';
import Sidebar from '@/components/sidebar';

export type HomeSection =
  | 'messages'
  | 'addUser'
  | 'profile'
  | 'settings';

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeScreen, setActiveScreen] =
    useState<HomeSection>('messages');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setUsername('');
          return;
        }

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

  const selectScreen = (screen: HomeSection) => {
    setActiveScreen(screen);
    setSidebarVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#5865F2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* En-tête permanent */}
        <View style={styles.header}>
            <Pressable
                onPress={() => setSidebarVisible(true)}
                style={styles.menuButton}
                hitSlop={10}
            >
                <Menu size={30} color="#5865F2" />
            </Pressable>

            <Text style={styles.headerTitle}>
                Bonjour {username || 'utilisateur'}
            </Text>
        </View>

      {/* Seul ce contenu change */}
      <View style={styles.content}>
        {activeScreen === 'messages' && <MessagesScreen />}

        {activeScreen === 'addUser' && <AddUserScreen />}

        {activeScreen === 'profile' && <ProfileScreen />}

        {activeScreen === 'settings' && <SettingsScreen />}
      </View>

      {/* La sidebar reste dans le layout principal */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onNavigate={selectScreen}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    menuButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#222222',
    },
    content: {
        flex: 1,
    },
});
