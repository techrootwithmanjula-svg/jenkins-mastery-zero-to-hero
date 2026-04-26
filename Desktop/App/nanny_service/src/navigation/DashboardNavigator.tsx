import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardStackParamList } from './types';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import NannyListScreen from '../screens/Nanny/NannyListScreen';
import NannyDetailScreen from '../screens/Nanny/NannyDetailScreen';
import BookingScreen from '../screens/Booking/BookingScreen';
import BookingConfirmationScreen from '../screens/Booking/BookingConfirmationScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';
import AppointmentScheduleScreen from '../screens/Appointment/AppointmentScheduleScreen';
import { useAppTheme } from '../theme';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

const DashboardNavigator: React.FC = () => {
  const { theme } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="NannyList"
        component={NannyListScreen}
        options={{ title: 'Available Nannies' }}
      />
      <Stack.Screen
        name="NannyDetail"
        component={NannyDetailScreen}
        options={{ title: 'Nanny Details' }}
      />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Book Nanny' }} />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
        options={{ title: 'Booking Confirmed', headerBackVisible: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          title: 'Notifications',
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.onPrimary,
        }}
      />
      <Stack.Screen
        name="Appointments"
        component={AppointmentScheduleScreen}
        options={({ route }) => ({
          title:
            typeof route.params?.serviceTitle === 'string' && route.params.serviceTitle.trim()
              ? route.params.serviceTitle
              : 'Appointments',
        })}
      />
    </Stack.Navigator>
  );
};

export default DashboardNavigator;
