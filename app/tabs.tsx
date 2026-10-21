import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBrowserStore } from '@/store/browserStore';

export default function BrowserScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tabId = String(params.tabId ?? '');
  const { tabs, setActiveTab, updateTab, addVisit, detectedVideos, setDetectedVideos, privateBrowsingSupported } = useBrowserStore();
  const activeTab = tabs.find((tab) => tab.id === tabId) ?? tabs[0];
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isDesktop, setIsDesktop] = useState(activeTab?.desktopMode ?? false);
  const [scrollY, setScrollY] = useState(0);
  const toolbarY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeTab) setActiveTab(activeTab.id);
  }, [activeTab, setActiveTab]);

  useEffect(() => {
    if (!activeTab) return;
    const count = detectedVideos[activeTab.id]?.length ?? 0;
    setDetectedVideos(activeTab.id, count > 0 ? detectedVideos[activeTab.id] ?? [] : []);
  }, [activeTab, detectedVideos, setDetectedVideos]);

  useEffect(() => {
    if (scrollY > 40) {
      Animated.spring(toolbarY, { toValue: -80, useNativeDriver: true, tension: 50 }).start();
    } else {
      Animated.spring(toolbarY, { toValue: 0, useNativeDriver: true, tension: 50 }).start();
    }
  }, [scrollY, toolbarY]);

  const videoCount = useMemo(() => detectedVideos[activeTab.id]?.length ?? 0, [activeTab, detectedVideos]);

  const onPageLoad = (nav: WebViewNavigation) => {
    setLoading(false);
    setError(null);
    updateTab(activeTab.id, { title: nav.title || activeTab.title, domain: nav.url ? new URL(nav.url).hostname.replace(/^www\./, '') : activeTab.domain });
    addVisit(nav.title || activeTab.title, nav.url || activeTab.url);
  };

  const onBrowserError = () => {
    setLoading(false);
    setError('This page failed to load. Please retry.');
  };

  const userAgent = isDesktop ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.addressBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.iconButton}>‹</Text>
          </TouchableOpacity>
          <View style={styles.addressContent}>
            <Text style={styles.domainText}>{activeTab?.domain || 'google.com'}</Text>
            <Text style={styles.securityText}>{activeTab?.url.startsWith('https://') ? 'HTTPS' : 'HTTP'}</Text>
          </View>
          <TouchableOpacity onPress={() => { if (webRef.current) webRef.current.reload(); }}>
            <Text style={styles.iconButton}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { if (webRef.current) webRef.current.stopLoading(); }}>
            <Text style={styles.iconButton}>✕</Text>
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

        <View style={styles.webViewWrap}>
          <WebView
            ref={webRef}
            source={{ uri: activeTab?.url || 'https://www.google.com' }}
            userAgent={userAgent}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            onLoadProgress={(event) => setLoading(event.nativeEvent.progress < 1)}
            onLoad={(nav) => onPageLoad(nav.nativeEvent)}
            onError={onBrowserError}
            onNavigationStateChange={(nav) => {
              setCanGoBack(nav.canGoBack);
              setCanGoForward(nav.canGoForward);
              setLoading(nav.loading);
              if (nav.url && activeTab) {
                updateTab(activeTab.id, { url: nav.url, domain: new URL(nav.url).hostname.replace(/^www\./, '') });
              }
            }}
            style={styles.webView}
            sharedCookiesEnabled={!activeTab?.isPrivate}
            thirdPartyCookiesEnabled={!activeTab?.isPrivate}
          />
          {loading ? <ActivityIndicator size="large" color="#60A5FA" style={styles.loader} /> : null}
        </View>

        <Animated.View style={[styles.bottomBar, { transform: [{ translateY: toolbarY }] }]}>
          <TouchableOpacity style={styles.navButton} disabled={!canGoBack}>
            <Text style={[styles.navText, !canGoBack && styles.navDisabled]}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} disabled={!canGoForward}>
            <Text style={[styles.navText, !canGoForward && styles.navDisabled]}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/tabs')}>
            <Text style={styles.navText}>▣</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/search')}>
            <Text style={styles.navText}>{videoCount > 0 ? `◉ ${videoCount}` : '◌'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/') }>
            <Text style={styles.navText}>⌂</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => {}}>
            <Text style={styles.navText}>⋮</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, backgroundColor: '#0F172A' },
  addressBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  iconButton: { fontSize: 28, color: '#f8fafc', width: 36, textAlign: 'center' },
  addressContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 },
  domainText: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
  securityText: { color: '#60A5FA', fontWeight: '700', fontSize: 12 },
  webViewWrap: { flex: 1, position: 'relative' },
  webView: { flex: 1, backgroundColor: '#fff' },
  loader: { position: 'absolute', alignSelf: 'center', top: '50%' },
  errorBox: { backgroundColor: '#7F1D1D', padding: 12, borderBottomWidth: 1, borderBottomColor: '#991B1B' },
  errorText: { color: '#fee2e2', fontWeight: '600' },
  retryButton: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: '#fef2f2', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  retryText: { color: '#7F1D1D', fontWeight: '800' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111827', borderTopWidth: 1, borderTopColor: '#334155', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 12 },
  navButton: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 28, color: '#f8fafc' },
  navDisabled: { color: '#64748B' },
});
