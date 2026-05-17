import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";
import { User, IdCard, GraduationCap, Calendar, Mail, Upload, Lock } from "lucide-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles/registerStyles";
import api from "../../api/axios";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { COLORS } from "../../constants/theme";
import DropDownPicker from 'react-native-dropdown-picker';

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [program, setProgram] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [openYearLevel, setOpenYearLevel] = useState(false);
  const [yearLevelItems, setYearLevelItems] = useState([
    {label: '1st Year', value: '1'},
    {label: '2nd Year', value: '2'},
    {label: '3rd Year', value: '3'},
    {label: '4th Year', value: '4'},
    {label: '5th Year', value: '5'}
  ]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNextStep = () => {
    if (!firstName || !lastName || !studentId || !program || !yearLevel) {
      Alert.alert("Please fill in all fields.");
      return;
    }
    setStep(2);
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match.");
      return;
    }

    if (isRegistering) return;
    setError("");
    setIsRegistering(true);

    try {
      await api.post('/accounts/register/', {
        first_name: firstName || 'Unknown',
        last_name: lastName || 'Unknown',
        email,
        password,
        role: 'student',
        univ_id: studentId,
        course: program,
        year_level: parseInt(yearLevel) || 1
      });

      setSuccess(true);
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          const errorData = err.response.data;
          const errorMessages = Object.keys(errorData)
            .map(key => {
              const val = errorData[key];
              const msg = Array.isArray(val) ? val[0] : val;
              return `${key.replace('_', ' ')}: ${msg}`;
            })
            .join('\n');
          setError(errorMessages || "An error occurred during registration.");
        }
      } else {
        setError(err.message || "An error occurred during registration.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/images/USTP.jpg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(229, 231, 235, 0.5)", "rgba(1, 1, 83, 0.9)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.successOverlay}
          >
            <Card style={styles.successCard}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="timer-sand" size={36} color="#f4b844" />
              </View>

              <Text style={styles.successTitle}>Registration Successful!</Text>
              <Text style={styles.successSubText}>
                Thank you for signing up,{" "}
                <Text style={styles.successName}>
                  @{firstName.toLowerCase()}{lastName.toLowerCase().replace(/ /g, "")}
                </Text>
              </Text>
              <Text style={styles.successSubText}>
                Your account is currently on{" "}
                <Text style={styles.pendingText}>Pending</Text>
              </Text>
              
              <Text style={styles.successInfo}>
                To ensure the security of our laboratory environment, an
                administrator will review your credentials shortly.
              </Text>

              <View style={styles.expectBox}>
                <Text style={styles.expectTitle}>What to expect:</Text>
                <Text style={styles.expectItem}>
                  <Text style={styles.expectBold}>• Verification: </Text>
                  Our team is reviewing your information
                </Text>
                <Text style={styles.expectItem}>
                  <Text style={styles.expectBold}>• Access: </Text>
                  You will receive an email once your account is activated.
                </Text>
                <Text style={styles.expectItem}>
                  <Text style={styles.expectBold}>• Support: </Text>
                  If your application is declined, you will receive instructions
                  on how to provide valid documentation.
                </Text>
              </View>

              <Button
                title="Return to Login"
                style={styles.returnButton}
                onPress={() => router.push("/auth/login")}
              />
            </Card>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/USTP.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(229, 231, 235, 0.5)", "rgba(0, 0, 127, 0.9)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.overlay}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            extraScrollHeight={120}       
          >
            <Card style={styles.card}>

              <View style={styles.leftPanel}>
                <Image
                  source={require("../../assets/images/RegQuestLogo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.welcomeTitle}>WELCOME to{"\n"}RegQuest</Text>
                <Text style={styles.welcomeSubtitle}>Fill up the information</Text>
              </View>

              <View style={styles.rightPanel}>
                
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>Create Account</Text>
                  <Text style={styles.stepIndicator}>
                    Step {step} of 2 &nbsp; {step === 1 ? 'Personal Details' : 'Account Details'}
                  </Text>
                </View>

                <View style={styles.form}>
                  {step === 1 ? (
                    <>
                      <Input label="First Name" icon={User} placeholder="Provide your first name" value={firstName} onChangeText={setFirstName} />
                      <Input label="Last Name" icon={User} placeholder="Provide your last name" value={lastName} onChangeText={setLastName} />
                      <Input label="Student ID" icon={IdCard} placeholder="Provide your student ID" value={studentId} onChangeText={setStudentId} keyboardType="numeric" />
                      <Input label="Program / Course" icon={GraduationCap} placeholder="Provide course/program" value={program} onChangeText={setProgram} />
                      <View style={{ marginBottom: 16, zIndex: 1000 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.darkgray, marginBottom: 8 }}>Year Level</Text>
                        <View style={{ marginBottom: 16, zIndex: 5000, elevation: 20 }}>
                          <DropDownPicker
                            open={openYearLevel}
                            value={yearLevel}
                            items={yearLevelItems}
                            setOpen={setOpenYearLevel}
                            setValue={setYearLevel}
                            setItems={setYearLevelItems}
                            listMode="SCROLLVIEW"
                            dropDownDirection="BOTTOM"
                            placeholder="Select Year Level"
                            placeholderStyle={{ color: '#9ca3af', marginLeft: 5 }}
                            icon={() => <Calendar size={20} color="#9ca3af" />}
                            style={{
                              borderWidth: 1,
                              borderColor: '#e5e7eb',
                              borderRadius: 8,
                              backgroundColor: '#f9fafb',
                              height: 50,
                              zIndex: 5000,
                              elevation: 50,
                            }}
                            dropDownContainerStyle={{
                              borderColor: '#e5e7eb',
                              backgroundColor: '#f9fafb',
                              maxHeight: 110,
                              zIndex: 5000,
                              elevation: 20,
                            }}
                            textStyle={{
                              fontSize: 14,
                              color: COLORS.darkgray,
                              marginLeft: 5
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.registerButtons}>
                        <Button title="Next Step" style={styles.btnNext} onPress={handleNextStep} />
                      </View>
                    </>
                  ) : (
                    <>
                      <Input label="Email Address" icon={Mail} placeholder="Enter your email address" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
                      
                      <View>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.darkgray, marginBottom: 8 }}>Upload School ID</Text>
                        <TouchableOpacity style={styles.uploadWrapper}>
                          <Upload size={20} color="#9ca3af" />
                          <Text style={styles.uploadText}>Upload File (.png, .jpg, .jpeg)</Text>
                        </TouchableOpacity>
                      </View>

                      <Input label="Password" icon={Lock} placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />
                      <Input label="Confirm Password" icon={Lock} placeholder="Re-enter your password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

                      {error ? <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{error}</Text> : null}

                      <View style={styles.registerButtons}>
                        <TouchableOpacity onPress={() => setStep(1)} disabled={isRegistering}>
                          <Text style={styles.btnBackText}>Back</Text>
                        </TouchableOpacity>
                        <Button title="Register" style={styles.btnRegister} onPress={handleRegister} loading={isRegistering} />
                      </View>
                    </>
                  )}
                </View>

                <View style={styles.formFooter}>
                  <Text style={styles.registerText}>
                    Already have an account?{" "}
                    <Text 
                      style={styles.registerLink} 
                      onPress={() => router.push("/auth/login")}
                    >
                      Login here
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