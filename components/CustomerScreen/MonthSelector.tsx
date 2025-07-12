import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MonthSelector = ({
  selectedMonth,
  monthsAvailable,
  onMonthChange,
}: {
  selectedMonth: string;
  monthsAvailable: string[];
  onMonthChange: (month: string) => void;
}) => {
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  return (
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
                  onMonthChange(month);
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
};

const styles = StyleSheet.create({
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
});

export default MonthSelector;