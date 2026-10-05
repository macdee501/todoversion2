import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/expo'
import { Redirect } from 'expo-router'

export default function index() {
  const { isLoaded, isSignedIn } = useAuth()

 

  // if (!isLoaded) {
  //   return (
  //     <Redirect href={"/"}/>
  //   )
  // }

  if(!isSignedIn){
    return <Redirect href={"/sign-in"}/>

  }

  return (
    <View >
      <Text>
        Lnding Page
      </Text>
    </View>
  )
}


