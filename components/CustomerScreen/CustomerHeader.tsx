import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomerHeader = ({ userName, onLogout }: { userName: string; onLogout: () => void }) => (
  <View style={styles.header}>
    <View>
      <Text style={styles.welcomeText}>Welcome back,</Text>
      <Text style={styles.userName}>{userName}</Text>
    </View>
    <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
      <Ionicons name="log-out-outline" size={20} color="white" />
      <Text style={styles.logoutButtonText}>Logout</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff3b30',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default CustomerHeader;