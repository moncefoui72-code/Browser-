package com.moncef.browser.tabs

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.*

data class BrowserTab(
    val id: String = UUID.randomUUID().toString(),
    val url: String,
    val title: String? = null,
    val isPrivate: Boolean = false
)

class TabRepository(private val context: Context) {
    private val prefsName = "moncef_tabs"
    private val keyTabs = "saved_tabs"
    private val gson = Gson()

    fun saveTabs(tabs: List<BrowserTab>) {
        val json = gson.toJson(tabs)
        context.getSharedPreferences(prefsName, Context.MODE_PRIVATE)
            .edit()
            .putString(keyTabs, json)
            .apply()
    }

    fun loadTabs(): List<BrowserTab> {
        val json = context.getSharedPreferences(prefsName, Context.MODE_PRIVATE)
            .getString(keyTabs, null) ?: return emptyList()
        return try {
            val type = object : TypeToken<List<BrowserTab>>() {}.type
            gson.fromJson<List<BrowserTab>>(json, type) ?: emptyList()
        } catch (e: Exception) {
            emptyList()
        }
    }

    fun clear() {
        context.getSharedPreferences(prefsName, Context.MODE_PRIVATE)
            .edit()
            .remove(keyTabs)
            .apply()
    }
}
