import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
} 