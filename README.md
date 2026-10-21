import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlayerScreen() {
  const router = useRouter();
  const [playing, setPlaying] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Player</Text>
        </View>

        <View style={styles.playerArea}>
          <Text style={styles.placeholder}>Built-in player placeholder</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setPlaying(!playing)}>
            <Text style={styles.controlText}>{playing ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.controlText}>10s</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.controlText}>1×</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.controlText}>Full</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  back: { color: '#f8fafc', fontSize: 34, marginRight: 14 },
  title: { color: '#f8fafc', fontSize: 24, fontWeight: '700' },
  playerArea: { flex: 1, backgroundColor: '#111827', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  placeholder: { color: '#94A3B8', fontSize: 18 },
  controls: { marginTop: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 12 },
  controlText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
