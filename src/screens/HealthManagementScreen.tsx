import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axiosInstance from '../utils/axiosInstance';

interface HealthRecord {
  _id: string;
  title: string;
  description: string;
  value: string;
  date: string;
}

const HealthManagementScreen = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/healthRecords');
      setRecords(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to fetch records.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateRecord = async () => {
    if (!title || !description || !value || !date) {
      Alert.alert('Validation', 'All fields are required.');
      return;
    }

    try {
      if (editMode && editingId) {
        await axiosInstance.put(`/healthRecords/${editingId}`, { title, description, value, date });
        Alert.alert('Success', 'Record updated successfully!');
      } else {
        const response = await axiosInstance.post('/healthRecords', { title, description, value, date });
        Alert.alert('Success', 'Record added successfully!');
        setRecords((prev) => [...prev, response.data]);
      }
      resetForm();
      fetchRecords();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to save record.');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await axiosInstance.delete(`/healthRecords/${id}`);
      Alert.alert('Success', 'Record deleted successfully!');
      fetchRecords();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to delete record.');
    }
  };

  const handleEditRecord = (record: HealthRecord) => {
    setTitle(record.title);
    setDescription(record.description);
    setValue(record.value);
    setDate(record.date);
    setEditMode(true);
    setEditingId(record._id);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setValue('');
    setDate('');
    setEditMode(false);
    setEditingId(null);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const renderRecordCard = ({ item }: { item: HealthRecord }) => (
    <View style={styles.recordCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleEditRecord(item)}>
          <AntDesign name="edit" size={20} color="#555" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardText}><Text style={styles.cardLabel}>Description:</Text> {item.description}</Text>
        <Text style={styles.cardText}><Text style={styles.cardLabel}>Value:</Text> {item.value}</Text>
        <Text style={styles.cardText}><Text style={styles.cardLabel}>Date:</Text> {new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteRecord(item._id)}>
        <AntDesign name="delete" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Health Management</Text>
      <View style={styles.formCard}>
        <Text style={styles.formHeader}>{editMode ? 'Edit Record' : 'Add New Record'}</Text>
        <View style={styles.inputContainer}>
          <AntDesign name="infocirlceo" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.inputContainer}>
          <AntDesign name="medicinebox" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <View style={styles.inputContainer}>
          <AntDesign name="sharealt" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Value"
            value={value}
            onChangeText={setValue}
          />
        </View>
        <View style={styles.inputContainer}>
          <AntDesign name="calendar" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
        </View>
        <Pressable style={styles.addButton} onPress={handleAddOrUpdateRecord}>
          <Text style={styles.addButtonText}>{editMode ? 'Update Record' : 'Add Record'}</Text>
        </Pressable>
      </View>
      <FlatList
        data={records}
        keyExtractor={(item) => item._id}
        renderItem={renderRecordCard}
        refreshing={loading}
        onRefresh={fetchRecords}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingTop: 50,
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  formHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  recordCard: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    marginBottom: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#DDD',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  cardLabel: {
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#444',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
});

export default HealthManagementScreen;