import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PaymentSummary = ({
  advancePaid,
  oldOutstanding,
  balance,
  totalAmount,
  onPayNow,
}: {
  advancePaid: number;
  oldOutstanding: number;
  balance: number;
  totalAmount: number;
  onPayNow: () => void;
}) => (
  <View style={styles.paymentCard}>
    <Text style={styles.cardTitle}>Payment Summary</Text>
    
    <View style={styles.paymentRow}>
      <Text style={styles.paymentLabel}>Advance Paid</Text>
      <Text style={styles.paymentValue}>₹{advancePaid}</Text>
    </View>
    
    <View style={styles.paymentRow}>
      <Text style={styles.paymentLabel}>Outstanding Dues</Text>
      <Text style={[styles.paymentValue, styles.outstandingValue]}>₹{oldOutstanding}</Text>
    </View>
    
    <View style={styles.paymentRow}>
      <Text style={styles.paymentLabel}>Current Balance</Text>
      <Text style={[styles.paymentValue, styles.balanceValue]}>₹{balance}</Text>
    </View>
    
    <View style={styles.paymentDivider} />
    
    <View style={styles.paymentRow}>
      <Text style={styles.totalLabel}>Monthly Total</Text>
      <Text style={styles.totalValue}>₹{totalAmount}</Text>
    </View>

    <TouchableOpacity style={styles.payNowButton} onPress={onPayNow}>
      <Ionicons name="card-outline" size={20} color="white" />
      <Text style={styles.payNowButtonText}>Pay Now</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  paymentCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 32,
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
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#666',
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  outstandingValue: {
    color: '#FF3B30',
  },
  balanceValue: {
    color: '#007AFF',
  },
  paymentDivider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  payNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  payNowButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PaymentSummary;