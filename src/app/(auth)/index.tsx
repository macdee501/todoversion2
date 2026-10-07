import { Link, router } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function StartScreen() {
  return (
    <>
    <SafeAreaView style={styles.container}>
      <Text>Start Up Screen</Text>
      {/* Going to place a image here, this screenis intended to be a landing screen/page */}
      <View>


        <TouchableOpacity onPress={()=>router.push("/(auth)/sign-in")}  style={styles.button}>
            <Text style={styles.buttonText} >Sign In To Continue</Text>
        </TouchableOpacity>

       
       
      </View>

    </SafeAreaView>
    
    </>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: 'center',
    alignItems:"center"
  },
  button:{
    backgroundColor:"#000",
    
  },
  buttonText:{
    color:"#fff"
  }
})