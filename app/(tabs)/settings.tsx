import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function Settings() {
  const navigation = useNavigation();

  const logout = async () => {
    await supabase.auth.signOut();
    // router.replace("/")는 탭 내부 네비게이터에서 탭 인덱스로 가는 문제가 있어
    // 부모(root Stack)에게 직접 reset을 디스패치해서 로그인 화면으로 이동
    navigation.getParent()?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "index" }],
      }),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.title}>설정</Text> */}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    // backgroundColor: "#f5f5f5",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  logoutButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  logoutText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "600",
  },
});
