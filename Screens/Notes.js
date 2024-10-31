// screens/NoteScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoteScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const isNew = route.params?.isNew;
  const existingNote = route.params?.note;

  //const [createnew, setCreateNew] = '';
  const [title, setTitle] = useState(isNew ? '' : existingNote?.title);
  const [content, setContent] = useState(isNew ? '' : existingNote?.content);

  const saveNote = async () => {
    if (isNew) {
      const id = new Date().getTime().toString();
      const newNote = { id, title, content };
      const storedNotes = await AsyncStorage.getItem('notes');
      const notes = storedNotes ? JSON.parse(storedNotes) : [];
      const updatedNotes = isNew ? [...notes, newNote] : notes.map(note => note.id === existingNote.id ? { ...note, title, content } : note);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      console.log('Note saved successfully');
      //setNotes(updatedNotes);
      navigation.goBack();
    } else {
      try{
        const noteid = existingNote.id
        const noteTitle = existingNote.title
        const storedNotes = await AsyncStorage.getItem('notes');
        const notes = storedNotes ? JSON.parse(storedNotes) : [];

        const updatedNotes = notes.map((note) => 
          note.id === noteid && note.title === noteTitle ? { ...note, title, content } : note
        );
        /*const id = new Date().getTime().toString();
        newnote = {id, title, content}
        const createAnotherNote = [...notes, newnote]*/

        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
        isNew = true;
        saveNote();
        navigation.goBack();
      }
      catch (error) {
      console.error('Error updating note', error);
    }

    }
  };

  const deleteNote = async () => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        onPress: async () => {
          try {
            // Retrieve the existing notes list
            const storedNotes = await AsyncStorage.getItem('notes');
            const notes = storedNotes ? JSON.parse(storedNotes) : [];
  
            // Filter out the note to delete based on its unique `noteid`
            const updatedNotes = notes.filter(note => note.id !== existingNote.id);
  
            // Save the updated notes list back to AsyncStorage
            await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
  
            console.log('Note deleted successfully');
            navigation.goBack();  // Go back after deleting
          } catch (error) {
            console.error("Failed to delete the note", error);
          }
        }
      },
    ]);
  };
  

  return (
    <View style={{ flex: 1, padding: 40}}>
      <View style = {{marginBottom:5}}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={{ fontSize: 25, marginBottom: 10 ,
            fontWeight:'bold'
          }}
        />
      </View>
      
      <ScrollView contentContainerStyle ={{paddingVertical: 5, paddingBottom: 80}}>
      <View>
        <TextInput
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
          style={{ fontSize: 15, marginBottom: 20}}
        />
      </View>
      </ScrollView>
      
      <View style={{ position: 'static', top: 10, bottom: 10, left: 0, right: 0 , alignItems: 'center'}}>
        <Button title="Save" onPress={saveNote} />
        {!isNew && (
          <View style={{ marginTop: 10 }}>
            <Button title="Delete" color="red" onPress={deleteNote} />
          </View>
        )}
      </View>
    </View>
  );
};

export default NoteScreen;
