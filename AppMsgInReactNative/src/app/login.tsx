// @ts-ignore React Native declarations require a newer moduleResolution setting.
import { StyleSheet, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

import { TextInput } from '@/components/text-input';
import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';

export default function LoginScreen() {
  return (
    <SafeAreaProvider style={styles.container}>
        <Image style={styles.logo} source={require('@/assets/logo.png')} />
      <SafeAreaView style={styles.formContainer}>
        <TextInput placeholder="username" />
        <TextInput placeholder="password" hide={true} />
        <Button text="Sign in" />
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
        marginBottom: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
});
