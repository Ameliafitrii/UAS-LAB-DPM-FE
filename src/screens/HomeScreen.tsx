import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import axiosInstance from '../utils/axiosInstance';

interface HealthRecord {
  _id: string;
  title: string;
  description: string;
  value: string;
  date: string;
}

const HomeScreen = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axiosInstance.get('/healthRecords');
        setRecords(response.data);
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.error || 'Failed to fetch records.');
      }
    };

    fetchRecords();
  }, []);

  const renderNode = (record: HealthRecord) => (
    <View key={record._id} style={styles.nodeCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.nodeTitle}>{record.title}</Text>
        <Text style={styles.nodeDate}>{new Date(record.date).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.nodeDescription}>{record.description}</Text>
      <View style={styles.chartContainer}>
        <View style={[styles.chartBar, { width: `${Math.min(Number(record.value), 100)}%` }]} />
      </View>
      <Text style={styles.nodeValue}>Value: {record.value}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Health Records Overview</Text>
        <Text style={styles.subHeader}>Modern display of your health records</Text>
      </View>
      <View style={styles.recordContainer}>
        {records.map((record) => renderNode(record))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EFEFEF',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: '#777',
  },
  recordContainer: {
    marginTop: 20,
  },
  nodeCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nodeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nodeDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  chartContainer: {
    height: 10,
    backgroundColor: '#DDD',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
  },
  chartBar: {
    height: '100%',
    backgroundColor: '#333',
  },
  nodeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  nodeDate: {
    fontSize: 14,
    color: '#777',
  },
});

export default HomeScreen;
