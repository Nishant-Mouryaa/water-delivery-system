import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { app, db } from '../../firebaseConfig';
// Custom Checkbox Component
const CustomCheckbox = ({
  value,
  onValueChange,
  label,
}: {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  label: string;
}) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onValueChange(!value)}
    >
      <View style={[styles.checkbox, value && styles.checked]}>
        {value && <View style={styles.checkmark} />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const SignUpScreen: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    mobile: '',
    password: '',
    buildingName: '',
    buildingNo: '',
    wing: '',
    flatNo: '',
    location: '',
    locality: '',
    paymentType: ''
  });
  const [isBisleriSelected, setBisleriSelected] = useState(false);
  const [isNormalSelected, setNormalSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth(app);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onRegister = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.username || !formData.mobile || !formData.password) {
        throw new Error('Username, mobile and password are required');
      }

      // Generate a unique email for Firebase auth
      const generatedEmail = `${formData.username}@${formData.mobile}.yourapp.com`;
      
      // 1. Create auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        generatedEmail, 
        formData.password
      );
      
      // 2. Save additional user data to Firestore
      const userDoc = {
        username: formData.username,
        mobile: formData.mobile,
        buildingInfo: {
          name: formData.buildingName,
          number: formData.buildingNo,
          wing: formData.wing,
          flatNo: formData.flatNo
        },
        locationInfo: {
          area: formData.location,
          locality: formData.locality
        },
        paymentType: formData.paymentType,
        products: {
          bisleri: isBisleriSelected,
          normal: isNormalSelected
        },
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);

      // 3. Create username and phone mappings for login
      await setDoc(doc(db, 'usernameMappings', formData.username), {
        email: generatedEmail,
        userId: userCredential.user.uid
      });

      await setDoc(doc(db, 'phoneMappings', formData.mobile), {
        email: generatedEmail,
        userId: userCredential.user.uid
      });

      // Success
      Alert.alert('Registration Successful', 'Your account has been created!');
      router.push('/(tabs)/customer'); // Navigate to main app

    } catch (e: any) {
      setError(e.message);
      Alert.alert('Registration Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingVertical: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create an account</Text>

      {/* Username */}
      <TextInput
        style={styles.input}
        placeholder="Username *"
        value={formData.username}
        onChangeText={(text) => handleInputChange('username', text)}
        autoCapitalize="none"
      />

      {/* Mobile Number */}
      <TextInput
        style={styles.input}
        placeholder="Mobile No. *"
        keyboardType="phone-pad"
        value={formData.mobile}
        onChangeText={(text) => handleInputChange('mobile', text)}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password *"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleInputChange('password', text)}
      />

      {/* Address Section */}
      <Text style={styles.sectionHeader}>Address Information</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Building Name"
        value={formData.buildingName}
        onChangeText={(text) => handleInputChange('buildingName', text)}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Building No"
          value={formData.buildingNo}
          onChangeText={(text) => handleInputChange('buildingNo', text)}
        />
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Wing"
          value={formData.wing}
          onChangeText={(text) => handleInputChange('wing', text)}
        />
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Flat No."
          value={formData.flatNo}
          onChangeText={(text) => handleInputChange('flatNo', text)}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Location"
          value={formData.location}
          onChangeText={(text) => handleInputChange('location', text)}
        />
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Locality"
          value={formData.locality}
          onChangeText={(text) => handleInputChange('locality', text)}
        />
      </View>

      {/* Payment Type */}
      <TextInput
        style={styles.input}
        placeholder="Payment Type"
        value={formData.paymentType}
        onChangeText={(text) => handleInputChange('paymentType', text)}
      />

      {/* Product Selection */}
      <Text style={styles.sectionHeader}>Product Preferences</Text>
      <View style={styles.checkboxRow}>
        <CustomCheckbox
          value={isBisleriSelected}
          onValueChange={setBisleriSelected}
          label="Bisleri"
        />
        <CustomCheckbox
          value={isNormalSelected}
          onValueChange={setNormalSelected}
          label="Normal"
        />
      </View>

      <Text style={styles.agreementText}>
        By registering, you agree to our Terms of Service
      </Text>

      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]} 
        onPress={onRegister} 
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.loginRow}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
          <Text style={styles.linkText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Updated styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 10,
    color: '#333',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#444',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  smallInput: {
    flex: 1,
    marginRight: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  agreementText: {
    fontSize: 12,
    marginBottom: 16,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00b0ff',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#99d6ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    color: '#00b0ff',
    fontWeight: '500',
    marginLeft: 5,
  },
 
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#00b0ff',
    borderColor: '#00b0ff',
  },
  checkmark: {
    width: 12,
    height: 6,
    borderColor: '#fff',
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '-45deg' }],
    marginBottom: 2,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
});

export default SignUpScreen;