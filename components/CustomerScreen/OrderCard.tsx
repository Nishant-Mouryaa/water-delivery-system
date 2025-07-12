
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const OrderCard = ({ item, index }: { item: any; index: number }) => (
  <View style={[styles.orderCard, index % 2 === 0 ? styles.evenCard : styles.oddCard]}>
    <View style={styles.orderContent}>
      {/* Date */}
      <View style={styles.cell}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.orderDate}>{item.dateOrdered}</Text>
        </View>
      </View>
      
   
      
      {/* Quantity */}
      <View style={styles.cell}>
        <Text style={styles.quantity}>{item.quantity}</Text>
      </View>
      
      {/* Price */}
      <View style={styles.cell}>
        <Text style={styles.amount}>₹{item.price}</Text>
      </View>
      
      {/* Status */}
      <View style={styles.cell}>
        <View
          style={[
            styles.statusBadge,
            item.received ? styles.deliveredBadge : styles.pendingBadge,
          ]}
        >
          <Ionicons
            name={item.received ? 'checkmark-circle' : 'time-outline'}
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
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  quantity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
    marginLeft: 4,
  },
});

export default OrderCard;
