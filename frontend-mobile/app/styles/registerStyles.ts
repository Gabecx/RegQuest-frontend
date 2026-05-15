import { StyleSheet, Dimensions } from "react-native";
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from "../../constants/theme";

const { height, width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: "100%", height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.md,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "transparent",
    borderRadius: 24,
    overflow: "hidden",
    flexDirection: "column",
    ...SHADOWS.xl,
    padding: 0, 
  },
  leftPanel: {
    width: "100%",
    padding: 32,
    backgroundColor: "rgba(0, 0, 127, 0.4)", 
    justifyContent: "center",
    alignItems: "flex-start",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 1,
    alignSelf: "center",
  },
  welcomeTitle: {
    fontSize: 36, 
    fontWeight: TYPOGRAPHY.weights.extrabold,
    color: COLORS.white,
    marginBottom: SPACING.md,
    textTransform: "uppercase",
    lineHeight: 45, 
    letterSpacing: 0.5,
    marginTop: -30,
  },
  welcomeSubtitle: {
    color: "#dbeafe",
    fontSize: 18,
    fontWeight: TYPOGRAPHY.weights.medium,
    lineHeight: 29,
  },
  rightPanel: {
    width: "100%",
    padding: 32, 
    backgroundColor: COLORS.white,
  },
  formHeader: {
    marginBottom: 32, 
  },
  formTitle: {
    fontSize: 24, 
    fontWeight: TYPOGRAPHY.weights.extrabold,
    color: COLORS.primary,
    marginBottom: 4,
  },
  stepIndicator: {
    color: COLORS.darkgray,
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  form: {
    flexDirection: "column",
    gap: SPACING.md,
  },
  uploadWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    gap: 8,
    marginBottom: SPACING.md,
  },
  uploadText: {
    color: '#9ca3af',
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  registerButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.sm,
    gap: SPACING.md,
  },
  btnNext: {
    backgroundColor: COLORS.accent,
    flex: 1,
  },
  btnRegister: {
    backgroundColor: COLORS.accent,
    flex: 1,
  },
  btnBackText: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.bold,
    padding: SPACING.sm,
  },
  formFooter: {
    alignItems: "center",
    marginTop: SPACING.md,
  },
  registerText: {
    fontSize: 12, 
    color: COLORS.textMuted,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },

  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.md,
  },
  successCard: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    ...SHADOWS.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff8ec",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: TYPOGRAPHY.weights.extrabold,
    color: COLORS.primary,
    marginBottom: 12,
  },
  successSubText: {
    fontSize: 16,
    color: COLORS.darkgray,
    textAlign: "center",
    marginBottom: 4,
  },
  successName: {
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  pendingText: {
    color: COLORS.accent,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  successInfo: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    marginVertical: 24,
    lineHeight: 20,
  },
  expectBox: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 20,
    width: "100%",
    marginBottom: SPACING.xl,
  },
  expectTitle: {
    fontSize: 16,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
    marginBottom: 12,
  },
  expectItem: {
    fontSize: 14,
    color: COLORS.darkgray,
    marginBottom: 8,
    lineHeight: 20,
  },
  expectBold: {
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  returnButton: {
    width: "100%",
  }
});