import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const CustomerInfoCard = ({
  userName,
  address,
  contact,
  paymentType,
}: {
  userName: string;
  address: string;
  contact: string;
  paymentType: string;
}) => (
  <View style={styles.infoCard}>
    <Text style={styles.cardTitle}>Customer Information</Text>
    <View style={styles.infoRow}>
      <Ionicons name="person-outline" size={18} color="#007AFF" />
      <Text style={styles.infoText}>{userName}</Text>
    </View>
    <View style={styles.infoRow}>
      <Ionicons name="location-outline" size={18} color="#007AFF" />
      <Text style={styles.infoText}>{address}</Text>
    </View>
    <View style={styles.infoRow}>
      <Ionicons name="call-outline" size={18} color="#007AFF" />
      <Text style={styles.infoText}>{contact}</Text>
    </View>
    <View style={styles.infoRow}>
      <Ionicons name="card-outline" size={18} color="#007AFF" />
      <Text style={styles.infoText}>{paymentType}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
});

export default CustomerInfoCard;