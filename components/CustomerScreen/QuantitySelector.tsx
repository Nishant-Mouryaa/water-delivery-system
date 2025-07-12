import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) => (
  <View style={styles.quantityCard}>
    <Text style={styles.cardTitle}>Place New Order</Text>
    <Text style={styles.quantityLabel}>Select quantity:</Text>
    <View style={styles.quantityContainer}>
      <TouchableOpacity style={styles.quantityButton} onPress={onDecrease}>
        <Ionicons name="remove" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.quantityDisplay}>
        <Text style={styles.quantityText}>{quantity}</Text>
        <Text style={styles.quantityUnit}>items</Text>
      </View>
      <TouchableOpacity style={styles.quantityButton} onPress={onIncrease}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
    
    <View style={styles.pricePreview}>
      <Text style={styles.pricePreviewText}>Total: ₹{quantity * 35}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
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
});

export default QuantitySelector;