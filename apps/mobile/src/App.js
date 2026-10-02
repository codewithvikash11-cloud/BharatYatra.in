import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return <SafeAreaView style={styles.page}><StatusBar barStyle="dark-content" /><View><Text style={styles.eyebrow}>BHARATYATRA</Text><Text style={styles.title}>India, thoughtfully discovered.</Text><Text style={styles.body}>Your travel guides and saved plans will live here.</Text></View></SafeAreaView>;
}

const styles = StyleSheet.create({ page: { flex: 1, justifyContent: 'center', backgroundColor: '#f5f3ec', padding: 28 }, eyebrow: { color: '#ce6b35', fontWeight: '700', letterSpacing: 3 }, title: { color: '#183333', fontSize: 40, lineHeight: 46, marginVertical: 18 }, body: { color: '#647775', fontSize: 17, lineHeight: 25 } });
