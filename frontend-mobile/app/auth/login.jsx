import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "../styles/loginStyles";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setError("");
    setIsLoggingIn(true);

    try {
      await login(email, password);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else if (err.message && err.message.toLowerCase().includes("network error")) {
        setError("Network error: Cannot connect to the server. Check your connection.");
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/USTP-CDO.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(229, 231, 235, 0.5)", "rgba(1, 1, 83, 0.9)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.overlay}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            extraScrollHeight={40}       
          >
            <Card style={styles.card}>

              <View style={styles.leftPanel}>
                <Image
                  source={require("../../assets/images/RegQuestLogo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.welcomeTitle}>Welcome{"\n"}Back!</Text>
                <Text style={styles.welcomeSubtitle}>Login to access your account</Text>
              </View>

              <View style={styles.rightPanel}>
                
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Log In</Text>
                  <Text style={styles.formSubtitle}>Please enter your credentials to continue</Text>
                </View>

                <View style={styles.form}>
                  <Input 
                    label="Student ID / Email Address" 
                    icon={Mail} 
                    placeholder="Enter your Email" 
                    value={email} 
                    onChangeText={setEmail} 
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  
                  <Input 
                    label="Password" 
                    icon={Lock} 
                    placeholder="Enter your password" 
                    value={password} 
                    onChangeText={setPassword} 
                    secureTextEntry
                  />

                  {error ? <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{error}</Text> : null}

                  <Button 
                    title="Log In" 
                    onPress={handleLogin} 
                    loading={isLoggingIn} 
                    style={{ marginTop: 8 }}
                  />
                </View>

                <View style={styles.formFooter}>
                  <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                  </TouchableOpacity>
                  <Text style={styles.registerText}>
                    Don't have an account?{" "}
                    <Text 
                      style={styles.registerLink} 
                      onPress={() => router.push("/auth/Register")}
                    >
                      Register here
                    </Text>
                  </Text>
                </View>

              </View>

            </Card>
          </KeyboardAwareScrollView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}