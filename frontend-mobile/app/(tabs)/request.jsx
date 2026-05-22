import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  Alert
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Check, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react-native";
import styles from "../styles/requestStyles";
import Card from "../components/Card";
import Button from "../components/Button";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const STEPS = ["Select Document", "Review Data", "Payment", "Complete"];

export default function RequestDocument() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [DOCUMENTS, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [copies, setCopies] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents/');
        const docs = response.data.map(d => ({
          id: d.id,
          name: d.document_name,
          description: d.description,
          price: parseFloat(d.price),
          isPerPg: false,
          processing_time_days: d.processing_time_days || 3
        }));
        setDocuments(docs);
        
        if (params.selectedDocId) {
          const docId = parseInt(params.selectedDocId);
          setSelectedDocs([docId]);
          setCopies({ [docId]: 1 });
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };
    fetchDocuments();
  }, [params.selectedDocId]);

  const toggleSelection = (id) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
    if (!copies[id]) setCopies((prev) => ({ ...prev, [id]: 1 }));
  };

  const changeCopy = (id, delta) => {
    setCopies((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  const getCopies = (id) => copies[id] ?? 1;

  const calculateTotal = () =>
    DOCUMENTS.filter((d) => selectedDocs.includes(d.id)).reduce(
      (sum, d) => sum + d.price * getCopies(d.id),
      0
    );

  const handleNext = () => { 
    if (currentStep === 1 && selectedDocs.length === 0) {
      Alert.alert("Selection Required", "Please select at least one document to proceed.");
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1); 
  };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const submitRequest = async () => {
    try {
      setIsSubmitting(true);
      const selected = DOCUMENTS.filter(d => selectedDocs.includes(d.id));
      const summary = selected.map(d => `${d.name} x${getCopies(d.id)}`).join('\n');
      const maxDays = Math.max(...selected.map(d => d.processing_time_days), 3);

      const response = await api.post("/requests/", {
        documents_summary: summary,
        purpose: purpose,
        processing_time_days: maxDays,
        total_price: calculateTotal().toFixed(2)
      });
      setTrackingNumber(response.data.tracking_number);
      setCurrentStep(4);
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Submission Failed", "An error occurred while submitting your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.header}>
        <Image
          source={require("../../assets/images/RegQuestLogo.png")}
          style={styles.headerLogo}
        />
      </View>

      <View style={styles.stepperContainer}>
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = currentStep === stepNum;
          const isPast = currentStep > stepNum;
          return (
            <View key={label} style={styles.stepWrapper}>
              <Text style={[
                styles.stepLabel,
                isPast && styles.stepLabelPast,
                isActive && styles.stepLabelCurrent,
              ]}>
                {label}
              </Text>
              <View style={styles.stepLineTrack}>
                
                {(isActive || isPast) && <View style={styles.stepLineFillActive} />}
              </View>
            </View>
          );
        })}
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {currentStep === 1 && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Select Document</Text>

            {DOCUMENTS.map((doc) => {
              const isSelected = selectedDocs.includes(doc.id);
              return (
                <View key={doc.id}>
                  <TouchableOpacity
                    style={[
                      styles.docItem,
                      isSelected && styles.docItemSelected,
                      isSelected && {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        borderBottomWidth: 0,
                      },
                    ]}
                    onPress={() => toggleSelection(doc.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Check size={13} color="#fff" strokeWidth={3} />}
                    </View>
                    <View style={styles.docInfo}>
                      <Text style={styles.docName}>{doc.name}</Text>
                      <Text style={styles.docDesc}>{doc.description}</Text>
                    </View>
                    <Text style={styles.docPrice}>
                      ₱{doc.price}{doc.isPerPg ? "/pg" : ""}
                    </Text>
                  </TouchableOpacity>

                  {isSelected && (
                    <View style={styles.copyRow}>
                      <Text style={styles.copyLabel}>Number of copy</Text>
                      <View style={styles.copyControl}>
                        <TouchableOpacity style={styles.copyBtn} onPress={() => changeCopy(doc.id, -1)}>
                          <Text style={styles.copyBtnText}>‹</Text>
                        </TouchableOpacity>
                        <Text style={styles.copyValue}>{getCopies(doc.id)}</Text>
                        <TouchableOpacity style={styles.copyBtn} onPress={() => changeCopy(doc.id, 1)}>
                          <Text style={styles.copyBtnText}>›</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <View style={styles.totalBadge}>
                <Text style={styles.totalValue}>₱{calculateTotal()}</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Button style={styles.btnBack} textStyle={styles.btnBackText} onPress={() => router.back()}>
                <ChevronLeft size={16} color="#374151" />
                <Text style={styles.btnBackText}>Back</Text>
              </Button>
              <Button style={styles.btnNext} textStyle={styles.btnNextText} onPress={handleNext}>
                <Text style={styles.btnNextText}>Next Step</Text>
                <ChevronRight size={16} color="#ffffff" />
              </Button>
            </View>
          </Card> 
        )}

        {currentStep === 2 && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Review Data</Text>

            <View style={styles.reviewBox}>
              
              <View style={styles.reviewSection}>
                <Text style={styles.sectionSubtitle}>Document Request:</Text>
                <View style={styles.divider} />
                {DOCUMENTS.filter((d) => selectedDocs.includes(d.id)).map((doc) => (
                  <View key={doc.id} style={styles.summaryItem}>
                    <View style={styles.summaryDocInfo}>
                      <Text style={styles.summaryDocName}>{doc.name}</Text>
                      <Text style={styles.summaryDocDesc}>{doc.description}</Text>
                    </View>
                    <Text style={styles.summaryQty}>x{getCopies(doc.id)}</Text>
                  </View>
                ))}
                {selectedDocs.length === 0 && (
                  <Text style={styles.emptyText}>No documents selected.</Text>
                )}
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.sectionSubtitle}>Personal Data:</Text>
                <View style={styles.divider} />
                <View style={styles.formGrid}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.formLabel}>Full Name</Text>
                    <View style={styles.formInput}>
                      <Text style={styles.formInputText}>{user ? (`${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A") : "Loading..."}</Text>
                    </View>
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.formLabel}>Year level</Text>
                    <View style={styles.formInput}>
                      <Text style={styles.formInputText}>{user?.year_level ? (user.year_level == 1 ? "1st Year" : user.year_level == 2 ? "2nd Year" : user.year_level == 3 ? "3rd Year" : `${user.year_level}th Year`) : "N/A"}</Text>
                    </View>
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.formLabel}>Student ID</Text>
                    <View style={styles.formInput}>
                      <Text style={styles.formInputText}>{user?.univ_id || user?.id}</Text>
                    </View>
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.formLabel}>Program/Course</Text>
                    <View style={styles.formInput}>
                      <Text style={styles.formInputText} numberOfLines={1}>{user?.course || "N/A"}</Text>
                    </View>
                  </View>
                  <View style={styles.formGroupFull}>
                    <Text style={styles.formLabel}>Email</Text>
                    <View style={styles.formInput}>
                      <Text style={styles.formInputText}>{user?.email}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.reviewSection, { marginBottom: 0, paddingHorizontal: 4 }]}>
              <Text style={styles.sectionSubtitle}>Purpose of Request:</Text>
              <View style={styles.divider} />
              <TextInput
                style={styles.purposeInput}
                placeholder="For personal files"
                placeholderTextColor="#9ca3af"
                value={purpose}
                onChangeText={setPurpose}
              />
            </View>

            <Text style={styles.warningText}>
              Incorrect Information? Contact the admin if you think there's a mistake
            </Text>

            <View style={styles.actionRow}>
              <Button style={styles.btnBack} textStyle={styles.btnBackText} onPress={handleBack}>
                <ChevronLeft size={16} color="#374151" />
                <Text style={styles.btnBackText}>Back</Text>
              </Button>
              <Button style={styles.btnNext} textStyle={styles.btnNextText} onPress={handleNext}>
                <Text style={styles.btnNextText}>Next Step</Text>
                <ChevronRight size={16} color="#ffffff" />
              </Button>
            </View>
          </Card>
        )}

        {currentStep === 3 && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Payment</Text>

            <View style={styles.reviewBox}>
              <Text style={styles.sectionSubtitle}>Document Request:</Text>
              <View style={styles.divider} />
              {DOCUMENTS.filter((d) => selectedDocs.includes(d.id)).map((doc) => (
                <View key={doc.id} style={styles.summaryItem}>
                  <View style={styles.summaryDocInfo}>
                    <Text style={styles.summaryDocName}>{doc.name}</Text>
                    <Text style={styles.summaryDocDesc}>{doc.description}</Text>
                  </View>
                  <Text style={styles.summaryQty}>
                    ₱{doc.price}{doc.isPerPg ? "/pg" : ""}
                  </Text>
                </View>
              ))}
              <View style={styles.paymentTotalRow}>
                <Text style={styles.paymentTotalLabel}>Total Amount</Text>
                <Text style={styles.paymentTotalAmount}>₱{calculateTotal()}</Text>
              </View>
            </View>

            <View style={styles.estimateRow}>
              <Text style={styles.estimateLabel}>Estimate Completion</Text>
              <Text style={styles.estimateValue}>3 to 5 Days</Text>
            </View>

            <View style={[styles.actionRow, { marginTop: 24 }]}>
              <Button style={styles.btnBack} textStyle={styles.btnBackText} onPress={handleBack}>
                <ChevronLeft size={16} color="#374151" />
                <Text style={styles.btnBackText}>Back</Text>
              </Button>
              <Button 
                style={styles.btnNext} 
                textStyle={styles.btnNextText} 
                onPress={submitRequest} 
                title={isSubmitting ? "Submitting..." : "Submit Request"} 
                disabled={isSubmitting} 
              />
            </View>
          </Card>
        )}

        {currentStep === 4 && (
          <Card style={styles.card}>
            <View style={styles.completeContainer}>
              <View style={styles.successIconContainer}>
                <CheckCircle size={56} color="#fff" />
              </View>
              <Text style={styles.completeTitle}>Request Submitted!</Text>
              <Text style={styles.completeMessage}>
                Your request has been successfully processed. You can track the status of your documents using the ID below.
              </Text>
              <View style={styles.trackingBox}>
                <Text style={styles.trackingLabel}>Your Tracking ID</Text>
                <Text style={styles.trackingId}>{trackingNumber}</Text>
              </View>
              <View style={styles.completeActions}>
                <Button style={styles.btnSubmit} textStyle={styles.btnSubmitText} onPress={() => router.push({ pathname: "/(tabs)/track", params: { trackingNumber } })} title="Track Status" />
                <Button 
                  style={styles.btnHome} 
                  textStyle={styles.btnHomeText} 
                  onPress={() => {
                    setSelectedDocs([]);
                    setPurpose("");
                    setCurrentStep(1);
                  }} 
                  title="New Request" 
                />
              </View>
            </View>
          </Card>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}