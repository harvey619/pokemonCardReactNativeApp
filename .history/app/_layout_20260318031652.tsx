import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen
      name="index"
      options={{
        title: "PokeDex"
      }} />
    <Stack.Screen
      name="details"
      options={{
        title: "Details",
        headerBackButtonDisplayMode: "minimal",
        // presentation: "formSheet",
        // sheetAllowedDetents: [0.95],
        sheetGrabberVisible: true,
        // headerShown:false,
    }} />
  </Stack>;
}
