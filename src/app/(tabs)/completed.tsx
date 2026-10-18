import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { tablesDB } from "../../../lib/appwrite";
import { useUser } from "@clerk/expo";
import { Query } from "react-native-appwrite";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

export default function Completed() {

  // Gets information about the currently signed-in Clerk user
  const { user } = useUser();


  // Stores completed tasks received from Appwrite
  const [tasks, setTasks] = useState<any[]>([]);


  // Tracks whether tasks are currently loading
  const [loading, setLoading] = useState(true);



  // Gets completed tasks from Appwrite
  const getTasks = async () => {

    // Stop if Clerk hasn't loaded the user yet
    if (!user) return;


    try {

      const response = await tablesDB.listRows({

        databaseId:
          process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,

        tableId:
          process.env.EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID!,

        queries: [

          // Only tasks belonging to the current user
          Query.equal("userId", [user.id]),

          // Only completed tasks
          Query.equal("completed", [true]),

          // Newest tasks first
          Query.orderDesc("$createdAt"),

        ],

      });


      // Store returned rows in state
      setTasks(response.rows);


      console.log(
        "Completed Tasks:",
        response.rows
      );


    } catch (error) {

      console.log(
        "FAILED TO LOAD COMPLETED TASKS ❌"
      );

      console.error(error);


    } finally {

      setLoading(false);

    }

  };



  // Runs every time this tab becomes active
  useFocusEffect(

    useCallback(() => {

      // Show loading while refreshing
      setLoading(true);

      if (user) {
        getTasks();
      }

    }, [user])

  );



  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>
        Completed Tasks
      </Text>


      {loading ? (

        <Text>
          Getting Tasks...
        </Text>

      ) : (

        <FlatList

          data={tasks}

          keyExtractor={(item) =>
            item.$id
          }

          renderItem={({ item }) => (

            <View style={styles.task}>

              <Text style={styles.taskTitle}>
                ✓ {item.title}
              </Text>


              {item.description ? (

                <Text style={styles.description}>
                  {item.description}
                </Text>

              ) : null}

            </View>

          )}


          ListEmptyComponent={

            <Text style={styles.emptyText}>
              No completed tasks yet
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

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
  },

  task: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  description: {
    marginTop: 5,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
  },

});