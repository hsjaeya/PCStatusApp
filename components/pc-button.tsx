import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

interface PCButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  disabled: boolean;
  loading?: boolean;
}

export function PCButton({
  icon,
  label,
  onPress,
  disabled,
  loading,
}: PCButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.pcButton, disabled && styles.pcButtonDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {icon}
          <Text style={styles.pcButtonText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pcButton: {
    flex: 1,
    backgroundColor: "#96d6e4",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 4,
  },
  pcButtonDisabled: {
    backgroundColor: "#DDF1F0",
  },
  pcButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
