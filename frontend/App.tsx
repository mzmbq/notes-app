import "./global.css";
import SafeAreaWrapper from "./src/components/SafeAreaWrapper";
import Routes from "./src/screens/Routes";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <SafeAreaWrapper className="flex-1 bg-gray-100">
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </SafeAreaWrapper>
  );
}
