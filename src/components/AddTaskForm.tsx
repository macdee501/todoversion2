import { useUser } from '@clerk/expo';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Text, View } from 'react-native';
import { ID } from 'react-native-appwrite';
import { Pressable, TextInput } from 'react-native-gesture-handler';
import { tablesDB } from '../../lib/appwrite';
import DateTimePicker from "@react-native-community/datetimepicker";


// Allowed priority values
type Priority = "low" | "medium" | "high";

// Props Recievied from home screen
type AddTaskFormProps = {
    onCreated:() => void | Promise<void>;
    onCancel:()=> void;

}

// Format a date as YYYY_MM_DD fro display
function formatDate(date:Date)
{
const year = date.getFullYear();
const month = String(date.getMonth()+1).padStart(2,"0");
const day = String(date.getDate()).padStart(2,"0");

return `${year}-${month}-${day}`;

}

function toAppwriteDate(date:Date)
{
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        )
    ).toISOString();
}





export default function AddTaskForm({onCreated,onCancel}:AddTaskFormProps)
{
    // getUser
    const {user} = useUser();

    const [title,setTitle] = useState('');
    const [dueDate,setDueDate]= useState<Date |null>(new Date())
    const [priority,setPriority]= useState<Priority>("medium");
    const [showDatePicker,setShowDatePicker]= useState(false);
    const [saving,setSaving]= useState(false);
    const priorities: Priority[]= ["low","medium","high"];

    async function handleCreateTask()
    {
        const trimmedTitle = title.trim();

        if(!trimmedTitle){
            Alert.alert("Missing Title", "Enter Task Title");
            return;
        }

        if(!user || saving) return;

        setSaving(true);

         try {
      await tablesDB.createRow({
        databaseId:
          process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        tableId:
          process.env.EXPO_PUBLIC_APPWRITE_TASKS_TABLE_ID!,
        rowId: ID.unique(),

        data: {
          title: trimmedTitle,
          completed: false,
          userId: user.id,
          priority,

          
          ...(dueDate
            ? { dueDate: toAppwriteDate(dueDate) }
            : {}),
        },
      });

      // Reset the form
      setTitle("");
      setPriority("medium");
      setDueDate(new Date());

      // Refresh tasks and close the form
      await onCreated();
    } catch (error) {
      console.error("Create task error:", error);

      Alert.alert(
        "Error",
        "Unable to create task. Please try again."
      );
    } finally {
      setSaving(false);
    }
    }

    return (
        <View>
            <Text>
                New Task
            </Text>
            <View>
              <Text>
                Task Title
            </Text>  
            <TextInput/>
            </View>
        <View>
            <Text>Due Date</Text>
            <Pressable>
                <Text>
                    {dueDate?formatDate(dueDate):"Select A Due Date"}
                </Text>
            </Pressable>
            <Pressable>
                <Text>
                    Clear Due Date
                </Text>
            </Pressable>
            {showDatePicker && (
                <DateTimePicker/>
            )}

            {showDatePicker && 
            Platform.OS ===  "ios" &&(
                <Pressable>
                    <Text>Done</Text>
                </Pressable>
            )
            }
        </View>

        {/* Priority */}
        <View>
            <Text>
                Priority
            </Text>
            <View>
                {priorities.map((option)=>{
                    const selected = priority === option;

                    return (
                        <Pressable>
                            <Text>
                                {option}
                            </Text>
                        </Pressable>
                    )
                })}
            </View>
        </View>

        {/* Action buttons */}
        <View>
                <Pressable>
                    <Text>
                        Cancel
                    </Text>
                </Pressable>
                <Pressable>
                    {saving ? (
                        <ActivityIndicator/>
                    ): (
                        <Text>
                            Save Task
                        </Text>
                    )}
                </Pressable>
        </View>
        </View>
    )

}