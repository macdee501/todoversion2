import { useUser } from "@clerk/expo";
import {router,Stack,useLocalSearchParams,} from "expo-router";
import {ActivityIndicator,Alert,Pressable,StyleSheet,Text,TextInput,View,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { tablesDB } from "../../../lib/appwrite";




export default function TaskDetailsScreen() {

  // Gets the task ID from the URL.
  // Example:
  // /task/68abc123
  //
  // id = "68abc123"
  const { id } = useLocalSearchParams<{ id: string }>();


  // Gets the currently signed-in Clerk user
  const { user } = useUser();


  // Stores the task title
  const [title, setTitle] = useState("");


  // Stores the detailed task description
  const [description, setDescription] = useState("");


  // Tracks whether we're loading the task from Appwrite
  const [loading, setLoading] = useState(true);


  // Tracks whether we're currently saving changes
  const [saving, setSaving] = useState(false);



  // -----------------------------------
  // LOAD THE TASK FROM APPWRITE
  // -----------------------------------

  const getTask = async () => {

    try {

      // Ask Appwrite for one specific row
      // using the row ID from the URL
      const task = await tablesDB.getRow({

        databaseId:
          process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,

        tableId:
          process.env.EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID!,

        rowId: id,

      });


      // Basic ownership check:
      // Make sure the task belongs to the current Clerk user
      if (task.userId !== user?.id) {

        Alert.alert(
          "Access denied",
          "This task does not belong to you."
        );

        router.back();

        return;
      }


      // Put the existing Appwrite values
      // into our input fields
      setTitle(task.title);

      setDescription(
        task.description || ""
      );


    } catch (error) {

      console.log(
        "FAILED TO LOAD TASK ❌",
        error
      );

      Alert.alert(
        "Error",
        "Could not load this task."
      );


    } finally {

      setLoading(false);

    }

  };



  // -----------------------------------
  // UPDATE TASK
  // -----------------------------------

  const updateTask = async () => {

    // Don't save an empty task title
    if (!title.trim()) {

      Alert.alert(
        "Task title required",
        "Please enter a task title."
      );

      return;
    }


    try {

      setSaving(true);


      // Update the existing Appwrite row
      await tablesDB.updateRow({

        databaseId:
          process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,

        tableId:
          process.env.EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID!,

        // This tells Appwrite exactly
        // which task we want to update
        rowId: id,

        // Only these values will be changed
        data: {

          title: title.trim(),

          description:
            description.trim(),

        },

      });


      console.log(
        "TASK UPDATED ✅"
      );


      Alert.alert(
        "Saved",
        "Task updated successfully."
      );


      // Return to the previous screen
      router.back();


    } catch (error) {

      console.log(
        "FAILED TO UPDATE TASK ❌",
        error
      );

      Alert.alert(
        "Error",
        "Could not update the task."
      );


    } finally {

      setSaving(false);

    }

  };



  // -----------------------------------
  // LOAD TASK WHEN SCREEN OPENS
  // -----------------------------------

  useEffect(() => {

    if (id && user) {
      getTask();
    }

  }, [id, user]);



  // -----------------------------------
  // LOADING SCREEN
  // -----------------------------------

  if (loading) {

    return (
      <SafeAreaView style={styles.loadingContainer}>

        <ActivityIndicator size="large" />

        <Text>
          Loading task...
        </Text>

      </SafeAreaView>
    );

  }



  // -----------------------------------
  // TASK DETAILS SCREEN
  // -----------------------------------

  return (

    <SafeAreaView
      style={styles.container}
      edges={["bottom"]}
    >

      {/* Changes the navigation header title */}
      <Stack.Screen
        options={{
          title: "Task Details",
        }}
      />


      <View style={styles.content}>


        {/* TASK TITLE */}

        <Text style={styles.label}>
          Task
        </Text>

        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
        />



        {/* TASK DESCRIPTION */}

        <Text style={styles.label}>
          Description
        </Text>

        <TextInput
          style={styles.descriptionInput}

          value={description}

          onChangeText={setDescription}

          placeholder="Add more details about this task..."

          // Allows the input to use multiple lines
          multiline

          // Starts the cursor at the top
          textAlignVertical="top"
        />



        {/* SAVE BUTTON */}

        <Pressable
          style={styles.saveButton}
          onPress={updateTask}
          disabled={saving}
        >

          <Text style={styles.saveButtonText}>

            {saving
              ? "Saving..."
              : "Save Changes"}

          </Text>

        </Pressable>


      </View>

    </SafeAreaView>

  );

}



const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },


  content: {
    flex: 1,
    padding: 20,
  },


  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },


  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
  },


  titleInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 17,
  },


  descriptionInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,

    // Makes the description box much larger
    minHeight: 180,
  },


  saveButton: {
    backgroundColor: "#208AEF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },


  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

});