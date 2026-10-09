import { useUser } from "@clerk/expo";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import { tablesDB } from "../../../lib/appwrite";

export default function MainScreen() {

  // Gets information about the currently signed-in Clerk user
  const{user} = useUser()
  console.log(user)

  // Stores Task Title
  const [title,setTitle] = useState('')

    // Stores the tasks that we receive from Appwrite
  const [tasks, setTasks] = useState<any[]>([]);

  // Tracks whether we're currently adding a task
  const [addingTask, setAddingTask] = useState(false);

 // Keeps track of whether tasks are currently being loaded
 const [loading,setLoading] = useState(true);


//  function to get tasks
 const getTasks = async () =>{

  if(!user) return;

  try{
    const response = await tablesDB.listRows({
      databaseId:process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId:process.env.EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID!,
      queries:[
      Query.equal("userId",[user.id]),
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

//  function to add task
const addTask= async()=>{
  if(!user) return;

  if(!title.trim()) return;

  try{
    setAddingTask(true);

    const newTask = await tablesDB.createRow({
       databaseId:process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
       tableId:process.env.EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID!,
       rowId:ID.unique(),
       data:{
        title:title.trim(),
        completed:false,
        userId:user.id,
       }

    });
    console.log("TASK CREATED ✅");
    console.log(newTask);

    setTasks((currentTasks)=>[
      newTask,...currentTasks
    ])

    setTitle('')
  }
  catch(error)
  {
    console.log("FAILED TO CREATE TASK ❌");
      console.error(error);
  }
  finally{
    setAddingTask(false)
  }
}

   // Runs when this screen first loads
   useEffect(()=>{
        
   if(user){
    getTasks();
   }
    
   },[user])

 


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>
        My Tasks
      </Text>

      {/* Add Task Form */}
      <View style={styles.addTaskContainer}>
        <TextInput
        style={styles.input}
        placeholder="Enter a new task"
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={addTask}
        returnKeyType="done"
        />
        <Pressable
        style={styles.addButton}
        onPress={addTask}
        disabled={addingTask}
        >

        <Text
        style={styles.addButtonText}
        >
          {addingTask?"Adding...":"Add Task"}
        </Text>
        </Pressable>

      </View>

      {/* Task List */}
      {loading ? (
        <Text>Tasks  Are Loading</Text>
      ):(
        <FlatList
        data={tasks}
        keyExtractor={(item)=> item.$id}
        renderItem={({item})=>(
          <View style={styles.task}>
            <Text style={styles.taskTitle}>
              {item.title}
            </Text>
          </View>
        )}

        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Currently dont have any tasks
          </Text>
        }
        />
      )}

    
    

   
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },


  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
  },


  addTaskContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },


  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },


  addButton: {
    backgroundColor: "#208AEF",
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 10,
  },


  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },


  task: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },


  taskTitle: {
    fontSize: 16,
  },


  emptyText: {
    textAlign: "center",
    marginTop: 30,
  },

});