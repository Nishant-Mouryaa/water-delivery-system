import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const OrderCard = ({ item, index }: { item: any; index: number }) => (
  <View style={[styles.orderCard, index % 2 === 0 ? styles.evenCard : styles.oddCard]}>
    <View style={styles.orderContent}>
      <View style={styles.leftSection}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.orderDate}>{item.dateOrdered}</Text>
        </View>
      </View>
      
      <View style={styles.centerSection}>
        <Text style={styles.quantity}>Qty: {item.quantity}</Text>
        <Text style={styles.amount}>₹{item.price}</Text>
      </View>
      
      <View style={styles.rightSection}>
        <View style={[
          styles.statusBadge,
          item.received ? styles.deliveredBadge : styles.pendingBadge
        ]}>
          <Ionicons 
            name={item.received ? "checkmark-circle" : "time-outline"} 
            size={12} 
            color="white" 
          />
          <Text style={styles.statusText}>
            {item.received ? 'Delivered' : 'Pending'}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  evenCard: {
    backgroundColor: '#fafbfc',
  },
  oddCard: {
    backgroundColor: '#ffffff',
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  quantity: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveredBadge: {
    backgroundColor: '#34C759',
  },
  pendingBadge: {
    backgroundColor: '#FF9500',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
});

export default OrderCard;