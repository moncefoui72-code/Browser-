import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBrowserStore } from '@/store/browserStore';

export default function TabsScreen() {
  const router = useRouter();
  const { tabs, activeTabId, createTab, closeTab, setActiveTab, privateBrowsingSupported } = useBrowserStore();

  const normalTabs = tabs.filter((tab) => !tab.isPrivate);
  const privateTabs = tabs.filter((tab) => tab.isPrivate);

  const createNormal = () => {
    const tab = createTab({ title: 'New tab', url: 'https://www.google.com', domain: 'google.com', isPrivate: false });
    setActiveTab(tab.id);
    router.push({ pathname: '/browser', params: { tabId: tab.id } });
  };

  const createPrivate = () => {
    if (!privateBrowsingSupported) {
      alert('Private browsing is not available in this build because isolated WebView profiles are not enabled on this device.');
      return;
    }
    const tab = createTab({ title: 'Private tab', url: 'https://www.google.com', domain: 'google.com', isPrivate: true });
    setActiveTab(tab.id);
    router.push({ pathname: '/browser', params: { tabId: tab.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tabs</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.close}>✓</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Normal</Text>
          <TouchableOpacity style={styles.actionButton} onPress={createNormal}><Text style={styles.actionText}>New tab</Text></TouchableOpacity>
          {normalTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabCard, activeTabId === tab.id && styles.tabCardActive]}
              onPress={() => {
                setActiveTab(tab.id);
                router.push({ pathname: '/browser', params: { tabId: tab.id } });
              }}
            >
              <View style={styles.tabInfo}>
                <Text style={styles.tabTitle}>{tab.title}</Text>
                <Text style={styles.tabDomain}>{tab.domain}</Text>
              </View>
              <TouchableOpacity onPress={() => closeTab(tab.id)} hitSlop={10}>
                <Text style={styles.closeTab}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Private</Text>
          <TouchableOpacity style={styles.actionButton} onPress={createPrivate}><Text style={styles.actionText}>New private tab</Text></TouchableOpacity>
          {privateTabs.length === 0 ? <Text style={styles.emptyText}>Private browsing unavailable or no private tabs open.</Text> : privateTabs.map((tab) => (
            <TouchableOpacity key={tab.id} style={styles.tabCard} onPress={() => { setActiveTab(tab.id); router.push({ pathname: '/browser', params: { tabId: tab.id } }); }}>
              <View style={styles.tabInfo}>
                <Text style={styles.tabTitle}>{tab.title}</Text>
                <Text style={styles.tabDomain}>{tab.domain}</Text>
              </View>
              <TouchableOpacity onPress={() => closeTab(tab.id)} hitSlop={10}>
                <Text style={styles.closeTab}>×</Text>
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
  close: { color: '#60A5FA', fontSize: 26 },
  sectionBlock: { marginBottom: 18 },
  sectionTitle: { color: '#f8fafc', fontSize: 22, fontWeight: '700', marginBottom: 10 },
  actionButton: { backgroundColor: '#1E60D5', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 12 },
  actionText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  tabCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  tabCardActive: { borderWidth: 2, borderColor: '#60A5FA' },
  tabInfo: { flex: 1 },
  tabTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '700' },
  tabDomain: { color: '#cbd5e1', fontSize: 14 },
  closeTab: { color: '#f8fafc', fontSize: 28 },
  emptyText: { color: '#94A3B8', fontSize: 15 },
});
