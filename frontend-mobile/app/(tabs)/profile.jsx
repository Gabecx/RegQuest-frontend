import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import styles from "../styles/profileStyles";
import { useAuth } from "../../context/AuthContext";

// Hardcoded data removed, using dynamic user data from context

const DOCUMENT_REQUESTS = [
  {
    id: 1,
    name: "Transcript of Records (TOR)",
    qty: 1,
    description: "Official academic record",
    status: "Pending",
  },
];

const SETTINGS = [
  { id: 1, icon: "settings", label: "Account Settings" },
  { id: 2, icon: "shield", label: "Privacy & Security" },
  { id: 3, icon: "help-circle", label: "Help & Support" },
];

export default function Profile() {
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const { user, logout } = useAuth();

  const displayUser = {
    name: user ? (`${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A") : "Loading...",
    studentId: user?.univ_id || user?.id || "N/A",
    course: user?.course || "N/A",
    gender: user?.gender || "N/A",
    dob: user?.date_of_birth || "N/A",
    age: "N/A",
    placeOfBirth: user?.place_of_birth || "N/A",
    email: user?.email || "N/A",
    contact: user?.contact_number || "N/A",
    address: user?.address || "N/A",
    province: user?.province || "N/A",
    municipality: user?.municipality || "N/A",
    barangay: user?.barangay || "N/A",
    zip: user?.zip_code || "N/A",
    lastName: user?.last_name || "N/A",
    firstName: user?.first_name || "N/A",
    middleInitial: user?.middle_name ? user.middle_name.charAt(0) + "." : "N/A",
    ext: user?.extension_name || "N/A",
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <Icon name="user" size={56} color="#9ca3af" />
          </View>
          <Text style={styles.userName}>{displayUser.name}</Text>
          <Text style={styles.studentId}>{displayUser.studentId}</Text>
          <Text style={styles.course}>{displayUser.course}</Text>
          <TouchableOpacity onPress={() => setShowPersonalInfo(!showPersonalInfo)}>
            <Text style={styles.viewPersonalInfo}>
              {showPersonalInfo ? "Hide personal info" : "View personal info"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerLine} />

        {showPersonalInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 2 }]}>
                <Text style={styles.formLabel}>Last Name</Text>
                <View style={styles.formInput}>
                  <Text style={styles.formInputText}>{displayUser.lastName}</Text>
                </View>
              </View>
              <View style={[styles.formGroup, { flex: 2 }]}>
                <Text style={styles.formLabel}>First Name</Text>
                <View style={styles.formInput}>
                  <Text style={styles.formInputText}>{displayUser.firstName}</Text>
                </View>
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>M.I.</Text>
                <View style={styles.formInput}>
                  <Text style={styles.formInputText}>{displayUser.middleInitial}</Text>
                </View>
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Ext.</Text>
                <View style={styles.formInput}>
                  <Text style={styles.formInputText}>{displayUser.ext}</Text>
                </View>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Gender</Text>
                <View style={styles.formInput}>
                  <Text style={styles.formInputText}>{displayUser.gender}</Text>
                </View>
              </View>
              <View style={[styles.formGroup, { flex: 1.5 }]}>
                <Text style={styles.formLabel}>Date of birth / Age</Text>
                <View style={[styles.formInput, styles.dobRow]}>
                  <Text style={styles.formInputText}>{displayUser.dob}</Text>
                  <View style={styles.ageBadge}>
                    <Text style={styles.ageBadgeText}>{displayUser.age}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.formGroup, { flex: 1.5 }]}>
                <Text style={styles.formLabel}>Place of birth</Text>
                <View style={styles.formInput}>
                  <Text style={styles.formInputText}>{displayUser.placeOfBirth}</Text>
                </View>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Email</Text>
                <View style={styles.formInput}>
                  <Text style={styles.formInputText}>{displayUser.email}</Text>
                </View>
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Contact #</Text>
                <View style={styles.formInput}>
                  <Text style={styles.formInputText}>{displayUser.contact}</Text>
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Address (House #/Block/Street/Subdivision/Building)</Text>
              <View style={styles.formInput}>
                <Text style={styles.formInputText}>{displayUser.address}</Text>
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1.2 }]}>
                <Text style={styles.formLabel}>Province / Region</Text>
                <View style={styles.formInput}>
                  <Text style={styles.formInputText}>{displayUser.province}</Text>
                </View>
              </View>
              <View style={[styles.formGroup, { flex: 1.4 }]}>
                <Text style={styles.formLabel}>Municipality / City</Text>
                <View style={styles.formInput}>
                  <Text style={styles.formInputText}>{displayUser.municipality}</Text>
                </View>
              </View>
              <View style={[styles.formGroup, { flex: 1.2 }]}>
                <Text style={styles.formLabel}>Barangay</Text>
                <View style={styles.formInput}>
                  <Text style={styles.formInputText}>{displayUser.barangay}</Text>
                </View>
              </View>
              <View style={[styles.formGroup, { flex: 0.8 }]}>
                <Text style={styles.formLabel}>Zip code</Text>
                <View style={styles.formInput}>
                  <Text style={styles.formInputText}>{displayUser.zip}</Text>
                </View>
              </View>
            </View>

            <View style={styles.dividerLine} />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Document Requests</Text>
          {DOCUMENT_REQUESTS.map((doc) => (
            <View key={doc.id} style={styles.docCard}>
              <View style={styles.docInfo}>
                <Text style={styles.docName}>{doc.name}  <Text style={styles.docQty}>x{doc.qty}</Text></Text>
                <Text style={styles.docDesc}>{doc.description}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{doc.status}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.dividerLine} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {SETTINGS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.settingItem}>
              <Icon name={item.icon} size={20} color="#374151" style={styles.settingIcon} />
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Icon name="chevron-right" size={18} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Icon name="log-out" size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}