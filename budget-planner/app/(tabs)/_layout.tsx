import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Define green theme colors
  // const themeColors = {
  //   light: {
  //     tint: '#white', // Green
  //     tabBarBackground: 'white', // Light green background
  //     tabBarInactiveTint: '#white', // Lighter green for inactive icons
  //   },
  //   dark: {
  //     tint: '#white', // Green
  //     tabBarBackground: '#white', // Dark green background
  //     tabBarInactiveTint: '#white', // Lighter green for inactive icons
  //   },
  // };


  return (
    <Tabs
      screenOptions={{
        tabBarAccessibilityLabel: 'Tab bar',
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarActiveBackgroundColor: 'green',
        tabBarInactiveBackgroundColor: 'green',


        tabBarStyle: {
          backgroundColor: 'green',
          height: 50,
          borderTopWidth: 0,
          shadowColor: 'black',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 15,

        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={'white'} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"

        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'person-circle' : 'person-circle-outline'}
              color={'white'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
