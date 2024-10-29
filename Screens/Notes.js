// screens/NoteScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoteScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const isNew = route.params?.isNew;
  const existingNote = route.params?.note;
  //const saveNote = route.params?.saveNote;

  const [title, setTitle] = useState(isNew ? '' : existingNote?.title);
  const [content, setContent] = useState(isNew ? '' : existingNote?.content);
  
  const saveNote = async (newNote) => {
    try {
      // Retrieve the current notes from storage
      const existingNotes = await AsyncStorage.getItem('notes');
      const notes = existingNotes ? JSON.parse(existingNotes) : [];
  
      // Add the new note to the array
      notes.push(newNote);
  
      // Save the updated notes array back to AsyncStorage
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      console.log('Note saved successfully');
    } catch (error) {
      console.error('Failed to save the note to storage', error);
    }
  };

  const saveNewNote = async () => {
    const id = new Date().getTime().toString();
    const newNote = { id, title, content };
    const storedNotes = await AsyncStorage.getItem('notes');
    const notes = storedNotes ? JSON.parse(storedNotes) : [];
    const updatedNotes = isNew ? [...notes, newNote] : notes.map(note => note.id === existingNote.id ? { ...note, title, content } : note);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    console.log('Note saved successfully');
    //setNotes(updatedNotes);
    navigation.goBack();
  };

  const deleteNote = async () => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: async () => {
          const storedNotes = await AsyncStorage.getItem('notes');
          const notes = storedNotes ? JSON.parse(storedNotes) : [];
          const updatedNotes = notes.filter(note => note.id !== existingNote.id);
          await saveNote(updatedNotes);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ fontSize: 20, marginBottom: 20 }}
      />
      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
        style={{ fontSize: 16, marginBottom: 20 }}
      />
      <Button title="Save" onPress={saveNewNote} />
      {!isNew && (
        <Button title="Delete" color="red" onPress={deleteNote} />
      )}
    </View>
  );
};

export default NoteScreen;
