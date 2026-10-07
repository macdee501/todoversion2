import { useUser } from "@clerk/expo";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { tablesDB } from "../../../lib/appwrite";

export default function MainScreen() {

  // Gets information about the currently signed-in Clerk user
  const{user} = useUser()
  console.log(user)

    // Stores the tasks that we receive from Appwrite
  const [tasks, setTasks] = useState<any[]>([]);

 // Keeps track of whether tasks are currently being loaded
 const [loading,setLoading] = useState(true);

   // Runs when this screen first loads
   useEffect(()=>{
        
    // Function responsible for getting tasks from Appwrite
    const getTasks = async()=>{
      try{
        const response = await tablesDB.listRows({
          databaseId:process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
          tableId:process.env.EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID!
        })

        console.log("Task:",response.rows)
        // Save the returned tasks in aa array
        setTasks(response.rows)
        
      }
      catch(error)
      {
        console.error(error)

      }
      finally{
        setLoading(false)
      }
    }

    // invoke function
    getTasks();
    
   },[])

 


  return (
    <SafeAreaView style={styles.container}>

    

      {/* Display the signed-in Clerk user's name */}
    <Text>Welcome:{user?.fullName}</Text>
    
    {loading ?(
      <Text>
        Loading Tasks.....
      </Text>
    ):(
      <FlatList
      data={tasks}
      // Appwrite gives every row a unique $id
      keyExtractor={(item) => item.$id}
      renderItem={({item})=>(
        <View>
          <Text>
            {item.title}
          </Text>
        </View>
      )}
      />
    )}
    

   
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
});