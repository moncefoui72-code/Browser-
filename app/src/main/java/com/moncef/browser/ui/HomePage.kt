package com.moncef.browser.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.Surface
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.icons.Icons
import androidx.compose.material3.icons.filled.Search
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

private val shortcuts = listOf(
    "https://www.google.com",
    "https://www.youtube.com",
    "https://www.facebook.com",
    "https://www.wikipedia.org",
    "https://www.yandex.com",
    "https://www.x.com",
    "https://www.instagram.com",
    "https://www.reddit.com"
)

@Composable
fun HomePage(
    onAddressClick: () -> Unit,
    onTileOpen: (String) -> Unit,
    onOpenTabs: () -> Unit
) {
    Surface(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize().padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Spacer(modifier = Modifier.height(24.dp))

            // Logo (simple text for now)
            Text(text = "Moncef browser", style = MaterialTheme.typography.headlineMedium)

            Spacer(modifier = Modifier.height(24.dp))

            // Search pill
            ElevatedCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .clickable { onAddressClick() },
                shape = RoundedCornerShape(28.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp)) {
                    Icon(imageVector = Icons.Default.Search, contentDescription = "Search")
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(text = "Search or enter address", color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Shortcuts grid
            LazyVerticalGrid(
                columns = GridCells.Fixed(4),
                modifier = Modifier.fillMaxWidth().weight(1f),
                contentPadding = PaddingValues(8.dp),
            ) {
                items(shortcuts.size) { idx ->
                    val url = shortcuts[idx]
                    Card(modifier = Modifier
                        .padding(8.dp)
                        .size(80.dp)
                        .clickable { onTileOpen(url) },
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(text = url.replace("https://www.", "").replace(".com", ""), modifier = Modifier.padding(8.dp))
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Tabs button
            Text(text = "Tabs", modifier = Modifier.clickable { onOpenTabs() }.padding(12.dp))
        }
    }
}
