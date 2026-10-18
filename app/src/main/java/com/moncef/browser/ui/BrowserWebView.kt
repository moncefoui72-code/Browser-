package com.moncef.browser.ui

import android.annotation.SuppressLint
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun BrowserWebView(
    initialUrl: String,
    onOpenNewTab: (String) -> Unit,
    onOpenTabs: () -> Unit
) {
    var url by remember { mutableStateOf(initialUrl) }
    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(title = { Text(text = url, maxLines = 1) }, actions = {
            IconButton(onClick = { /* open tabs */ onOpenTabs() }) {
                Icon(Icons.Default.MoreVert, contentDescription = "Tabs")
            }
        })
        AndroidView(factory = { ctx ->
            WebView(ctx).apply {
                settings.javaScriptEnabled = true
                webViewClient = WebViewClient()
                loadUrl(url)
            }
        }, update = { web ->
            if (web.url != url) {
                web.loadUrl(url)
            }
        }, modifier = Modifier.weight(1f))
        Row(modifier = Modifier.fillMaxWidth().padding(8.dp), horizontalArrangement = Arrangement.SpaceBetween) {
            Button(onClick = { /* go back */ }, enabled = false) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                Spacer(modifier = Modifier.width(8.dp))
                Text("Back")
            }
            Button(onClick = { onOpenNewTab("https://www.google.com") }) {
                Text("New Tab")
            }
        }
    }
}
