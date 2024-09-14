import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { MaterialCommunityIcons } from '@expo/vector-icons';
type CategoryItem = {
  id: number;
  item_name: string;
  item_description: string;
  item_value: number;
};
type Category = {
  id: number;
  name: string;
  color: string;
  icon: string;
  assigned_budget: number;
  item_count: number;
  CategoryItems: CategoryItem[];
};

type CirculatChartProps = {
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
};


const CirculatChart: React.FC<CirculatChartProps> = ({ categories }) => {
  const widthAndHeight = 150; // Size of the chart

  // Extract data for the pie chart

  const series = categories && categories.map(category => category.assigned_budget);
  const sliceColor = categories && categories.map(category => category.color || '#000000'); // Fallback color if null

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          Total Estimate: $ {series.reduce((acc, curr) => acc + curr, 0)}
        </Text>
        <PieChart
          coverRadius={0.6}
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={sliceColor}
        />
      </View>
      <View style={styles.labelContainer}>
        {categories && categories.map((category, index) => (
          <View key={category.id} style={styles.label}>
            <MaterialCommunityIcons
              name="checkbox-blank-circle"
              size={18}
              color={category.color || '#000000'}
              style={styles.icon}
            />
            <Text style={styles.labelText}>{category.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'space-around',
    marginLeft: 20,
    marginTop: 45,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  labelText: {
    color: '#333',
    fontSize: 17,
    fontFamily: 'Lato-Bold',
  },
});

export default CirculatChart;
