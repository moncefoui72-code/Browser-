package com.moncef.browser.ui

import android.content.Context
import androidx.activity.ComponentActivity
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import com.moncef.browser.tabs.TabRepository

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BrowserApp(appContext: Context) {
    val context = LocalContext.current
    val tabRepo = remember { TabRepository(appContext) }

    var screen by remember { mutableStateOf(BrowserScreen.Home) }
    var activeUrl by remember { mutableStateOf("https://www.google.com") }

    MaterialTheme(
        colorScheme = if (android.os.Build.VERSION.SDK_INT >= 31) dynamicDarkColorScheme(context) else lightColorScheme()
    ) {
        Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
            when (screen) {
                BrowserScreen.Home -> HomePage(
                    onAddressClick = { screen = BrowserScreen.Search },
                    onTileOpen = { url ->
                        activeUrl = url
                        screen = BrowserScreen.Tab
                    },
                    onOpenTabs = { screen = BrowserScreen.Tabs }
                )
                BrowserScreen.Search -> SearchScreen(
                    onOpenUrl = { url ->
                        activeUrl = url
                        screen = BrowserScreen.Tab
                    },
                    onBack = { screen = BrowserScreen.Home }
                )
                BrowserScreen.Tab -> BrowserWebView(
                    initialUrl = activeUrl,
                    onOpenNewTab = { url ->
                        activeUrl = url
                        screen = BrowserScreen.Tab
                    },
                    onOpenTabs = { screen = BrowserScreen.Tabs }
                )
                BrowserScreen.Tabs -> {
                    // Simple tabs list screen
                    TabsGrid(
                        tabRepository = tabRepo,
                        onOpenTab = { url ->
                            activeUrl = url
                            screen = BrowserScreen.Tab
                        },
                        onBack = { screen = BrowserScreen.Home }
                    )
                }
            }
        }
    }
}

enum class BrowserScreen { Home, Search, Tab, Tabs }

@Preview(showBackground = true)
@Composable
fun PreviewApp() {
    // Preview using an arbitrary context - not functional
    BrowserApp(LocalContext.current)
}
