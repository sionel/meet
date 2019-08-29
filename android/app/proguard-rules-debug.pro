-include proguard-rules.pro

# Disabling obfuscation is useful if you collect stack traces from production crashes
# (unless you are using a system that supports de-obfuscate the stack traces).
-dontobfuscate
-keepattributes SoureFile,LineNumberTable
-dontnote com.ninty.system.setting.**
-dontnote com.horcrux.svg.**
-dontnote org.wonday.orientation.**
-dontnote org.devio.rn.splashscreen.**
-dontnote com.learnium.RNDeviceInfo.**
-dontnote com.terrylinla.rnsketchcanvas.**