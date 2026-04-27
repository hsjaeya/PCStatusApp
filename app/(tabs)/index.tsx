import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PCButton } from "../../components/pc-button";
import { supabase } from "../../lib/supabase";

interface PcStatus {
  last_seen: string;
  pc_name: string;
  cpu_percent: number | null;
  ram_percent: number | null;
  ram_used: number | null;
  ram_total: number | null;
  temperature: number | null;
}

export default function DesktopScreen() {
  const [loadingCmd, setLoadingCmd] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [status, setStatus] = useState<PcStatus | null>(null);

  const checkOnline = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("pc_online")
      .select(
        "last_seen, pc_name, cpu_percent, ram_percent, ram_used, ram_total, temperature",
      )
      .eq("user_id", user.id)
      .single();

    if (data) {
      const lastSeen = new Date(data.last_seen);
      const now = new Date();
      const diffSeconds = (now.getTime() - lastSeen.getTime()) / 1000;
      setIsOnline(diffSeconds < 6);
      setStatus(data);
    }
  };

  useEffect(() => {
    checkOnline();
    const interval = setInterval(checkOnline, 1000);
    return () => clearInterval(interval);
  }, []);

  const confirmAndSend = (command: "restart" | "shutdown") => {
    const labels = { restart: "재시작", shutdown: "종료" };
    Alert.alert(
      `PC ${labels[command]}`,
      `정말 PC를 ${labels[command]}하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        { text: labels[command], style: "destructive", onPress: () => sendCommand(command) },
      ]
    );
  };

  const sendCommand = async (command: string) => {
    setLoadingCmd(command);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("오류", "로그인이 필요합니다");
      setLoadingCmd(null);
      return;
    }

    const { error } = await supabase
      .from("commands")
      .insert({ user_id: user.id, command, is_executed: false });

    if (error) {
      Alert.alert("오류", error.message);
    } else {
      const labels: Record<string, string> = {
        lock: "화면 잠금",
        restart: "재시작",
        shutdown: "종료",
      };
      Alert.alert("완료", `${labels[command]} 명령을 전송했습니다`);
    }
    setLoadingCmd(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.statusContainer,
          !isOnline && styles.statusContainerOffline,
        ]}
      >
        <View style={styles.checkconn}>
          <Image
            source={require("../../assets/images/desktop_image.png")}
            style={{ width: 180, height: 180 }}
          />
          <Text style={styles.subtitle}>
            {isOnline ? "🟢 PC 연결 됨" : "🔴 PC 연결 끊김"}
          </Text>
        </View>

        <View style={styles.checkHardware}>
          {isOnline && status && (
            <>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.pcName}
              >
                PC: {status.pc_name}
              </Text>
              <Text>CPU: {status.cpu_percent?.toFixed(1)}%</Text>
              <Text>온도: {status.temperature?.toFixed(1)}°C</Text>
              <Text>
                RAM: {status.ram_used?.toFixed(1)} /{" "}
                {status.ram_total?.toFixed(1)} GB
              </Text>
              <Text>RAM 사용률: {status.ram_percent?.toFixed(1)}%</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.grayLine} />

      <View style={styles.skillContainer}>
        <PCButton
          icon={<AntDesign name="lock" size={30} color="white" />}
          label="화면 잠금"
          onPress={() => sendCommand("lock")}
          disabled={!isOnline || loadingCmd !== null}
          loading={loadingCmd === "lock"}
        />
        <PCButton
          icon={
            <MaterialCommunityIcons name="restart" size={30} color="white" />
          }
          label="재시작"
          onPress={() => confirmAndSend("restart")}
          disabled={!isOnline || loadingCmd !== null}
          loading={loadingCmd === "restart"}
        />
        <PCButton
          icon={
            <MaterialCommunityIcons
              name="power-standby"
              size={30}
              color="white"
            />
          }
          label="종료"
          onPress={() => confirmAndSend("shutdown")}
          disabled={!isOnline || loadingCmd !== null}
          loading={loadingCmd === "shutdown"}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: "#ffffff",
  },
  statusContainer: {
    flexDirection: "row",
    gap: 10,
  },
  statusContainerOffline: {
    justifyContent: "center",
  },
  checkconn: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkHardware: {
    justifyContent: "space-between",
    marginBottom: 25,
    marginTop: 40,
    gap: 15,
  },
  skillContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
  },
  pcName: {
    maxWidth: 140,
  },
  grayLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#DEDEDE",
    marginVertical: 10,
  },
});
