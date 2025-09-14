import "./global.css";
import SafeAreaWrapper from "./src/components/SafeAreaWrapper";
import { AuthProvider } from "./src/context/AuthContext";
import Routes from "./src/screens/Routes";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    /** Better use the same color for SafeArea-Background like for Nav-Tabs, so it looks like one "piece"  */
    <SafeAreaWrapper className="flex-1 bg-white px-4">
      <AuthProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaWrapper>
  );
}
