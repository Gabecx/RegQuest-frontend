import { StyleSheet, Dimensions } from "react-native";
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray100,
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
    marginBottom: 0,
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
    fontSize: 30, 
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  formSubtitle: {
    color: "#9ca3af",
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  form: {
    flexDirection: "column",
    gap: SPACING.md,
  },
  formFooter: {
    alignItems: "center",
    marginTop: SPACING.md,
    gap: SPACING.md,
    paddingTop: SPACING.sm,
  },
  forgotPassword: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.bold,
    fontSize: TYPOGRAPHY.sizes.sm,
    letterSpacing: 0.5,
  },
  registerText: {
    fontSize: 12, 
    color: COLORS.textMuted,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.bold,
  }
});