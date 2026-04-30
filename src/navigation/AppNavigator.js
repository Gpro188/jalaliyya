import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, ListOrdered, Search, Settings, Heart, Lock } from 'lucide-react-native';
import { ThemeContext } from '../context/ThemeContext';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import PdfViewerScreen from '../screens/PdfViewerScreen';
import CounterScreen from '../screens/CounterScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AdminLogin from '../screens/AdminLogin';
import AdminDashboard from '../screens/AdminDashboard';
import SplashScreen from '../screens/SplashScreen';

const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Admin Stack - MOVED UP to be available before use
function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminLogin" component={AdminLogin} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    </Stack.Navigator>
  );
}

// Stack Navigator for Home -> Category -> PDF
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="PdfViewer" component={PdfViewerScreen} options={({ route }) => ({
        title: route.params?.pdf?.category || 'PDF Viewer',
      })} />
    </Stack.Navigator>
  );
}

function BottomTabs() {
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.BACKGROUND,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: theme.NAVY,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.NAVY,
        tabBarInactiveTintColor: theme.NAVY + '80', // Add some transparency
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        }
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> 
        }} 
      />
      <Tab.Screen 
        name="CounterTab" 
        component={CounterScreen} 
        options={{ 
          title: 'Counter',
          tabBarIcon: ({ color, size }) => <ListOrdered color={color} size={size} /> 
        }} 
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchScreen} 
        options={{ 
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} /> 
        }} 
      />
    </Tab.Navigator>
  );
}

// Main Drawer Navigator wrapping the Bottom Tabs
function RootDrawer() {
  return (
    <Drawer.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
      <Drawer.Screen 
        name="MainTabs" 
        component={BottomTabs} 
        options={{ title: 'Home', drawerIcon: ({ color }) => <Home color={color} size={20} /> }} 
      />
      <Drawer.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ drawerIcon: ({ color }) => <Heart color={color} size={20} /> }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ drawerIcon: ({ color }) => <Settings color={color} size={20} /> }}
      />
      <Drawer.Screen 
        name="Admin" 
        component={AdminStack} 
        options={{ drawerIcon: ({ color }) => <Lock color={color} size={20} /> }}
      />
    </Drawer.Navigator>
  );
}

// Root Stack Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="MainApp" component={RootDrawer} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
