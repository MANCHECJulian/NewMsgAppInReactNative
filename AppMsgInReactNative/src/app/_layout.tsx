import { Stack } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './login';
import RegisterScreen from './register';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
