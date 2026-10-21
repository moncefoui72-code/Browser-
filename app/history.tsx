import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBrowserStore } from '@/store/browserStore';

export default function TabsScreen() {
  const router = useRouter();
  const { tabs, activeTabId, createTab, closeTab, setActiveTab } = useBrowserStore();

  const normalTabs = tabs.filter((tab) => !tab.isPrivate);
  const privateTabs = tabs.filter((tab) => tab.isPrivate);

  const createNormalTab = () => {
    const tab = createTab({ title: 'New tab', url: 'https://www.google.com', domain: 'google.com', isPrivate: false, desktopMode: false });
    setActiveTab(tab.id);
    router.push({ pathname: '/browser', params: { tabId: tab.id } });
  };

  const createPrivateTab = () => {
    const tab = createTab({ title: 'Private tab', url: 'https://www.google.com', domain: 'google.com', isPrivate: true, desktopMode: false });
    setActiveTab(tab.id);
    router.push({ pathname: '/browser', params: { tabId: tab.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tabs</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>✓</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Normal</Text>
          <TouchableOpacity style={styles.actionButton} onPress={createNormalTab}><Text style={styles.actionText}>New tab</Text></TouchableOpacity>
          {normalTabs.length === 0 ? <Text style={styles.emptyText}>No normal tabs open.</Text> : normalTabs.map((tab) => (
            <TouchableOpacity key={tab.id} style={[styles.tabCard, activeTabId === tab.id && styles.tabCardActive]} onPress={() => { setActiveTab(tab.id); router.push({ pathname: '/browser', params: { tabId: tab.id } }); }}>
              <View style={styles.tabInfo}>
                <Text style={styles.tabTitle}>{tab.title}</Text>
                <Text style={styles.tabDomain}>{tab.domain}</Text>
              </View>
              <TouchableOpacity hitSlop={10} onPress={() => closeTab(tab.id)}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Private</Text>
          <TouchableOpacity style={styles.actionButton} onPress={createPrivateTab}><Text style={styles.actionText}>New private tab</Text></TouchableOpacity>
          {privateTabs.length === 0 ? <Text style={styles.emptyText}>No private tabs open.</Text> : privateTabs.map((tab) => (
            <TouchableOpacity key={tab.id} style={[styles.tabCard, activeTabId === tab.id && styles.tabCardActive]} onPress={() => { setActiveTab(tab.id); router.push({ pathname: '/browser', params: { tabId: tab.id } }); }}>
              <View style={styles.tabInfo}>
                <Text style={styles.tabTitle}>{tab.title}</Text>
                <Text style={styles.tabDomain}>{tab.domain}</Text>
              </View>
              <TouchableOpacity hitSlop={10} onPress={() => closeTab(tab.id)}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  title: { color: '#f8fafc', fontSize: 32, fontWeight: '800' },
  back: { color: '#60A5FA', fontSize: 28 },
  section: { marginBottom: 18 },
  sectionTitle: { color: '#f8fafc', fontSize: 22, fontWeight: '700', marginBottom: 10 },
  actionButton: { backgroundColor: '#1E60D5', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 12 },
  actionText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  tabCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  tabCardActive: { borderWidth: 2, borderColor: '#60A5FA' },
  tabInfo: { flex: 1 },
  tabTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '700' },
  tabDomain: { color: '#cbd5e1', fontSize: 14 },
  closeText: { color: '#f8fafc', fontSize: 30 },
  emptyText: { color: '#94A3B8', fontSize: 15 },
});
