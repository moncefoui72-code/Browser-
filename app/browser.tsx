import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { engineLabels, engineLogos } from '@/lib/engines';
import { getSuggestions } from '@/lib/search';
import { useBrowserStore, getUrlForInput, getDomain, toTitle } from '@/store/browserStore';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { searchEngine, setSearchEngine, addRecentSearch, recentSearches, createTab, setActiveTab } = useBrowserStore();
  const suggestions = useMemo(() => getSuggestions(query), [query]);

  const submit = (value: string) => {
    const next = value.trim();
    if (!next) return;
    const targetUrl = getUrlForInput(next, searchEngine);
    if (!targetUrl) return;

    const tab = createTab({
      title: toTitle(targetUrl),
      url: targetUrl,
      domain: getDomain(targetUrl),
      isPrivate: false,
      desktopMode: false,
      lastVisited: Date.now(),
    });

    addRecentSearch(next);
    setActiveTab(tab.id);
    router.push({ pathname: '/browser', params: { tabId: tab.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.engineRow}>
            {Object.entries(engineLabels).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[styles.engineChip, searchEngine === key ? styles.engineChipActive : null]}
                onPress={() => setSearchEngine(key as keyof typeof engineLabels)}
              >
                <Text style={[styles.engineText, searchEngine === key ? styles.engineTextActive : null]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.searchRow}>
          <Text style={styles.searchMark}>{engineLogos[searchEngine]}</Text>
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search or type web address..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            keyboardType="web-search"
            returnKeyType="search"
            onSubmitEditing={() => submit(query)}
          />
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Suggestions</Text>
        <View style={styles.listWrap}>
          {suggestions.length > 0 ? suggestions.map((item) => (
            <TouchableOpacity key={item.id} style={styles.listItem} onPress={() => submit(item.value)}>
              <Text style={styles.listText}>{item.label}</Text>
            </TouchableOpacity>
          )) : <Text style={styles.emptyText}>No local suggestions yet</Text>}
        </View>

        <Text style={styles.sectionTitle}>Recent searches</Text>
        <View style={styles.listWrap}>
          {recentSearches.length === 0 ? (
            <Text style={styles.emptyText}>Your recent searches will appear here.</Text>
          ) : recentSearches.map((entry) => (
            <View key={entry.id} style={styles.recentItem}>
              <TouchableOpacity style={styles.recentTextWrap} onPress={() => submit(entry.query)}>
                <Text style={styles.listText}>{entry.query}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => useBrowserStore.getState().deleteRecentSearch(entry.id)}>
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => submit(query)}>
          <Text style={styles.primaryButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, padding: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backIcon: { fontSize: 38, color: '#f8fafc', marginRight: 12 },
  engineRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, flex: 1 },
  engineChip: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  engineChipActive: { backgroundColor: '#1E60D5' },
  engineText: { color: '#f8fafc', fontSize: 15, fontWeight: '700' },
  engineTextActive: { color: '#fff' },
  searchRow: { backgroundColor: '#1E293B', borderRadius: 24, borderWidth: 1, borderColor: '#334155', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  searchMark: { color: '#60A5FA', fontSize: 24, marginRight: 10, fontWeight: '800' },
  searchInput: { flex: 1, color: '#f8fafc', fontSize: 18 },
  clearText: { color: '#cbd5e1', fontSize: 28, marginLeft: 8 },
  sectionTitle: { color: '#f8fafc', fontSize: 26, fontWeight: '800', marginTop: 20, marginBottom: 10 },
  listWrap: { backgroundColor: '#111827', borderRadius: 18, paddingVertical: 4 },
  listItem: { paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  recentItem: { paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#1E293B', flexDirection: 'row', alignItems: 'center' },
  recentTextWrap: { flex: 1 },
  listText: { color: '#f8fafc', fontSize: 18 },
  deleteText: { color: '#cbd5e1', fontSize: 28 },
  emptyText: { color: '#94A3B8', fontSize: 15, padding: 12 },
  primaryButton: { marginTop: 18, backgroundColor: '#1E60D5', borderRadius: 18, paddingVertical: 14, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});



































































































































































































































































































