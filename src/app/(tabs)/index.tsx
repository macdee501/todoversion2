import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { ID, Query } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

import { tablesDB } from "../../../lib/appwrite";

export default function MainScreen() {
  // Gets information about the currently signed-in Clerk user
  const { user } = useUser();

  // Stores task title
  const [title, setTitle] = useState("");

  // Stores tasks received from Appwrite
  const [tasks, setTasks] = useState<any[]>([]);

  // Tracks whether we're currently adding a task
  const [addingTask, setAddingTask] = useState(false);

  // Tracks whether tasks are currently loading
  const [loading, setLoading] = useState(true);

  // Get incomplete tasks
  const getTasks = async () => {
    if (!user) return;

    try {
      const response = await tablesDB.listRows({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId: process.env.EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID!,
        queries: [
          Query.equal("userId", [user.id]),
          Query.equal("completed", [false]),
          Query.orderDesc("$createdAt"),
        ],
      });

      setTasks(response.rows);

      console.log("User Tasks:", response.rows);
    } catch (error) {
      console.log("FAILED TO LOAD TASKS ❌");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!user) return;

    if (!title.trim()) return;

    try {
      setAddingTask(true);

      const newTask = await tablesDB.createRow({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId: process.env.EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID!,
        rowId: ID.unique(),
        data: {
          title: title.trim(),
          completed: false,
          userId: user.id,
        },
      });

      console.log("TASK CREATED ✅");
      console.log(newTask);

      // Add new task to the top of the list
      setTasks((currentTasks) => [
        newTask,
        ...currentTasks,
      ]);

      // Clear input
      setTitle("");
    } catch (error) {
      console.log("FAILED TO CREATE TASK ❌");
      console.error(error);
    } finally {
      setAddingTask(false);
    }
  };

  // Complete a task
  const completeTask = async (taskId: string) => {
    try {
      await tablesDB.updateRow({
        databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId: process.env.EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID!,
        rowId: taskId,
        data: {
          completed: true,
        },
      });

      console.log("Task complete ✅");

      // Remove completed task from Home
      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.$id !== taskId
        )
      );
    } catch (error) {
      console.error("FAILED TO COMPLETE TASK ❌");
      console.error(error);
    }
  };

  // Swipe right-side action
  const rightSwipeAction = (taskId: string) => {
    return (
      <Pressable
        onPress={() => completeTask(taskId)}
        className="
          mb-3 ml-2 w-28
          items-center justify-center
          rounded-2xl
          bg-zinc-800
          active:bg-zinc-700
        "
      >
        <Text className="text-sm font-semibold text-white">
          ✓ Complete
        </Text>
      </Pressable>
    );
  };

  // Load tasks when user becomes available
  useEffect(() => {
    if (user) {
      getTasks();
    }
  }, [user?.id]);

  return (
    <SafeAreaView className="flex-1 bg-zinc-100">
      <View className="flex-1 px-5 pt-3">

        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-zinc-900">
            My Tasks
          </Text>

          <Text className="mt-1 text-sm text-zinc-500">
            Welcome back
            {user?.firstName
              ? `, ${user.firstName}`
              : ""}
          </Text>
        </View>

        {/* Add Task */}
        <View className="mb-6 flex-row items-center gap-3">

          <TextInput
            className="
              h-12 flex-1
              rounded-2xl
              border border-zinc-300
              bg-white
              px-4
              text-base text-zinc-900
            "
            placeholder="What needs to be done?"
            placeholderTextColor="#A1A1AA"
            value={title}
            onChangeText={setTitle}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />

          <Pressable
            onPress={addTask}
            disabled={addingTask || !title.trim()}
            className={`
              h-12 min-w-[90px]
              items-center justify-center
              rounded-2xl px-4
              ${
                addingTask || !title.trim()
                  ? "bg-zinc-400"
                  : "bg-zinc-800 active:bg-zinc-700"
              }
            `}
          >
            <Text className="font-semibold text-white">
              {addingTask ? "Adding..." : "Add"}
            </Text>
          </Pressable>
        </View>

        {/* Section Header */}
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-zinc-800">
            To Do
          </Text>

          {!loading && (
            <View className="rounded-full bg-zinc-200 px-3 py-1">
              <Text className="text-xs font-semibold text-zinc-600">
                {tasks.length}{" "}
                {tasks.length === 1 ? "task" : "tasks"}
              </Text>
            </View>
          )}
        </View>

        {/* Loading */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color="#3F3F46"
            />

            <Text className="mt-4 text-sm text-zinc-500">
              Loading your tasks...
            </Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.$id}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: 30,
              flexGrow: tasks.length === 0 ? 1 : undefined,
            }}
            renderItem={({ item }) => (
              <Swipeable
                renderRightActions={() =>
                  rightSwipeAction(item.$id)
                }
                rightThreshold={40}
                overshootRight={false}
              >
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/task/[id]",
                      params: {
                        id: item.$id,
                      },
                    })
                  }
                  className="
                    mb-3
                    rounded-2xl
                    border border-zinc-200
                    bg-white
                    p-4
                    active:bg-zinc-50
                  "
                >
                  {/* Task Header */}
                  <View className="flex-row items-start">

                    {/* Small task indicator */}
                    <View className="mr-3 mt-1 h-3 w-3 rounded-full bg-zinc-800" />

                    <View className="flex-1">
                      <Text className="text-base font-semibold text-zinc-900">
                        {item.title}
                      </Text>

                      {item.description ? (
                        <Text className="mt-1 text-sm leading-5 text-zinc-500">
                          {item.description}
                        </Text>
                      ) : (
                        <Text className="mt-1 text-sm text-zinc-400">
                          Tap to add details
                        </Text>
                      )}
                    </View>

                    {/* Arrow */}
                    <Text className="ml-3 text-xl text-zinc-300">
                      ›
                    </Text>
                  </View>
                </Pressable>
              </Swipeable>
            )}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center px-8">

                <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-zinc-200">
                  <Text className="text-2xl text-zinc-500">
                    ✓
                  </Text>
                </View>

                <Text className="text-center text-lg font-semibold text-zinc-800">
                  You're all caught up
                </Text>

                <Text className="mt-2 text-center text-sm leading-5 text-zinc-500">
                  Add a task above and it will appear here.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}