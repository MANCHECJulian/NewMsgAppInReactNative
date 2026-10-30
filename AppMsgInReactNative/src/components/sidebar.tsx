
import { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import {
  X,
  MessageCircle,
  Users,
  UserRound,
  Settings,
  LogOut,
} from 'lucide-react-native';

import type { HomeSection } from '@/app/home';

const SIDEBAR_WIDTH = Math.min(
  Dimensions.get('window').width * 0.8,
  320
);

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: HomeSection) => void;
};

export default function Sidebar({ 
    visible,
    onClose,
    onNavigate,
}: SidebarProps) {
  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(
      visible ? 0 : -SIDEBAR_WIDTH,
      { duration: 250 }
    );

    overlayOpacity.value = withTiming(
      visible ? 1 : 0,
      { duration: 250 }
    );
  }, [visible, translateX, overlayOpacity]);

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const navigate = (path: '/home' | '/contacts' | '/profile' | '/settings') => {
    onClose();
    router.replace(path as never);
  };

  const handleLogout = async () => {
    onClose();
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <View
      pointerEvents={visible ? 'auto' : 'none'}
      style={StyleSheet.absoluteFill}
    >
      {/* Fond sombre derrière la sidebar */}
      <Animated.View
        pointerEvents="none"
        style={[styles.overlay, overlayStyle]}
      />

      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        accessibilityLabel="Fermer le menu"
      />

      {/* Panneau latéral */}
      <Animated.View style={[styles.sidebar, sidebarStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>Mon application</Text>

          <Pressable onPress={onClose} hitSlop={10}>
            <X size={26} color="#222" />
          </Pressable>
        </View>

        <View style={styles.menu}>
          <Item
            icon={<MessageCircle size={22} color="#5865F2" />}
            label="Messages"
            onPress={() => onNavigate('messages')}
          />

          <Item
            icon={<Users size={22} color="#5865F2" />}
            label="Add contacts"
            onPress={() => onNavigate('addUser')}
          />

          <Item
            icon={<UserRound size={22} color="#5865F2" />}
            label="My profil"
            onPress={() => onNavigate('profile')}
          />

          <Item
            icon={<Settings size={22} color="#5865F2" />}
            label="Settings"
            onPress={() => onNavigate('settings')}
          />
        </View>

        <View style={styles.footer}>
          <Item
            icon={<LogOut size={22} color="#E5484D" />}
            label="Déconnexion"
            danger
            onPress={handleLogout}
          />
        </View>
      </Animated.View>
    </View>
  );
}

function Item({
  icon,
  label,
  onPress,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      {icon}
      <Text style={[styles.itemText, danger && styles.danger]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#FFFFFF',
    paddingTop: 55,
    paddingHorizontal: 18,
    paddingBottom: 24,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
  },
  menu: {
    paddingTop: 20,
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#222222',
  },
  danger: {
    color: '#E5484D',
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
});
