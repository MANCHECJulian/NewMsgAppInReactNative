import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type ButtonProps = {
  text?: string;
  type?: 'primary' | 'secondary';
  onPress?: () => void;
};

export function Button({
  text = 'Button',
  type = 'primary',
  onPress
}: ButtonProps) {

  const buttonStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
  };

  const textStyles = {
    primary: styles.primaryText,
    secondary: styles.secondaryText,
  };

  return (
    <TouchableOpacity
      style={buttonStyles[type]}
      onPress={onPress}
    >
      <Text style={textStyles[type]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: {
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
  secondary: {
    backgroundColor: '#fff',
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

  primaryText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '500',
  },
  secondaryText: {
    color: '#5865F2',
    fontSize: 25,
    fontWeight: '500',
  },
});
