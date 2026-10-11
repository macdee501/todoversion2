import { FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { tablesDB } from '../../../lib/appwrite';
import { useUser } from '@clerk/expo';
import { Query } from 'react-native-appwrite';
import { useEffect, useState } from 'react';

export default function completed() {
   // Gets information about the currently signed-in Clerk user
    const{user} = useUser()
    // Stores the tasks that we receive from Appwrite
      const [tasks, setTasks] = useState<any[]>([]);

      // Keeps track of whether tasks are currently being loaded
 const [loading,setLoading] = useState(true);


   const getTasks = async () =>{
  
    if(!user) return;
  
    try{
      const response = await tablesDB.listRows({
        databaseId:process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId:process.env.EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID!,
        queries:[
        Query.equal("userId",[user.id]),
        Query.equal("completed",[true]),
        Query.orderDesc("$createdAt")
      ]
      });
      setTasks(response.rows);
      console.log("User Tasks:",response.rows)
    }
    catch(error)
    {
      console.log("FAILED TO LOAD TASKS ❌");
      console.error(error);
    }
    finally
    {
      setLoading(false)
    }
  
   }

    // Runs when this screen first loads
      useEffect(()=>{
           
      if(user){
       getTasks();
      }
       
      },[user])
  return (
    <SafeAreaView>

      <Text>Completed Tasks</Text>
      {loading?(
        <Text>Getting Tasks</Text>
      ):(
        <FlatList
        data={tasks}
        keyExtractor={(item)=> item.$id}
        renderItem={({item})=>(

                  <View>
                    <Text >
                      {item.title}
                    </Text>
                  </View>
                 
                )}
        />
      )}

    </SafeAreaView>
    
  )
}