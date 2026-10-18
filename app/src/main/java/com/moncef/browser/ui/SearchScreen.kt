package com.moncef.browser.ui

import android.content.Context
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import java.util.*

private val engines = listOf(
    "Google" to "https://www.google.com/search?q=",
    "Bing" to "https://www.bing.com/search?q=",
    "Yahoo" to "https://search.yahoo.com/search?p=",
    "DuckDuckGo" to "https://duckduckgo.com/?q=",
    "Yandex" to "https://yandex.com/search/?text=",
    "AOL" to "https://search.aol.com/aol/search?q="
)

@Composable
fun SearchScreen(
    onOpenUrl: (String) -> Unit,
    onBack: () -> Unit
) {
    var query by remember { mutableStateOf("") }
    var engineIndex by remember { mutableStateOf(0) }
    val engineName = engines[engineIndex].first
    val enginePrefix = engines[engineIndex].second

    Column(modifier = Modifier.fillMaxSize().padding(12.dp)) {
        Row {
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                modifier = Modifier.fillMaxWidth().weight(1f),
                placeholder = { Text("Search or enter address") }
            )
            Spacer(modifier = Modifier.width(8.dp))
            Button(onClick = { // perform search
                val url = if (isProbablyUrl(query.trim())) {
                    if (query.startsWith("http")) query else "https://${query}"
                } else {
                    enginePrefix + java.net.URLEncoder.encode(query, "utf-8")
                }
                onOpenUrl(url)
            }) {
                Text("Go")
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Engine selector
        Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
            Text("Engine: ")
            Spinner(engineIndex) { newIndex -> engineIndex = newIndex }
            Spacer(modifier = Modifier.width(12.dp))
            Text("Using: $engineName")
        }

        Spacer(modifier = Modifier.height(12.dp))

        Text("Suggestions", style = MaterialTheme.typography.titleMedium)
        LazyColumn {
            items(listOf("news", "weather", "android", "compose", "video")) { item ->
                Text(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            query = item
                        }
                        .padding(12.dp),
                    text = item
                )
            }
        }
    }
}

@Composable
fun Spinner(selectedIndex: Int, onSelected: (Int) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = !expanded }
    ) {
        TextField(
            readOnly = true,
            value = engines[selectedIndex].first,
            onValueChange = {},
            label = { Text("Engine") },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) }
        )
        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            engines.forEachIndexed { index, pair ->
                DropdownMenuItem(text = { Text(pair.first) }, onClick = {
                    onSelected(index)
                    expanded = false
                })
            }
        }
    }
}

private fun isProbablyUrl(text: String): Boolean {
    val lower = text.lowercase(Locale.getDefault())
    return lower.contains(".") || lower.startsWith("http") || lower.startsWith("www.")
}
