import { UserProfileView } from "@clerk/expo/native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  return (
    <SafeAreaView  style={styles.container} edges={['top','bottom']}>
      <UserProfileView
        isDismissible={false}
        style={styles.profile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  profile: {
    flex: 1,
  },
});