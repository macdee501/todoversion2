import { useAuth, useSession, useUser } from '@clerk/expo'
import { AuthView } from '@clerk/expo/native'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Button, Modal, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignInScreen() {

  const { session } = useSession()
  const router = useRouter()

  // useEffect Hook intended to run immediately as this screen loads
  // to check if theres a user with a session and if theres is redirect
  // to the actual home screen
  useEffect(() => {
    if (session?.status === 'active') {
      router.replace('/(home)')
    }
  }, [session?.status, router])

  return( 
  <AuthView isDismissible={false} mode='signInOrUp'/>
)
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingLeft:5,
    
  }
})