import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { shortcuts } from '@/lib/shortcuts';
import { useBrowserStore, getUrlForInput, getDomain, toTitle } from '@/store/browserStore';

export default function HomeScreen() {
  const router = useRouter();
  const { searchEngine, history, tabs, createTab, setActiveTab } = useBrowserStore();

  const frequentVisits = useMemo(() => history.slice(0, 3), [history]);

  const openPage = (input: string) => {
    const target = getUrlForInput(input, searchEngine);
    if (!target) return;

    const tab = createTab({
      title: toTitle(target),
      url: target,
      domain: getDomain(target),
      isPrivate: false,
      desktopMode: false,
      lastVisited: Date.now(),
    });

    setActiveTab(tab.id);
    router.push({ pathname: '/browser', params: { tabId: tab.id } });
  };

  const openShortcut = (url: string) => openPage(url);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.time}>12:51</Text>
          <View style={styles.statusGroup}>
            <Text style={styles.statusDot}>◉</Text>
            <Text style={styles.statusDot}>◍</Text>
            <Text style={styles.statusDot}>◌</Text>
          </View>
        </View>

        <View style={styles.browserBar}>
          <Text style={styles.barIcon}>⌂</Text>
          <Text style={styles.barText}>fastshot.ai/projects/b1</Text>
          <Text style={styles.badge}>▶</Text>
          <Text style={styles.tabBadge}>{tabs.length}</Text>
          <Text style={styles.menuIcon}>⋮</Text>
        </View>

        <View style={styles.brandWrap}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.brand}>Moncef <Text style={styles.brandAccent}>Browser</Text></Text>
        </View>

        <View style={styles.privacyPill}>
          <Text style={styles.privacyIcon}>✓</Text>
          <Text style={styles.privacyText}>Your Privacy Matters</Text>
        </View>

        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')} activeOpacity={0.9}>
          <Text style={styles.searchEngineMark}>G</Text>
          <Text style={styles.searchPlaceholder}>Search or type web address...</Text>
          <View style={styles.searchActions}>
            <Text style={styles.searchAction}>◌</Text>
            <Text style={styles.searchAction}>⌁</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.shortcutGrid}>
          {shortcuts.map((item) => (
            <TouchableOpacity key={item.id} style={styles.shortcutItem} onPress={() => openShortcut(item.url)}>
              <View style={[styles.shortcutIconWrap, { backgroundColor: item.color }]}>
                <Text style={[styles.shortcutIcon, { color: item.textColor ?? '#fff' }]}>{item.icon}</Text>
              </View>
              <Text style={styles.shortcutLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Frequently visited</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <Text style={styles.linkText}>View all</Text>
          </TouchableOpacity>
        </View>

        {frequentVisits.length > 0 ? (
          <View style={styles.visitsList}>
            {frequentVisits.map((entry) => (
              <TouchableOpacity key={entry.id} style={styles.visitRow} onPress={() => openPage(entry.url)}>
                <Text style={styles.visitIcon}>◉</Text>
                <View style={styles.visitTextWrap}>
                  <Text style={styles.visitTitle}>{entry.title}</Text>
                  <Text style={styles.visitUrl}>{entry.url}</Text>
                </View>
                <Text style={styles.visitArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.recommendedWrap}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <View style={styles.recommendRow}>
              <TouchableOpacity style={styles.recommendButton} onPress={() => openPage('https://www.youtube.com')}>
                <Text style={styles.recommendText}>YouTube</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.recommendButton} onPress={() => openPage('https://www.wikipedia.org')}>
                <Text style={styles.recommendText}>Wikipedia</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.bottomToolbar}>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => router.push('/tabs')}>
            <Text style={styles.toolbarBadge}>{tabs.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => router.push('/search')}>
            <Text style={styles.toolbarPlus}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => router.push('/history')}>
            <Text style={styles.toolbarGlyph}>⟲</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton} onPress={() => {}}>
            <Text style={styles.toolbarGlyph}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, backgroundColor: '#0F172A', paddingHorizontal: 18 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  time: { color: '#fff', fontSize: 28, fontWeight: '700' },
  statusGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { color: '#fff', fontSize: 18 },
  browserBar: { marginTop: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: '#4F46E5', borderRadius: 26, paddingHorizontal: 16, paddingVertical: 12 },
  barIcon: { color: '#e2e8f0', fontSize: 24, marginRight: 8 },
  barText: { flex: 1, color: '#e2e8f0', fontSize: 18 },
  badge: { color: '#fff', fontSize: 18, marginLeft: 10 },
  tabBadge: { minWidth: 26, height: 26, borderRadius: 13, backgroundColor: '#1E60D5', color: '#fff', textAlign: 'center', lineHeight: 26, fontWeight: '700', marginLeft: 6 },
  menuIcon: { color: '#fff', fontSize: 28, marginLeft: 10 },
  brandWrap: { marginTop: 34, alignItems: 'center' },
  logoWrap: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#1E60D5', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '45deg' }] },
  logoText: { color: '#fff', fontSize: 50, fontWeight: '800', transform: [{ rotate: '-45deg' }] },
  brand: { marginTop: 18, color: '#f8fafc', fontSize: 42, fontWeight: '800' },
  brandAccent: { color: '#60A5FA' },
  privacyPill: { marginTop: 28, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E60D5', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 12 },
  privacyIcon: { color: '#fff', fontSize: 20, marginRight: 10 },
  privacyText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  searchBar: { marginTop: 24, backgroundColor: '#1E293B', borderRadius: 26, paddingHorizontal: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center' },
  searchEngineMark: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#1E60D5', textAlign: 'center', lineHeight: 30, color: '#fff', fontWeight: '800', marginRight: 12 },
  searchPlaceholder: { flex: 1, color: '#94A3B8', fontSize: 18 },
  searchActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchAction: { color: '#cbd5e1', fontSize: 24 },
  shortcutGrid: { marginTop: 22, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  shortcutItem: { width: '22%', minWidth: 70, alignItems: 'center', marginBottom: 10 },
  shortcutIconWrap: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  shortcutIcon: { fontSize: 30, fontWeight: '800' },
  shortcutLabel: { marginTop: 8, color: '#e2e8f0', fontSize: 12, fontWeight: '700', textAlign: 'center' },
  sectionHeader: { marginTop: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: '#f8fafc', fontSize: 30, fontWeight: '800' },
  linkText: { color: '#60A5FA', fontSize: 18, fontWeight: '700' },
  visitsList: { marginTop: 16 },
  visitRow: { backgroundColor: '#1E293B', borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  visitIcon: { color: '#60A5FA', fontSize: 24, marginRight: 10 },
  visitTextWrap: { flex: 1 },
  visitTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '700' },
  visitUrl: { color: '#cbd5e1', fontSize: 12 },
  visitArrow: { color: '#cbd5e1', fontSize: 28 },
  recommendedWrap: { marginTop: 18 },
  recommendRow: { flexDirection: 'row', marginTop: 12, gap: 10 },
  recommendButton: { flex: 1, backgroundColor: '#1E293B', borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  recommendText: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
  bottomToolbar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#0F172A', borderTopWidth: 1, borderTopColor: '#334155', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8 },
  toolbarButton: { flex: 1, alignItems: 'center' },
  toolbarBadge: { minWidth: 30, height: 30, borderRadius: 15, backgroundColor: '#1E60D5', color: '#fff', textAlign: 'center', lineHeight: 30, fontWeight: '700' },
  toolbarPlus: { color: '#fff', fontSize: 32, fontWeight: '700' },
  toolbarGlyph: { color: '#fff', fontSize: 28 },
});


















































































































































































































































































