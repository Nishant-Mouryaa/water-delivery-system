import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import ActionButtons from '../../components/CustomerScreen/ActionButtons';
import CustomerHeader from '../../components/CustomerScreen/CustomerHeader';
import CustomerInfoCard from '../../components/CustomerScreen/CustomerInfoCard';
import OrderHistory from '../../components/CustomerScreen/OrderHistory';
import PaymentSummary from '../../components/CustomerScreen/PaymentSummary';
import QuantitySelector from '../../components/CustomerScreen/QuantitySelector';
import { OrderHistoryItem, OrderService } from '../../components/OrderService';
import { app, db } from '../../firebaseConfig';

const CustomerScreen: React.FC = () => {
  const router = useRouter();
  const auth = getAuth(app);

  // State management
  const [userName, setUserName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
  const [monthsAvailable, setMonthsAvailable] = useState<string[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [oldOutstanding, setOldOutstanding] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  const totalAmount = orderHistory.reduce((acc, cur) => acc + cur.price, 0);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.username || '');
            
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

  // Fetch order history
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (userId) {
        try {
          const months = await OrderService.getAvailableMonths(userId);
          setMonthsAvailable(months);

          const currentYear = new Date().getFullYear();
          let orders = await OrderService.getUserOrdersByMonth(userId, selectedMonth, currentYear);
          if (orders.length === 0 && currentYear === 2025) {
            orders = await OrderService.getUserOrdersByMonth(userId, selectedMonth, 2024);
          }
          
          setOrderHistory(orders);
        } catch (error) {
          console.error('Error fetching order history:', error);
        }
      }
    };
    fetchOrderHistory();
  }, [userId, selectedMonth]);

  // Handlers
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/(auth)/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleOrderNow = async () => {
    try {
      if (!userId) return;
      
      const orderData = {
        quantity,
        price: 35,
        paymentMethod: paymentType,
        advancePaid: 0,
        notes: `Order placed by ${userName}`
      };

      await OrderService.createOrder(userId, orderData);
      
      const newBalance = balance + (quantity * 35);
      await updateDoc(doc(db, 'users', userId), { balance: newBalance });
      setBalance(newBalance);
      
      setQuantity(1);
      const currentYear = new Date().getFullYear();
      const orders = await OrderService.getUserOrdersByMonth(userId, selectedMonth, currentYear);
      setOrderHistory(orders);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleReminder = () => {
    console.log('Reminder set');
  };

  const handlePayNow = () => {
    console.log('Payment initiated');
  };

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: 'white' }}
      contentContainerStyle={{ backgroundColor: 'white' }}
    >
      <CustomerHeader userName={userName} onLogout={handleLogout} />
      <CustomerInfoCard
        userName={userName}
        address={address}
        contact={contact}
        paymentType={paymentType}
      />
      <QuantitySelector
        quantity={quantity}
        onIncrease={() => setQuantity(q => q + 1)}
        onDecrease={() => setQuantity(q => (q > 1 ? q - 1 : 1))}
      />
      <ActionButtons
        onOrderNow={handleOrderNow}
        onSetReminder={handleReminder}
      />
      <OrderHistory
        orderHistory={orderHistory}
        selectedMonth={selectedMonth}
        monthsAvailable={monthsAvailable}
        onMonthChange={setSelectedMonth}
      />
      <PaymentSummary
        advancePaid={advancePaid}
        oldOutstanding={oldOutstanding}
        balance={balance}
        totalAmount={totalAmount}
        onPayNow={handlePayNow}
      />
    </ScrollView>
  );
};

export default CustomerScreen;