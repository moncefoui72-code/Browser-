import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { useBrowserStore } from '@/store/browserStore';

export default function BrowserScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tabId = String(params.tabId ?? '');
  const activeTab = useBrowserStore((state) => state.tabs.find((tab) => tab.id === tabId) ?? state.tabs[0]);
  const updateTab = useBrowserStore((state) => state.updateTab);
  const addVisit = useBrowserStore((state) => state.addVisit);
  const setActiveTab = useBrowserStore((state) => state.setActiveTab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [desktopMode, setDesktopMode] = useState(activeTab?.desktopMode ?? false);
  const webRef = useRef<WebView>(null);

  if (!activeTab) return null;

  setActiveTab(activeTab.id);

  const userAgent = desktopMode
    ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'
    : 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.addressBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.navIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.addressBox}>
            <Text style={styles.addressText}>{activeTab.domain}</Text>
            <Text style={styles.securityText}>{activeTab.url.startsWith('https://') ? 'HTTPS' : 'HTTP'}</Text>
          </View>
          <TouchableOpacity onPress={() => webRef.current?.reload()}>
            <Text style={styles.navIcon}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => webRef.current?.stopLoading()}>
            <Text style={styles.navIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => webRef.current?.reload()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.webWrap}>
          <WebView
            ref={webRef}
            source={{ uri: activeTab.url }}
            userAgent={userAgent}
            startInLoadingState
            javaScriptEnabled
            domStorageEnabled
            onLoadProgress={(event) => setLoading(event.nativeEvent.progress < 1)}
            onLoad={(event) => {
              setLoading(false);
              setError(null);
              const url = event.nativeEvent.url || activeTab.url;
              const domain = (() => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return activeTab.domain; } })();
              updateTab(activeTab.id, { url, domain, title: event.nativeEvent.title || activeTab.title });
              addVisit(event.nativeEvent.title || activeTab.title, url);
            }}
            onError={() => {
              setLoading(false);
              setError('This page failed to load. Please retry.');
            }}
            onNavigationStateChange={(nav) => {
              setCanGoBack(nav.canGoBack);
              setCanGoForward(nav.canGoForward);
              setLoading(nav.loading);
              if (nav.url) {
                const nextUrl = nav.url;
                const nextDomain = (() => { try { return new URL(nextUrl).hostname.replace(/^www\./, ''); } catch { return activeTab.domain; } })();
                updateTab(activeTab.id, { url: nextUrl, domain: nextDomain });
              }
            }}
            style={styles.webView}
            sharedCookiesEnabled={!activeTab.isPrivate}
            thirdPartyCookiesEnabled={!activeTab.isPrivate}
          />
          {loading ? <ActivityIndicator size="large" color="#60A5FA" style={styles.loader} /> : null}
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomButton} disabled={!canGoBack} onPress={() => webRef.current?.goBack()}>
            <Text style={[styles.navText, !canGoBack && styles.navDisabled]}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} disabled={!canGoForward} onPress={() => webRef.current?.goForward()}>
            <Text style={[styles.navText, !canGoForward && styles.navDisabled]}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => router.push('/tabs')}>
            <Text style={styles.navText}>▣</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => router.push('/search')}>
            <Text style={styles.navText}>◉</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => router.push('/')}>
            <Text style={styles.navText}>⌂</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => {}}>
            <Text style={styles.navText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, backgroundColor: '#0F172A' },
  addressBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 10 },
  navIcon: { color: '#f8fafc', fontSize: 30, width: 35, textAlign: 'center' },
  addressBox: { flex: 1, backgroundColor: '#0F172A', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between' },
  addressText: { color: '#f8fafc', fontWeight: '700' },
  securityText: { color: '#60A5FA', fontWeight: '700', fontSize: 12 },
  webWrap: { flex: 1, position: 'relative' },
  webView: { flex: 1 },
  loader: { position: 'absolute', alignSelf: 'center', top: '45%' },
  errorBox: { backgroundColor: '#7F1D1D', padding: 12, borderBottomWidth: 1, borderBottomColor: '#991B1B' },
  errorText: { color: '#fee2e2', fontWeight: '600' },
  retryButton: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: '#fef2f2', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  retryText: { color: '#7F1D1D', fontWeight: '800' },
  bottomBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderTopWidth: 1, borderTopColor: '#334155', paddingVertical: 10 },
  bottomButton: { flex: 1, alignItems: 'center' },
  navText: { color: '#fff', fontSize: 28 },
  navDisabled: { color: '#64748B' },
});
















































































































































































































































































































































































































































