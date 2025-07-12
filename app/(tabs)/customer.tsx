import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { OrderHistoryItem, OrderService } from '../../components/OrderService';
import { app, db } from '../../firebaseConfig';

const { width: screenWidth } = Dimensions.get('window');

const CustomerScreen: React.FC = () => {
  const router = useRouter();
  const auth = getAuth(app);

  // User data
  const [userName, setUserName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  // Quantity
  const [quantity, setQuantity] = useState<number>(1);

  // Month
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
  const [monthsAvailable, setMonthsAvailable] = useState<string[]>([]);
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);

  // Order history data
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);

  // Financial info
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [oldOutstanding, setOldOutstanding] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  // Calculate total from orderHistory data
  const totalAmount = orderHistory.reduce((acc, cur) => acc + cur.price, 0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.username || '');
            
            // Build the address string from the nested objects
            const building = userData.buildingInfo || {};
            const location = userData.locationInfo || {};
            const addressString = [
              building.name,
              building.wing,
              building.flatNo,
              building.number,
              location.locality,
              location.area
            ].filter(Boolean).join(', ');
            
            setAddress(addressString);
            setContact(userData.mobile || '');
            setPaymentType(userData.paymentType || 'Online');
            setUserId(auth.currentUser.uid);
            
            // Fetch financial info
            setAdvancePaid(userData.advancePaid || 0);
            setOldOutstanding(userData.oldOutstanding || 0);
            setBalance(userData.balance || 0);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [auth.currentUser]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (userId) {
        try {
          console.log('🔍 Fetching order history for user:', userId);
          console.log('📅 Selected month:', selectedMonth);
          
          // First get available months
          const months = await OrderService.getAvailableMonths(userId);
          console.log('📊 Available months:', months);
          setMonthsAvailable(months);

          // Then fetch orders for selected month
          const currentYear = new Date().getFullYear();
          console.log('📅 Current year:', currentYear);
          
          // Try current year first, then 2024 (where our sample data is)
          let orders = await OrderService.getUserOrdersByMonth(userId, selectedMonth, currentYear);
          if (orders.length === 0 && currentYear === 2025) {
            console.log('🔄 No orders found for 2025, trying 2024...');
            orders = await OrderService.getUserOrdersByMonth(userId, selectedMonth, 2024);
          }
          console.log('📦 Orders fetched:', orders.length);
          console.log('📋 Order details:', orders);
          
          // If no orders found, try to get all orders for debugging
          if (orders.length === 0) {
            console.log('🔍 No orders found for month, trying to get all orders...');
            try {
              const allOrders = await OrderService.getUserOrders(userId);
              console.log('📊 All orders for user:', allOrders.length);
              console.log('📋 All order details:', allOrders);
            } catch (error) {
              console.error('❌ Error fetching all orders:', error);
            }
          }
          
          setOrderHistory(orders);
        } catch (error) {
          console.error('❌ Error fetching order history:', error);
          Alert.alert('Error', 'Failed to fetch order history. Please try again.');
        }
      }
    };

    fetchOrderHistory();
  }, [userId, selectedMonth]);

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

  const handleOrderNow = async () => {
    try {
      if (!userId) return;
      
      const orderData = {
        quantity,
        price: 35, // Price per item
        paymentMethod: paymentType,
        advancePaid: 0,
        notes: `Order placed by ${userName}`
      };

      await OrderService.createOrder(userId, orderData);
      
      // Update balance
      const newBalance = balance + (quantity * 35);
      await updateUserBalance(newBalance);
      
      Alert.alert('Order Placed', `Order placed for ${quantity} items`);
      setQuantity(1);
      
      // Refresh order history
      const currentYear = new Date().getFullYear();
      const orders = await OrderService.getUserOrdersByMonth(userId, selectedMonth, currentYear);
      setOrderHistory(orders);
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  const updateUserBalance = async (newBalance: number) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        balance: newBalance
      });
      setBalance(newBalance);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const handleReminder = () => {
    Alert.alert('Reminder Set', 'You will be reminded about your order');
  };

  const handlePayNow = () => {
    Alert.alert('Payment', 'Payment initiated successfully');
  };

  const MonthSelector = () => (
    <View style={styles.monthSelectorContainer}>
      <TouchableOpacity
        style={styles.monthSelectorButton}
        onPress={() => setShowMonthPicker(!showMonthPicker)}
      >
        <Text style={styles.monthSelectorText}>{selectedMonth}</Text>
        <Ionicons 
          name={showMonthPicker ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666" 
        />
      </TouchableOpacity>
      
      {showMonthPicker && (
        <View style={styles.monthDropdown}>
          <ScrollView style={styles.monthScrollView}>
            {monthsAvailable.map(month => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthOption,
                  selectedMonth === month && styles.selectedMonthOption
                ]}
                onPress={() => {
                  setSelectedMonth(month);
                  setShowMonthPicker(false);
                }}
              >
                <Text style={[
                  styles.monthOptionText,
                  selectedMonth === month && styles.selectedMonthOptionText
                ]}>
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const OrderCard = ({ item, index }: { item: OrderHistoryItem; index: number }) => (
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Customer Info Card */}
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

        {/* Quantity Selector */}
        <View style={styles.quantityCard}>
          <Text style={styles.cardTitle}>Place New Order</Text>
          <Text style={styles.quantityLabel}>Select quantity:</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
              <Ionicons name="remove" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Text style={styles.quantityUnit}>items</Text>
            </View>
            <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.pricePreview}>
            <Text style={styles.pricePreviewText}>Total: ₹{quantity * 35}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.orderNowButton} onPress={handleOrderNow}>
            <Ionicons name="basket-outline" size={20} color="white" />
            <Text style={styles.orderNowButtonText}>Order Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reminderButton} onPress={handleReminder}>
            <Ionicons name="notifications-outline" size={20} color="white" />
            <Text style={styles.reminderButtonText}>Set Reminder</Text>
          </TouchableOpacity>
        </View>

        {/* Order History */}
        <View style={styles.orderHistoryCard}>
          <View style={styles.orderHistoryHeader}>
            <Text style={styles.cardTitle}>Order History</Text>
            <MonthSelector />
          </View>

          <View style={styles.orderHistoryContent}>
            {orderHistory.length > 0 ? (
              <FlatList
                data={orderHistory}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => <OrderCard item={item} index={index} />}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>No orders found for {selectedMonth}</Text>
                <Text style={styles.emptyStateSubtext}>Start placing orders to see them here</Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment Summary */}
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

          <TouchableOpacity style={styles.payNowButton} onPress={handlePayNow}>
            <Ionicons name="card-outline" size={20} color="white" />
            <Text style={styles.payNowButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
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
  
  // Card Styles
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

  // Quantity Card
  quantityCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    width: 48,
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityDisplay: {
    marginHorizontal: 32,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
  },
  quantityUnit: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  pricePreview: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  pricePreviewText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  orderNowButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  orderNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  reminderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    borderRadius: 12,
    marginLeft: 8,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  reminderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Order History Card
  orderHistoryCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  orderHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderHistoryContent: {
    padding: 16,
  },

  // Month Selector
  monthSelectorContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  monthSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 140,
  },
  monthSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
    flex: 1,
  },
  monthDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1001,
  },
  monthScrollView: {
    maxHeight: 200,
  },
  monthOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedMonthOption: {
    backgroundColor: '#007AFF',
  },
  monthOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedMonthOptionText: {
    color: 'white',
    fontWeight: '600',
  },

  // Order Cards
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

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  // Payment Card
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

export default CustomerScreen;