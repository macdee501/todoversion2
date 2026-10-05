import { useAuth, useSignUp } from '@clerk/expo'
import { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'

export default function MainScreen() {
  const { isLoaded, isSignedIn } = useAuth()
  const { signUp } = useSignUp()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  // const [isVerifying, setIsVerifying] = useState(false)

  const handleSignUp = async () => {

    
    const { error } = await signUp.password({ emailAddress, password })
    if (error) {
     console.log(error)
      return
    }

  
  }



  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return (
      <View style={styles.container}>
        <Text>You're signed in</Text>
      </View>
    )
  }

  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button title="Sign up" onPress={handleSignUp} />
      <View nativeID="clerk-captcha" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
})