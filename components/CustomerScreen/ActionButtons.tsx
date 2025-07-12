import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ActionButtons = ({
  onOrderNow,
  onSetReminder,
}: {
  onOrderNow: () => void;
  onSetReminder: () => void;
}) => (
  <View style={styles.actionButtonsContainer}>
    <TouchableOpacity style={styles.orderNowButton} onPress={onOrderNow}>
      <Ionicons name="basket-outline" size={20} color="white" />
      <Text style={styles.orderNowButtonText}>Order Now</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.reminderButton} onPress={onSetReminder}>
      <Ionicons name="notifications-outline" size={20} color="white" />
      <Text style={styles.reminderButtonText}>Set Reminder</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
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
});

export default ActionButtons;