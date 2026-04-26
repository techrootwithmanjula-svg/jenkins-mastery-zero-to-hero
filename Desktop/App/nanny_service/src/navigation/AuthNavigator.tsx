import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import LoginScreen from '../screens/Auth/LoginScreen';
import OtpVerifyScreen from '../screens/Auth/OtpVerifyScreen';
import { useAppTheme } from '../theme';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const { theme } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="OtpVerify"
        component={OtpVerifyScreen}
        options={{ title: 'Verify OTP' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
