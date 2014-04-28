package com.cod.cordova;
/**
 * PhoneGap Plugin for Serial Communication over Bluetooth
 */
public class BluetoothSerial{

    // actions
    private static final String LIST = "list";
    private static final String CONNECT = "connect";
    private static final String XX = "xx";
    private static final String CONNECT_INSECURE = "connectInsecure";
    private static final String DISCONNECT = "disconnect";
    private static final String WRITE = "write";
    private static final String AVAILABLE = "available";
    private static final String READ = "read";
    private static final String READ_UNTIL = "readUntil";
    private static final String SUBSCRIBE = "subscribe";
    private static final String UNSUBSCRIBE = "unsubscribe";
    private static final String IS_ENABLED = "isEnabled";
    private static final String IS_CONNECTED = "isConnected";
    private static final String CLEAR = "clear";

    // Debugging
    private static final String TAG = "BluetoothSerial";
    private static final boolean D = true;

    // Message types sent from the BluetoothSerialService Handler
    public static final int MESSAGE_STATE_CHANGE = 1;
    public static final int MESSAGE_READ = 2;
    public static final int MESSAGE_WRITE = 3;
    public static final int MESSAGE_DEVICE_NAME = 4;
    public static final int MESSAGE_TOAST = 5;

    // Key names received from the BluetoothChatService Handler
    public static final String DEVICE_NAME = "device_name";
    public static final String TOAST = "toast";

    StringBuffer buffer = new StringBuffer();
    private String delimiter;

    // Use the appropriate IEEE 11073 data types based on the devices used.
    // Below are some examples. Refer to relevant Bluetooth HDP specifications
    // for detail.
    // 0x1007 - blood pressure meter
    // 0x1008 - body thermometer
    // 0x100F - body weight scale
    private static final int HEALTH_PROFILE_SOURCE_DATA_TYPE = 0x1007;

    private static final int REQUEST_ENABLE_BT = 1;
    private int mDeviceIndex = 0;
    private boolean mHealthServiceBound;
    private static final String BLUETOOTH_IS_OFF = "U";
    // handle the event of bluetooth
}
