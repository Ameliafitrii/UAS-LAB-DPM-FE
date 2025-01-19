import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import axiosInstance from '../utils/axiosInstance';

interface HealthRecord {
  _id: string;
  title: string;
  description: string;
  value: string;
  date: string;
}

const HealthRecordScreen = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axiosInstance.get('/healthRecords');
        setRecords(response.data);
      } catch (error: any) {
        console.error('Error fetching health records:', error.response?.data?.error || 'Server error');
      }
    };

    fetchRecords();
  }, []);

  const renderRecord = (record: HealthRecord) => (
    <View key={record._id} style={styles.recordCard}>
      <Text style={styles.recordTitle}>{record.title}</Text>
      <Text style={styles.recordDescription}>{record.description}</Text>
      <Text style={styles.recordValue}>Value: {record.value}</Text>
      <Text style={styles.recordDate}>Date: {new Date(record.date).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Health Records</Text>
      {records.length > 0 ? (
        records.map(renderRecord)
      ) : (
        <Text style={styles.noDataText}>No records available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  recordTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recordDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  recordValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recordDate: {
    fontSize: 14,
    color: '#777',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
});

export default HealthRecordScreen;
