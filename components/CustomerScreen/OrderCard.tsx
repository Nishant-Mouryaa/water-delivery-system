import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const OrderCard = ({ item, index }: { item: any; index: number }) => (
  <View style={[styles.orderCard, index % 2 === 0 ? styles.evenCard : styles.oddCard]}>
    <View style={styles.orderCardHeader}>
      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={16} color="#666" />
        <Text style={styles.orderDate}>{item.dateOrdered}</Text>
      </View>
      <View style={[
        styles.statusBadge,
        item.received ? styles.deliveredBadge : styles.pendingBadge
      ]}>
        <Ionicons 
          name={item.received ? "checkmark-circle" : "time-outline"} 
          size={16} 
          color="white" 
        />
        <Text style={styles.statusBadgeText}>
          {item.received ? 'Delivered' : 'Pending'}
        </Text>
      </View>
    </View>
    
    <View style={styles.orderCardBody}>
      <View style={styles.orderDetailRow}>
        <View style={styles.orderDetailItem}>
          <Text style={styles.orderDetailLabel}>Quantity</Text>
          <Text style={styles.orderDetailValue}>{item.quantity}</Text>
        </View>
        <View style={styles.orderDetailItem}>
          <Text style={styles.orderDetailLabel}>Amount</Text>
          <Text style={styles.orderDetailValue}>₹{item.price}</Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  evenCard: {
    backgroundColor: '#fafbfc',
  },
  oddCard: {
    backgroundColor: '#ffffff',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  deliveredBadge: {
    backgroundColor: '#34C759',
  },
  pendingBadge: {
    backgroundColor: '#FF9500',
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  orderCardBody: {
    padding: 16,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  orderDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderDetailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
});

export default OrderCard;