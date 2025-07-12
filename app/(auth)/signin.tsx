import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { app, db } from '../../firebaseConfig';

const LoginScreen: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const auth = getAuth(app);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Check if identifier is username or phone
      const isPhone = /^[\d+]{10,}$/.test(identifier);
      
      // Step 2: Look up the corresponding email in Firestore
      let emailToUse = '';
      let userId = '';
      
      if (isPhone) {
        // Search by phone number
        const formattedPhone = formatPhoneNumber(identifier);
        const phoneQuery = await getDoc(doc(db, 'phoneMappings', formattedPhone));
        if (phoneQuery.exists()) {
          emailToUse = phoneQuery.data().email;
          userId = phoneQuery.data().userId;
        }
      } else {
        // Search by username
        const usernameQuery = await getDoc(doc(db, 'usernameMappings', identifier));
        if (usernameQuery.exists()) {
          emailToUse = usernameQuery.data().email;
          userId = usernameQuery.data().userId;
        }
      }
      
      if (!emailToUse) {
        throw new Error('User not found');
      }

      // Step 3: Authenticate with Firebase using the mapped email
      const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
      
      // Login successful - redirect to customer screen
      router.replace('/(tabs)/customer');
      
    } catch (e: any) {
      setError(e.message || 'Authentication failed');
      Alert.alert('Error', 'Invalid credentials or user not found');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (input: string): string => {
    // Basic phone number formatting
    if (input.startsWith('+')) return input;
    return `+${input}`; // Default international format
  };

  const navigateToSignUp = () => {
    router.push('/(auth)/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back!</Text>
        
        {/* Username or Phone Input */}
        <View style={[styles.inputContainer, { marginTop: 30 }]}>
          <MaterialCommunityIcons name="account-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username or Phone Number"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            keyboardType="default"
            autoFocus={true}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCapitalize="none"
            onSubmitEditing={handleLogin} // Allow login on keyboard submit
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.disabledButton]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Create An Account Link */}
        <View style={styles.bottomLinkRow}>
          <Text style={styles.bottomLinkText}>Don't have an account?</Text>
          <TouchableOpacity onPress={navigateToSignUp}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#00b0ff',
    borderRadius: 8,
    paddingVertical: 15,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#99d6ff',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
  bottomLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  bottomLinkText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  linkText: {
    color: '#00b0ff',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default LoginScreen;