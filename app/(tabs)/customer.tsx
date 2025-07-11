import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface OrderHistoryData {
  id: string;
  dateOrdered: string;
  received: boolean;
  quantity: number;
  price: number;
}

const CustomerScreen: React.FC = () => {
  const router = useRouter();
  const auth = getAuth();

  // Example user data
  const [userName] = useState<string>('Nishant');
  const [address] = useState<string>(
    'Daffodil C/103, Yashwant Nagar, Virar West 401303'
  );
  const [contact] = useState<string>('8552964526');
  const [paymentType] = useState<string>('Online');

  // Quantity
  const [quantity, setQuantity] = useState<number>(1);

  // Month
  const [selectedMonth, setSelectedMonth] = useState<string>('June');

  // Order history data (example)
  const [orderHistory] = useState<OrderHistoryData[]>([
    { id: '1', dateOrdered: '1 June 2025', received: true, quantity: 1, price: 35 },
    { id: '2', dateOrdered: '1 June 2025', received: true, quantity: 2, price: 70 },
    { id: '3', dateOrdered: '1 June 2025', received: true, quantity: 1, price: 35 },
  ]);

  // Financial info (example)
  const [advancePaid] = useState<number>(100);
  const [oldOutstanding] = useState<number>(100);
  const [balance] = useState<number>(340);

  // Calculate total from orderHistory data
  const totalAmount = orderHistory.reduce((acc, cur) => acc + cur.price, 0);

  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/signin');
    } catch (error) {
      Alert.alert('Logout Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleOrderNow = () => {
    Alert.alert('Order Placed', `Order placed for ${quantity} items`);
  };

  const handleReminder = () => {
    Alert.alert('Reminder Set', 'You will be reminded about your order');
  };

  const handlePayNow = () => {
    Alert.alert('Payment', 'Payment initiated successfully');
  };

  const renderOrderItem = ({ item }: { item: OrderHistoryData }) => (
    <View style={styles.orderRow}>
      <Text style={styles.orderCell}>{item.dateOrdered}</Text>
      <Text style={styles.orderCell}>{item.received ? 'Yes' : 'No'}</Text>
      <Text style={styles.orderCell}>{item.quantity}</Text>
      <Text style={styles.orderCell}>Rs {item.price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Logout Button */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Welcome {userName}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Customer Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Name: </Text>
          {userName} Mourya
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Address: </Text>
          {address}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Contact: </Text>
          {contact}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Payment Type: </Text>
          {paymentType}
        </Text>
      </View>

      {/* Quantity Selector */}
      <Text style={styles.sectionTitle}>Select the quantity to order:</Text>
      <View style={styles.quantityRow}>
        <TouchableOpacity style={styles.qtyButton} onPress={increaseQuantity}>
          <Text style={styles.qtyButtonText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity style={styles.qtyButton} onPress={decreaseQuantity}>
          <Text style={styles.qtyButtonText}>-</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.orderButton]}
          onPress={handleOrderNow}
        >
          <Text style={styles.actionButtonText}>Order Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.reminderButton]}
          onPress={handleReminder}
        >
          <Text style={styles.actionButtonText}>Reminder</Text>
        </TouchableOpacity>
      </View>

      {/* Order History */}
      <View style={styles.orderHistoryContainer}>
        <View style={styles.orderHistoryHeaderRow}>
          <Text style={styles.orderHistoryHeaderText}>June Order History</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              style={styles.pickerStyle}
            >
              <Picker.Item label="June" value="June" />
              <Picker.Item label="July" value="July" />
              <Picker.Item label="August" value="August" />
            </Picker>
          </View>
        </View>

        {/* Table header */}
        <View style={[styles.orderRow, styles.orderRowHeader]}>
          <Text style={[styles.orderCell, styles.headerCell]}>Date Ordered</Text>
          <Text style={[styles.orderCell, styles.headerCell]}>Received</Text>
          <Text style={[styles.orderCell, styles.headerCell]}>Quantity</Text>
          <Text style={[styles.orderCell, styles.headerCell]}>Price</Text>
        </View>

        {/* FlatList for order entries */}
        <FlatList
          data={orderHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
        />
      </View>

      {/* Payment Info */}
      <View style={styles.paymentInfoContainer}>
        <Text style={styles.paymentInfoText}>Advance Paid : {advancePaid}rs</Text>
        <Text style={styles.paymentInfoText}>
          Old Outstanding dues : {oldOutstanding}rs
        </Text>
        <Text style={styles.paymentInfoText}>Your Balance : {balance}rs</Text>
        <Text style={styles.totalLabel}>Total : {totalAmount}</Text>

        <TouchableOpacity style={styles.payNowButton} onPress={handlePayNow}>
          <Text style={styles.payNowButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  infoCard: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  infoText: {
    fontSize: 14,
    marginVertical: 2,
  },
  label: {
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  qtyButton: {
    width: 44,
    height: 44,
    backgroundColor: '#007aff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  qtyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    marginRight: 12,
    alignItems: 'center',
  },
  orderButton: {
    backgroundColor: '#00b0ff',
  },
  reminderButton: {
    backgroundColor: '#ffaa00',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  orderHistoryContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    elevation: 1,
  },
  orderHistoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderHistoryHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerStyle: {
    height: 40,
    width: 120,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderRowHeader: {
    backgroundColor: '#f3f3f3',
    borderBottomWidth: 1,
  },
  orderCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  headerCell: {
    fontWeight: '600',
  },
  paymentInfoContainer: {
    marginBottom: 16,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  paymentInfoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
  },
  payNowButton: {
    width: 160,
    backgroundColor: '#00b0ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  payNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomerScreen;