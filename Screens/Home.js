// screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, FlatList, Button, TouchableOpacity,  Alert, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Menu, IconButton, Provider } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";


const HomeScreen = () => {
  const [notes, setNotes] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedNote, setsSelectedNote] = useState(true);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);


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
    setSelectedNotes([]); // Clear selected notes when exiting selection mode
  };

  const toggleNoteSelection = (noteId) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <Provider>
      <View style={styles.layout}>
        <View style={styles.topBar}>
          {selectMode ? (
            <TouchableOpacity onPress={toggleSelectionMode} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          ) : (
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon="dots-horizontal"
                  size={24}
                  onPress={openMenu}
                  color="#333"
                />
              }
            >
              <Menu.Item onPress={() => { toggleSelectionMode(); closeMenu(); }} title="Select" />
              <Menu.Item onPress={() => alert("Other Option")} title="Other Option" />
            </Menu>
          )}
          {selectMode && (
            <Text style={styles.selectedCount}>
              {selectedNotes.length} selected
            </Text>
          )}
        </View>
        
      {notes.length > 0 ? (
        <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => selectMode ? toggleNoteSelection(item.id):navigation.navigate('Note', { note: item })}>
            <View style={styles.noteItem}>
              {selectMode && (
                <Ionicons
                  name={selectedNotes.includes(item.id) ? "checkbox" : "square-outline"}
                  size={24}
                  color="#333"
                  onPress={() => toggleNoteSelection(item.id)}
                />
              )}
              <Text style={styles.noteText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
          </ScrollView>
        )}
      />
      ) : (
        <Text>Add your first Note!</Text>
      )}

      {!selectMode ? (
        <Button title="Add Note" onPress={addNote} />
      ) : (
        <Button title="Delete Selected" color="red" onPress={deleteSelectedNotes} />
      )}
    </View>
  </Provider>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1, 
    padding: 20
  },
  scrollContainer: {
    paddingVertical: 5,
    paddingBottom: 20 // Adds some padding at the bottom for easier scrolling
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
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
