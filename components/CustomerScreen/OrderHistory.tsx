import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import MonthSelector from './MonthSelector';
import OrderCard from './OrderCard';

const OrderHistory = ({
  orderHistory,
  selectedMonth,
  monthsAvailable,
  onMonthChange,
}: {
  orderHistory: any[];
  selectedMonth: string;
  monthsAvailable: string[];
  onMonthChange: (month: string) => void;
}) => (
  <View style={styles.orderHistoryCard}>
    <View style={styles.orderHistoryHeader}>
      <Text style={styles.cardTitle}>Order History</Text>
      <MonthSelector
        selectedMonth={selectedMonth}
        monthsAvailable={monthsAvailable}
        onMonthChange={onMonthChange}
      />
    </View>

    <View style={styles.orderHistoryContent}>
      {orderHistory.length > 0 ? (
        <>
          {/* Order Cards Header */}
          <View style={styles.orderCardsHeader}>
            <View style={styles.headerSection}>
              <Text style={styles.headerText}>Date</Text>
            </View>
            <View style={styles.headerSection}>
              <Text style={styles.headerText}>Details</Text>
            </View>
            <View style={styles.headerSection}>
              <Text style={styles.headerText}>Status</Text>
            </View>
          </View>
          
          <FlatList
            data={orderHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => <OrderCard item={item} index={index} />}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No orders found for {selectedMonth}</Text>
          <Text style={styles.emptyStateSubtext}>Start placing orders to see them here</Text>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  orderHistoryContent: {
    padding: 16,
  },
  orderCardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  headerSection: {
    flex: 1,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
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
});

export default OrderHistory;