// screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const [notes, setNotes] = useState([]);
  const navigation = useNavigation();

  // Load notes from AsyncStorage each time HomeScreen is focused
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );
  const loadNotes = async () => {
    try {
        const notesData = await AsyncStorage.getItem('notes');
        if (notesData !== null) {
            parsedNotes = JSON.parse(notesData);
            console.log(parsedNotes);
            setNotes(parsedNotes);
        } else {
            setNotes([]);
            console.log("there's no note")
        }
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
  };
  const addNote = () => {
    navigation.navigate('Note', { isNew: true });
  };

  const viewNote = (note) => {
    navigation.navigate('Note', { note });
  };

  const deleteAllNotes = async() => {
    try {
        await AsyncStorage.clear();
        console.log('All data cleared from AsyncStorage');
      } catch (error) {
        console.error('Failed to clear AsyncStorage', error);
      }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
       {notes.length > 0 ? (
        <FlatList
          data={notes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={{ fontSize: 18, padding: 10 }}>{item.title}</Text>
          )}
        />
      ) : (
        <Text>No notes available</Text>
      )}
      <Button title="Add Note" onPress={addNote} />
      <Button title="Delete All" onPress={deleteAllNotes} />
    </View>
  );
};

export default HomeScreen;
