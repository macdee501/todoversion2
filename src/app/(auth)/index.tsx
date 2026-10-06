import { Link } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function StartScreen() {
  return (
    <>
    <SafeAreaView>
      <Text>Start Up Screen</Text>
      <View>
        <TouchableOpacity>
            Sign In To Continue
        </TouchableOpacity>

       
       
      </View>

    </SafeAreaView>
    
    </>
  )
}