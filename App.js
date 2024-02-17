import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Test from "./Test";
import { useEffect } from "react";
import { function_NotificationsSetup } from "./EVERYTHING/BAGEL/Things";
import { AdminLogin } from "./SCREENS/AdminLogin";
import { AdminOrders } from "./SCREENS/AdminOrders";
import { AdminMenu } from "./SCREENS/AdminMenu";
import { AdminRewards } from "./SCREENS/AdminRewards";
import { AdminSales } from "./SCREENS/AdminSales";
import { AdminSettings } from "./SCREENS/AdminSettings";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    function_NotificationsSetup();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login-admin">
        <Stack.Screen
          name="login-admin"
          component={AdminLogin}
          options={{
            headerShown: false,
            animation: "fade",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="admin-orders"
          component={AdminOrders}
          options={{
            headerShown: false,
            animation: "fade",
            gestureEnabled: false,
          }}
        />
         <Stack.Screen
          name="admin-menu"
          component={AdminMenu}
          options={{
            headerShown: false,
            animation: "fade",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="admin-rewards"
          component={AdminRewards}
          options={{
            headerShown: false,
            animation: "fade",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="admin-sales"
          component={AdminSales}
          options={{
            headerShown: false,
            animation: "fade",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="admin-settings"
          component={AdminSettings}
          options={{
            headerShown: false,
            animation: "fade",
            gestureEnabled: false,
          }}
        />
        {/*  */}
        <Stack.Screen
          name="test"
          component={Test}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
