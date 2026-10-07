import { Client, Locale, TablesDB } from "react-native-appwrite";
import "react-native-url-polyfill/auto";



//Creates a connection with appwrite and pin points which project im working in
const client = new Client().setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!).setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!).setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

// Creates a TablesDB service using the configured Appwrite client
// We will use tablesDB to create, read, update, and delete rows in our databas
export const tablesDB = new TablesDB(client);

// Used temporarily to test our Appwrite connection
export const locale = new Locale(client);

// Exports the Appwrite client so it can be imported and used in other files
export default client;