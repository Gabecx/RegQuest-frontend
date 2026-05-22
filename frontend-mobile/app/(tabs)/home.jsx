import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import styles from "../styles/homeStyles";
import Button from "../components/Button";
import Card from "../components/Card";
import Prediction from "../components/Prediction";
import FeatureItem from "../components/FeatureItem";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import api from "../../api/axios";

const Home = ({ currentUser }) => {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [trackingId, setTrackingId] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents/');
        setDocuments(response.data);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };
    fetchDocuments();
  }, []);

  const getIconForDoc = (name) => {
    if (!name) return 'file';
    const n = name.toLowerCase();
    if (n.includes('transcript')) return 'file-text';
    if (n.includes('dismissal')) return 'shield';
    if (n.includes('authentication')) return 'check-square';
    if (n.includes('evaluation')) return 'file-text';
    if (n.includes('certification')) return 'award';
    return 'file';
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      extraScrollHeight={80} 
    >

      <View style={styles.navbar}>
        <Image
          source={require("../../assets/images/RegQuestLogo.png")}
          style={styles.navLogo}
        />
      </View>

      <View style={styles.hero}>
        <ImageBackground
          source={require("../../assets/images/USTP-CDO.jpg")}
          style={styles.heroBg}
        />

        <LinearGradient
          colors={["rgba(0, 0, 127, 0.9)", "rgba(0, 0, 127, 0.7)", "transparent"]}
          locations={[0, 0.50, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.heroOverlay}
        />

        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Your Credentials{"\n"}
            <Text style={styles.heroHighlight}>Fast & Secure</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Request your Transcript of Records, Diploma, and other documents online.
            Skip the lines and track your request in real-time.
          </Text>

          <View style={styles.heroButtons}>
            <Button
              style={styles.heroBtnPrimary}
              textStyle={{ fontWeight: "900", color: "#1F1F9C", fontSize: 10 }}
              onPress={() => router.push("/(tabs)/request")}
              title="Start Request"
            />

            <Button
              style={styles.heroBtnOutline}
              textStyle={{ color: "#FEC956", fontWeight: "700", fontSize: 10 }}
              onPress={() => router.push("/(tabs)/track")}
              title="Track Status"
            />
          </View>
        </View>
      </View>

      <View style={styles.credentialsSection}>
        <Text style={styles.sectionTitle}>Available Credentials</Text>

        <View style={styles.credentialsGrid}>
          {documents.map((doc, index) => (
            <Card key={doc.id} style={styles.credentialCard}>

              <View style={[
                styles.cardHeaderBg,
                styles[`headerColor${(index % 6) + 1}`]
              ]}>
                <View style={styles.cardIconWrapper}>
                  <Icon name={getIconForDoc(doc.document_name)} size={32} style={styles.cardIcon} />
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{doc.document_name}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{doc.description}</Text>

                <Prediction label="Estimated Processing Time" result={`${doc.processing_time_days} Days`} confidence={95} />

                <View style={styles.cardFooter}>
                  <Text style={styles.priceTag}>₱ {doc.price}</Text>

                  <Button
                    style={styles.requestBtnSmall}
                    textStyle={{ color: "#fff", fontSize: 11, fontWeight: "600" }}
                    onPress={() => router.push({ pathname: "/(tabs)/request", params: { selectedDocId: doc.id } })}
                    title="Request →"
                  />
                </View>
              </View>
            </Card>
          ))}
        </View>

        <Button
          style={styles.seeMoreBtn}
          textStyle={styles.seeMoreBtnText}
          onPress={() => router.push("/(tabs)/request")}
          title="See More Credentials →"
        />
      </View>

      <View style={styles.statusSection}>
        <Card style={styles.statusCard}>

          <Text style={styles.statusTitle}>
            Check Your Request Status
          </Text>

          <Text style={styles.statusSubtitle}>
            Enter your reference number to see the current stage of your request.
          </Text>

          <View style={styles.statusCheckContainer}>
            <TextInput
              style={styles.statusInput}
              placeholder="Enter Reference ID (e.g., RQ-000123)"
              placeholderTextColor="#9ca3af"
              value={trackingId}
              onChangeText={setTrackingId}
            />

            <Button
              style={styles.statusBtn}
              textStyle={{ color: "#fff", fontWeight: "700", fontSize: 13 }}
              onPress={() => router.push({ pathname: "/(tabs)/track", params: { trackingNumber: trackingId } })}
              title="Track Now"
            />
          </View>

    </Card>
  </View>

      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { textAlign: 'center', color: '#00007F', marginBottom: 16 }]}>
          Streamlining the Credential Process
        </Text>
        <Text style={{ textAlign: 'center', color: '#6b7280', marginBottom: 32, paddingHorizontal: 16, lineHeight: 22 }}>
          Our mission is to reduce physical queues and improve turnaround time for all registrar services.
        </Text>
        
        <FeatureItem icon={(props) => <Icon name="shield" {...props} />} desc="Your academic records are sensitive. We use enterprise-grade encryption to ensure your data remains private and secure." />
        <FeatureItem icon={(props) => <Icon name="file-text" {...props} />} desc="By digitizing the application process, we've reduced processing times by up to 50%, getting your documents to you faster." />
        <FeatureItem icon={(props) => <Icon name="user" {...props} />} desc="No more standing in long lines. Apply from home, pay online, and track your request status in real-time." />
      </View>

    </KeyboardAwareScrollView>
  );
};

export default Home;