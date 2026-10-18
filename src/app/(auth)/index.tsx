import { Link, router } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function StartScreen() {

  


  return (
    <>
    <SafeAreaView className='flex-1 bg-[#F3F3F3]'>
      {/* App Logo Title */}

      <View
      className='items-center pt-12'
      >
        <Text
        className='text-3xl font-extrabold tracking-tight text-[#333333]'
        >
          ToDo
        </Text>
      </View>

      {/* Main Content */}
      <View
      className='flex-1 items-center justify-center px-8'
      >
        {/* Illustration Placeholder */}
        <View
        className='mb-12 h-64 w-64 items-center justify-center rounded-full bg-[#E5E5E5]'
        >
          <Text className='text-7xl'>✓</Text>
        </View>

        {/* Welcome Text */}
        <Text
        className='mb-4 text-center text-4xl font-bold text-[#303030]'
        >
          Get things done.
        </Text>

        {/* Description */}
        <Text
        className='text-center text-base leading-7 text-[#777777]'
        >
          Organise your tasks, stay, focused and keep track of every achievement
        </Text>
      </View>

      {/* Bottom Section */}
      <View
      className='px-7 pb-8'
      >
        <TouchableOpacity
        activeOpacity={0.85}
        onPress={()=> router.push("/(auth)/sign-in")}
        className='h-16 items-center justify-center rounded-2xl bg-[#424242]'
        >
          <Text
          className='text-lg font-semibold text-white'
          >
            Get Started
          </Text>
        </TouchableOpacity>

        <Text
        className='mt-5 text-center text-xs text-[#888888]'
        >
          Stay organised. Stay productive
        </Text>
      </View>
      

    </SafeAreaView>
    
    </>
  )
}

