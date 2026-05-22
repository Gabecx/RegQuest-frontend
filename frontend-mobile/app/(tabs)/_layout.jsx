import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "none",
        tabBarStyle: {
          backgroundColor: "#E9F2FF",
          borderTopWidth: 0,
          height: 100,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: "#00007F",
        tabBarInactiveTintColor: "#00007F",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="request"
        options={{
          title: "Request",
          href: user?.role === 'student' ? '/(tabs)/request' : null,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "file-check" : "file-check-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="track"
        options={{
          title: "Track",
          href: user?.role === 'student' ? '/(tabs)/track' : null,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "file-search" : "file-search-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "bell" : "bell-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}