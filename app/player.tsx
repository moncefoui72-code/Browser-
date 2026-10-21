import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBrowserStore } from '@/store/browserStore';

export default function HistoryScreen() {
  const router = useRouter();
  const { history, clearHistory } = useBrowserStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <TouchableOpacity onPress={() => clearHistory()}>
            <Text style={styles.action}>Clear</Text>
          </TouchableOpacity>
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nothing saved yet.</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.itemCard} onPress={() => router.push({ pathname: '/browser', params: { tabId: 'history-item' } })}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemUrl}>{item.url}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { color: '#f8fafc', fontSize: 32, fontWeight: '800' },
  action: { color: '#60A5FA', fontSize: 18, fontWeight: '700' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#94A3B8', fontSize: 20 },
  itemCard: { backgroundColor: '#1E293B', borderRadius: 14, padding: 14, marginBottom: 10 },
  itemTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '700' },
  itemUrl: { color: '#cbd5e1', marginTop: 4 },
});
