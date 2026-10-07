import { Link, router } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { locale } from '../../../lib/appwrite'

export default function StartScreen() {

  // Testing If AppWrite Connects
  useEffect(()=>{

    const testAppwrite = async ()=>{
      try{
        // Send a request to appwrite and store whats recieved
        const response = await locale.get();

        // If we reach here, Appwrite responded successfully
        console.log("APPWRITE CONNECTED ✅");
        console.log(response);

      }
      catch(error)
      {

         // If something went wrong, display the error
        console.log("APPWRITE CONNECTION FAILED ❌");
        console.error(error);
      }
    }

    testAppwrite();

  })


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