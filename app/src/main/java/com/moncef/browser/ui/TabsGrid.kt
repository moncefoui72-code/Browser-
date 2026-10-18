package com.moncef.browser.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.moncef.browser.tabs.BrowserTab
import com.moncef.browser.tabs.TabRepository

@Composable
fun TabsGrid(
    tabRepository: TabRepository,
    onOpenTab: (String) -> Unit,
    onBack: () -> Unit
) {
    var tabs by remember { mutableStateOf(tabRepository.loadTabs()) }

    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(title = { Text("Tabs") }, navigationIcon = {
            IconButton(onClick = { onBack() }) {
                Icon(Icons.Default.Close, contentDescription = "Back")
            }
        })
        if (tabs.isEmpty()) {
            Column(modifier = Modifier.fillMaxSize().padding(24.dp), verticalArrangement = Arrangement.Center) {
                Text("No open tabs", style = MaterialTheme.typography.bodyLarge)
                Spacer(modifier = Modifier.height(12.dp))
                Button(onClick = {
                    // open default tab
                    onOpenTab("https://www.google.com")
                }) {
                    Text("New Tab")
                }
            }
        } else {
            LazyColumn(modifier = Modifier.fillMaxSize().padding(8.dp)) {
                items(tabs, key = { it.id }) { t ->
                    TabRowItem(tab = t, onOpen = {
                        onOpenTab(it)
                    }, onClose = {
                        tabs = tabs.filterNot { it.id == t.id }
                        tabRepository.saveTabs(tabs)
                    })
                }
            }
        }
    }
}

@Composable
fun TabRowItem(tab: BrowserTab, onOpen: (String) -> Unit, onClose: () -> Unit) {
    Card(modifier = Modifier
        .fillMaxWidth()
        .padding(6.dp)) {
        Row(modifier = Modifier
            .padding(12.dp)
            .fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Column(modifier = Modifier.weight(1f).clickable { onOpen(tab.url) }) {
                Text(text = tab.title ?: tab.url, style = MaterialTheme.typography.bodyLarge, maxLines = 1)
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = tab.url, style = MaterialTheme.typography.bodySmall, maxLines = 1)
            }
            Spacer(modifier = Modifier.width(8.dp))
            IconButton(onClick = { onClose() }) {
                Icon(Icons.Default.Close, contentDescription = "Close")
            }
        }
    }
}
