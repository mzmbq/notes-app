import "./global.css";
import SafeAreaWrapper from "./src/components/SafeAreaWrapper";
import { AuthProvider } from "./src/context/AuthContext";
import Routes from "./src/screens/Routes";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <SafeAreaWrapper className="flex-1 bg-gray-100">
      <AuthProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaWrapper>
  );
}
