import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBrowserStore, getUrlForInput, getDomain, toTitle } from '@/store/browserStore';
import { shortcuts } from '@/lib/shortcuts';
import { engineLabels } from '@/lib/engines';

export default function HomeScreen() {
  const router = useRouter();
  const { searchEngine, history, addRecentSearch, createTab, setActiveTab, tabs, recentSearches } = useBrowserStore();
  const [address, setAddress] = useState('');

  const recentVisits = useMemo(() => history.slice(0, 3), [history]);

  const openQuery = (value: string) => {
    const safeQuery = value.trim();
    if (!safeQuery) return;
    const url = getUrlForInput(safeQuery, searchEngine);
    if (!url) return;

    const tab = createTab({
      title: toTitle(url),
      url,
      domain: getDomain(url),
      isPrivate: false,
      desktopMode: false,
      lastVisited: Date.now(),
    });

    addRecentSearch(safeQuery);
    setActiveTab(tab.id);
    router.push({ pathname: '/browser', params: { tabId: tab.id } });
  };

  const openShortcut = (url: string) => {
    const tab = createTab({
      title: toTitle(url),
      url,
      domain: getDomain(url),
      isPrivate: false,
      lastVisited: Date.now(),
    });
    setActiveTab(tab.id);
    router.push({ pathname: '/browser', params: { tabId: tab.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topbar}>
          <Text style={styles.time}>12:51</Text>
          <View style={styles.statusIcons}>
            <Text style={styles.statusText}>◉</Text>
            <Text style={styles.statusText}>◍</Text>
            <Text style={styles.statusText}>◌</Text>
          </View>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.addressBarPrefix}>◉</Text>
          <Text style={styles.addressText}>fastshot.ai/projects/b1</Text>
          <Text style={styles.videoBadge}>▶</Text>
          <Text style={styles.tabCount}>24</Text>
          <Text style={styles.menuDots}>⋮</Text>
        </View>

        <View style={styles.brandWrap}>
          <View style={styles.logoBlock}>
            <Text style={styles.logoM}>M</Text>
          </View>
          <Text style={styles.brandTitle}>Moncef <Text style={styles.accent}>Browser</Text></Text>
        </View>

        <View style={styles.privacyPill}>
          <Text style={styles.privacyIcon}>✓</Text>
          <Text style={styles.privacyText}>Your Privacy Matters</Text>
        </View>

        <TouchableOpacity style={styles.searchLauncher} activeOpacity={0.9} onPress={() => router.push('/search')}>
          <Text style={styles.searchEngine}>G</Text>
          <Text style={styles.searchPlaceholder}>Search or type web address...</Text>
          <View style={styles.searchActions}>
            <Text style={styles.searchAction}>◌</Text>
            <Text style={styles.searchAction}>⌁</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.shortcutGrid}>
          {shortcuts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.shortcutCard, { backgroundColor: '#1E293B' }]}
              onPress={() => openShortcut(item.url)}
            >
              <View style={[styles.shortcutCircle, { backgroundColor: item.color }]}>
                <Text style={[styles.shortcutText, { color: item.textColor ?? '#fff' }]}>{item.icon}</Text>
              </View>
              <Text style={styles.shortcutLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.visitsHeader}>
          <Text style={styles.sectionTitle}>Frequently visited</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <Text style={styles.linkText}>View all</Text>
          </TouchableOpacity>
        </View>

        {recentVisits.length > 0 ? (
          <View style={styles.visitList}>
            {recentVisits.map((entry) => (
              <TouchableOpacity key={entry.id} style={styles.visitCard} onPress={() => openQuery(entry.url)}>
                <Text style={styles.visitIcon}>◉</Text>
                <View style={styles.visitInfo}>
                  <Text style={styles.visitTitle}>{entry.title}</Text>
                  <Text style={styles.visitUrl}>{entry.url}</Text>
                </View>
                <Text style={styles.visitArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateCard}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <View style={styles.recommendedRow}>
              {['https://www.youtube.com', 'https://www.wikipedia.org'].map((url) => (
                <TouchableOpacity key={url} style={styles.recButton} onPress={() => openShortcut(url)}>
                  <Text style={styles.recLabel}>{url.includes('youtube') ? 'YouTube' : 'Wikipedia'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomButton} onPress={() => router.push('/tabs')}>
            <Text style={styles.bottomBadge}>{tabs.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => openQuery('') }>
            <Text style={styles.bottomPlus}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => router.push('/history')}>
            <Text style={styles.bottomLabel}>⟲</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => {}}>
            <Text style={styles.bottomLabel}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, paddingHorizontal: 18, backgroundColor: '#0F172A' },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 18 },
  time: { color: '#fff', fontSize: 28, fontWeight: '700' },
  statusIcons: { flexDirection: 'row', gap: 8 },
  statusText: { color: '#fff', fontSize: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4F46E5', borderRadius: 24, paddingVertical: 12, paddingHorizontal: 12 },
  addressBarPrefix: { fontSize: 24, color: '#e2e8f0' },
  addressText: { flex: 1, color: '#e2e8f0', fontSize: 18 },
  videoBadge: { fontSize: 20, color: '#fff', marginLeft: 8 },
  tabCount: { backgroundColor: '#1E60D5', borderRadius: 12, color: '#fff', paddingHorizontal: 10, paddingVertical: 4, fontWeight: '700' },
  menuDots: { color: '#fff', fontSize: 24, marginLeft: 12 },
  brandWrap: { marginTop: 32, alignItems: 'center' },
  logoBlock: { width: 76, height: 76, borderRadius: 24, backgroundColor: '#1E60D5', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '45deg' }] },
  logoM: { fontSize: 50, color: '#fff', fontWeight: '800', transform: [{ rotate: '-45deg' }] },
  brandTitle: { marginTop: 18, fontSize: 42, fontWeight: '800', color: '#f8fafc' },
  accent: { color: '#60A5FA' },
  privacyPill: { marginTop: 26, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E60D5', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 12 },
  privacyIcon: { color: '#fff', fontSize: 20, marginRight: 8 },
  privacyText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  searchLauncher: { marginTop: 24, backgroundColor: '#1E293B', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center' },
  searchEngine: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1E60D5', textAlign: 'center', lineHeight: 32, color: '#fff', fontWeight: '700', marginRight: 12 },
  searchPlaceholder: { flex: 1, fontSize: 22, color: '#94A3B8' },
  searchActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchAction: { fontSize: 24, color: '#cbd5e1' },
  shortcutGrid: { marginTop: 24, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  shortcutCard: { width: '22%', minWidth: 70, paddingVertical: 18, borderRadius: 18, alignItems: 'center', marginBottom: 10 },
  shortcutCircle: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  shortcutText: { fontSize: 32, fontWeight: '800' },
  shortcutLabel: { marginTop: 8, fontSize: 12, color: '#e2e8f0', fontWeight: '600' },
  visitsHeader: { marginTop: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 30, fontWeight: '800', color: '#f8fafc' },
  linkText: { color: '#60A5FA', fontSize: 20, fontWeight: '700' },
  visitList: { marginTop: 18 },
  visitCard: { backgroundColor: '#1E293B', borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  visitIcon: { fontSize: 26, color: '#60A5FA', marginRight: 12 },
  visitInfo: { flex: 1 },
  visitTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '700' },
  visitUrl: { color: '#cbd5e1', fontSize: 14 },
  visitArrow: { fontSize: 30, color: '#cbd5e1' },
  emptyStateCard: { marginTop: 18, paddingVertical: 18 },
  recommendedRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  recButton: { flex: 1, backgroundColor: '#1E293B', borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  recLabel: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
  bottomBar: { position: 'absolute', left: 10, right: 10, bottom: 10, backgroundColor: '#0F172A', borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bottomButton: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  bottomBadge: { minWidth: 28, height: 28, borderRadius: 14, backgroundColor: '#1E60D5', color: '#fff', textAlign: 'center', lineHeight: 28, fontWeight: '700' },
  bottomPlus: { fontSize: 28, color: '#fff', fontWeight: '700' },
  bottomLabel: { fontSize: 24, color: '#fff' },
});
