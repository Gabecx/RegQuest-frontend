import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { Check, Clock, FileText, Package, X } from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";
import api from "../../api/axios";
import styles from "../styles/trackStyles";

const TimelineIcon = ({ id, status }) => {
  const isCompleted = status === "completed";
  const isActive = status === "active";
  const isError = status === "error";
  
  const iconColor = isCompleted || isError ? "#fff" : isActive ? "#0b105f" : "#6b7280";
  const iconSize = 16;

  return (
    <View style={[
      styles.timelineIcon, 
      isCompleted && styles.timelineIconCompleted,
      isActive && { backgroundColor: "#fff", borderColor: "#0b105f", borderWidth: 2 },
      isError && { backgroundColor: "#ef4444", borderColor: "#ef4444" }
    ]}>
      {isCompleted ? (
         <Check size={iconSize} color={iconColor} strokeWidth={3} />
      ) : isError ? (
         <X size={iconSize} color={iconColor} strokeWidth={3} />
      ) : (
        <>
          {id === 1 && <FileText size={iconSize} color={iconColor} strokeWidth={2.5} />}
          {id === 2 && <Clock size={iconSize} color={iconColor} strokeWidth={2.5} />}
          {id === 3 && <FileText size={iconSize} color={iconColor} strokeWidth={2.5} />}
          {id === 4 && <Package size={iconSize} color={iconColor} strokeWidth={2.5} />}
        </>
      )}
    </View>
  );
};

export default function TrackStatus({ currentUser }) {
  const params = useLocalSearchParams();
  const [trackingId, setTrackingId] = useState("");
  const [requestData, setRequestData] = useState(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (params.trackingNumber) {
      setTrackingId(params.trackingNumber);
      handleSearch(params.trackingNumber);
    }
  }, [params.trackingNumber]);

  const handleSearch = async (idToSearch) => {
    const searchId = typeof idToSearch === 'string' ? idToSearch : trackingId;
    if (!searchId.trim()) return;

    setIsSearching(true);
    setError("");
    setRequestData(null);

    try {
      const response = await api.get(`/requests/track/${searchId.trim()}/`);
      setRequestData(response.data);
    } catch (err) {
      setError("Tracking ID not found. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusState = (stepIndex, currentStatus) => {
    const statuses = ['pending', 'processing', 'approved', 'completed'];
    if (currentStatus === 'rejected' || currentStatus === 'cancelled') {
        return stepIndex === 0 ? 'completed' : 'pending';
    }
    const currentIdx = statuses.indexOf(currentStatus);
    if (currentIdx > stepIndex) return 'completed';
    if (currentIdx === stepIndex) {
        return currentStatus === 'completed' ? 'completed' : 'active';
    }
    return 'pending';
  };

  const isErrorState = requestData?.status === 'rejected' || requestData?.status === 'cancelled';
  let dynamicStatusData = [];
  if (requestData) {
    if (isErrorState) {
        dynamicStatusData = [
            { id: 1, title: 'Request Received', date: new Date(requestData.created_at).toLocaleDateString(), status: 'completed' },
            { 
                id: 2, 
                title: requestData.status === 'rejected' ? 'Request Rejected' : 'Request Cancelled', 
                date: 'Terminated', 
                status: 'error' 
            }
        ];
    } else {
        dynamicStatusData = [
            { id: 1, title: 'Request Received', date: new Date(requestData.created_at).toLocaleDateString(), status: getStatusState(0, requestData.status) },
            { id: 2, title: 'Processing', date: ['processing', 'approved', 'completed'].includes(requestData.status) ? 'Started' : 'Pending', status: getStatusState(1, requestData.status) },
            { id: 3, title: 'Ready for Pickup', date: ['approved', 'completed'].includes(requestData.status) ? 'Done' : 'Pending', status: getStatusState(2, requestData.status) },
            { id: 4, title: 'Claimed', date: requestData.status === 'completed' ? 'Done' : 'Pending', status: getStatusState(3, requestData.status) },
        ];
    }
  }

  const estDateStr = () => {
    if (!requestData) return "N/A";
    if (requestData.created_at && requestData.processing_time_days !== undefined) {
        const estDate = new Date(requestData.created_at);
        estDate.setDate(estDate.getDate() + requestData.processing_time_days);
        return estDate.toLocaleDateString();
    }
    return new Date(requestData.est_release_date).toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.header}>
        <Image
          source={require("../../assets/images/RegQuestLogo.png")}
          style={styles.headerLogo}
        />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Track Your Request</Text>
          <Text style={styles.pageSubtitle}>
            Enter your tracking ID to see the current status of your documents.
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter Reference ID (e.g., RQ-000123)"
            placeholderTextColor="#adb5bd"
            value={trackingId}
            onChangeText={setTrackingId}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.8} disabled={isSearching}>
            <Text style={styles.searchBtnText}>{isSearching ? "Searching..." : "Track Now"}</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 16 }}>{error}</Text>
        ) : null}

        {requestData && (
          <View style={styles.resultCard}>

            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.trackIdLabel}>Tracking ID</Text>
                <Text style={styles.trackIdValue}>{requestData.tracking_number}</Text>
              </View>
              <View style={styles.estimateBox}>
                <Text style={styles.estimateLabel}>Estimated Completion</Text>
                <Text style={styles.estimateDate}>{estDateStr()}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.timelineContainer}>
              {dynamicStatusData.map((item, index) => {
                const isLast = index === dynamicStatusData.length - 1;
                return (
                  <View key={item.id} style={styles.timelineStep}>

                    <View style={styles.timelineLeft}>
                      <TimelineIcon id={item.id} status={item.status} />
                      {!isLast && <View style={[styles.timelineLine, item.status === 'error' && { backgroundColor: 'transparent' }]} />}
                    </View>

                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineTitle, item.status === 'error' && { color: '#ef4444' }]}>{item.title}</Text>
                      <Text style={styles.timelineDesc}>{item.date}</Text>
                    </View>

                  </View>
                );
              })}
            </View>

          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}