package com.alert

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ForcedAlertModule internal constructor(private val context: ReactApplicationContext?) :
    ReactContextBaseJavaModule(context) {

    @ReactMethod
    fun addListener(eventName: String?) { /* No JS events expected */
    }

    @ReactMethod
    fun removeListeners(count: Int?) { /* No JS events expected */
    }

    override fun getName(): String {
        return "ForcedAlert"
    }

    override fun getConstants(): MutableMap<String, Any> =
        hashMapOf("EVENT_A" to EVENT_A, "EVENT_B" to EVENT_B)

    @ReactMethod
    fun alert(title: String?, message: String?) {
        val dialogIntent = Intent(reactApplicationContext, AlertDialogActivity::class.java)
        dialogIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        dialogIntent.putExtra("title", title)
        dialogIntent.putExtra("message", message)
        context?.startActivity(dialogIntent)
        currentContext = context
    }

    companion object {
        const val EVENT_A = "message1"
        const val EVENT_B = "message2"

        private var currentContext: ReactApplicationContext? = null

        fun sendEvent(name: String, body: String) {
            currentContext?.getJSModule(ReactContext.RCTDeviceEventEmitter::class.java)
                ?.emit(name, body)
        }
    }
}