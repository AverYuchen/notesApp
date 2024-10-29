// screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, Checkbox,  Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";


const HomeScreen = () => {
  const [notes, setNotes] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedNote, setsSelectedNote] = useState(true);
  const [selectedNotes, setSelectedNotes] = useState([]);
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

  const deleteSelectedNotes = async () => {
    if (selectedNotes.length === 0) {
      // If no notes are selected, delete all notes
      Alert.alert(
        'Delete All Notes',
        'Are you sure you want to delete all notes?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete All',
            style: 'destructive',
            onPress: async () => {
              await AsyncStorage.clear();
              setNotes([]);
              console.log('All notes have been deleted');
              setSelectMode(false);
            },
          },
        ]
      );
    } else {
      // Otherwise, delete only the selected notes
      const updatedNotes = notes.filter(note => !selectedNotes.includes(note.id));
      setNotes(updatedNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setSelectedNotes([]);
      setSelectMode(false);
      Alert.alert('Selected notes deleted successfully');
    }
  };

  const toggleSelectionMode = () => {
    setSelectMode(!selectMode);
    setSelectMode([]); // Clear selected notes when exiting selection mode
  };

  const toggleNoteSelection = (noteId) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {selectMode && (
        <View style={styles.topBar}>
          <TouchableOpacity onPress={toggleSelectionMode} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.selectedCount}>
            {selectedNotes.length} selected
          </Text>
        </View>
      )}

      {notes.length > 0 ? (
        <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectedNote ? navigation.navigate('Note', { note: item }) : ''}>
            <View style={styles.noteItem}>
              {selectMode && (
                <Ionicons
                  name={selectedNotes.includes(item.id) ? "checkbox" : "square-outline"}
                  size={24}
                  color="#333"
                  onPress={() => selectedNotes(item.id)}
                />
              )}
              <Text style={styles.noteText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      ) : (
        <Text>No notes available</Text>
      )}
      {!selectMode ? (
        <Button title="Add Note" onPress={addNote} />
      ) : (
        <Button title="Delete Selected" color="red" onPress={deleteSelectedNotes} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f1f1f1',
  },
  closeButton: {
    padding: 5,
  },
  selectedCount: {
    fontSize: 18,
    color: '#333',
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noteText: {
    fontSize: 18,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default HomeScreen;
