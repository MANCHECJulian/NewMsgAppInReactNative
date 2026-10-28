import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type ButtonProps = {
  text?: string;
  onPress?: () => void;
};

export function Button({ 
  text = 'Button',
  onPress
 }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5865F2',
    height: 80,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',

    // Android
    elevation: 4,

    // iOS
    shadowColor: '#5865F2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '500',
  },
});
