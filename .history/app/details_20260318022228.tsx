import { ScrollView, StyleSheet } from "react-native";



export default function Details() {


  
  
  return (
    <ScrollView
      contentContainerStyle={{ 
        gap: 16,
        padding: 16,
        
       }}
    >
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'grey',
    textAlign:"center"
  }
})
