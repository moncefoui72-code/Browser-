import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { engineLabels, engineLogos } from '@/lib/engines';
import { getSuggestions } from '@/lib/search';
import { useBrowserStore, getUrlForInput, getDomain, toTitle } from '@/store/browserStore';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [query, setQuery] = useState(String(params.query ?? ''));
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
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
          <View style={styles.enginePicker}>
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

        <View style={styles.inputRow}>
          <Text style={styles.searchMark}>{engineLogos[searchEngine]}</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search or type web address..."
            placeholderTextColor="#94A3B8"
            autoFocus
            style={styles.input}
            keyboardType="web-search"
            returnKeyType="search"
            onSubmitEditing={() => submit(query)}
          />
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
        </View>

        <View style={styles.suggestionsBox}>
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <TouchableOpacity key={item.id} style={styles.suggestionItem} onPress={() => submit(item.value)}>
                <Text style={styles.suggestionText}>{item.label}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No local suggestions yet</Text>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent searches</Text>
        </View>

        <ScrollView style={styles.recentBox}>
          {recentSearches.length === 0 ? (
            <Text style={styles.emptyText}>Your recent searches will appear here.</Text>
          ) : (
            recentSearches.map((entry) => (
              <View key={entry.id} style={styles.recentRow}>
                <TouchableOpacity style={styles.recentTextWrap} onPress={() => submit(entry.query)}>
                  <Text style={styles.recentText}>{entry.query}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => useBrowserStore.getState().deleteRecentSearch(entry.id)}>
                  <Text style={styles.deleteButton}>×</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={styles.submitButton} onPress={() => submit(query)}>
          <Text style={styles.submitLabel}>Search</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, padding: 16, backgroundColor: '#0F172A' },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  back: { fontSize: 38, color: '#f8fafc', marginRight: 12 },
  enginePicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, flex: 1 },
  engineChip: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#1E293B', borderRadius: 18, borderWidth: 1, borderColor: '#334155' },
  engineChipActive: { backgroundColor: '#1E60D5' },
  engineText: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  engineTextActive: { color: '#fff' },
  inputRow: { backgroundColor: '#1E293B', borderRadius: 24, borderWidth: 1, borderColor: '#334155', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  searchMark: { fontSize: 24, fontWeight: '800', color: '#60A5FA', marginRight: 10 },
  input: { flex: 1, color: '#f8fafc', fontSize: 18 },
  clearText: { fontSize: 26, color: '#cbd5e1', marginLeft: 8 },
  sectionHeader: { marginTop: 20, marginBottom: 10 },
  sectionTitle: { color: '#f8fafc', fontSize: 24, fontWeight: '800' },
  suggestionsBox: { backgroundColor: '#111827', borderRadius: 18, padding: 4 },
  suggestionItem: { paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  suggestionText: { color: '#f8fafc', fontSize: 18 },
  recentBox: { maxHeight: 220 },
  recentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1E293B', paddingVertical: 12 },
  recentTextWrap: { flex: 1 },
  recentText: { color: '#f8fafc', fontSize: 18 },
  deleteButton: { fontSize: 28, color: '#cbd5e1' },
  submitButton: { marginTop: 18, backgroundColor: '#1E60D5', borderRadius: 18, paddingVertical: 14, alignItems: 'center' },
  submitLabel: { color: '#fff', fontWeight: '800', fontSize: 18 },
  emptyText: { color: '#94A3B8', fontSize: 15, padding: 12 },
});
