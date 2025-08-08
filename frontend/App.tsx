import "./global.css";
import SafeAreaWrapper from "./components/SafeAreaWrapper";
import Routes from "./screens/Routes";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <SafeAreaWrapper className="flex-1">
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </SafeAreaWrapper>
  );
}
