/* BlueToothHDP Service
 * Followed the example from SDK

 */
package com.cod.cordova;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import com.cod.cordova.numericBP;


import android.annotation.SuppressLint;
import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothHealth;
import android.bluetooth.BluetoothHealthAppConfiguration;
import android.bluetooth.BluetoothHealthCallback;
import android.bluetooth.BluetoothProfile;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.os.Messenger;
import android.os.ParcelFileDescriptor;
import android.os.RemoteException;
import android.util.Log;
import android.widget.Toast;

public class BluetoothHDPService extends Service{
  private static final String TAG = "BluetoothHDPService";

    public static final int RESULT_OK = 0;
    public static final int RESULT_FAIL = -1;

    // Status codes sent back to the UI client.
    // Application registration complete.
    public static final int STATUS_HEALTH_APP_REG = 100;
    // Application unregistration complete.
    public static final int STATUS_HEALTH_APP_UNREG = 101;
    // Channel creation complete.
    public static final int STATUS_CREATE_CHANNEL = 102;
    // Channel destroy complete.
    public static final int STATUS_DESTROY_CHANNEL = 103;
    // Reading data from Bluetooth HDP device.
    public static final int STATUS_READ_DATA = 104;
    // Done with reading data.
    public static final int STATUS_READ_DATA_DONE = 105;


    // Message codes received from the UI client.
    // Register client with this service.
    public static final int MSG_REG_CLIENT = 200;
    // Unregister client from this service.
    public static final int MSG_UNREG_CLIENT = 201;
    // Register health application.
    public static final int MSG_REG_HEALTH_APP = 300;
    // Unregister health application.
    public static final int MSG_UNREG_HEALTH_APP = 301;
    // Connect channel.
    public static final int MSG_CONNECT_CHANNEL = 400;
    // Disconnect channel.
    public static final int MSG_DISCONNECT_CHANNEL = 401;
    
    
    
    //communication state
    public static final int ASSOCIATION_RESPOND = 1;
    public static final int GET_MDS_OBJ_ATTR = 2;
    public static final int DATA_RESPOND = 3;
    public static final int DATA_RELEASE = 4;
    
    private int communication_state;
    private  byte invoke[] = new byte[] { (byte) 0x00, (byte) 0x00 }; 
    
    
    private BluetoothHealthAppConfiguration mHealthAppConfig;
    private BluetoothAdapter mBluetoothAdapter;
    private BluetoothHealth mBluetoothHealth;
    private BluetoothDevice mDevice;
    private int mChannelId;

    private Messenger mClient;
    
    
    private class IncomingHandler extends Handler {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                // Register UI client to this service so the client can receive messages.
                case MSG_REG_CLIENT:
                    Log.d(TAG, "Activity client registered");
                    mClient = msg.replyTo;
                    break;
                // Unregister UI client from this service.
                case MSG_UNREG_CLIENT:
                    Log.d(TAG, "Activity client unregistered");
                    mClient = null;
                    break;
                // Register health application.
                case MSG_REG_HEALTH_APP:
                    registerApp(msg.arg1);
                    break;
                // Unregister health application.
                case MSG_UNREG_HEALTH_APP:
                    unregisterApp();
                    break;
                // Connect channel.
                case MSG_CONNECT_CHANNEL:
                    mDevice = (BluetoothDevice) msg.obj;
                    connectChannel();
                    break;
                // Disconnect channel.
                case MSG_DISCONNECT_CHANNEL:
                    mDevice = (BluetoothDevice) msg.obj;
                    disconnectChannel();
                    break;
                default:
                    super.handleMessage(msg);
            }
        }
    }
    final Messenger mMessenger = new Messenger(new IncomingHandler());

    /**
     * Make sure Bluetooth and health profile are available on the Android device.  Stop service
     * if they are not available.
     */
    @Override
    public void onCreate() {
        super.onCreate();
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (mBluetoothAdapter == null || !mBluetoothAdapter.isEnabled()) {
            // Bluetooth adapter isn't available.  The client of the service is supposed to
            // verify that it is available and activate before invoking this service.
            stopSelf();
            return;
        }
        if (!mBluetoothAdapter.getProfileProxy(this, mBluetoothServiceListener,
                BluetoothProfile.HEALTH)) {
            Log.d(TAG,"BT Unavailable");
            stopSelf();
            return;
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "BluetoothHDPService is running.");
        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mMessenger.getBinder();
    };

    // Register health application through the Bluetooth Health API.
    private void registerApp(int dataType) {
        mBluetoothHealth.registerSinkAppConfiguration(TAG, dataType, mHealthCallback);
    }

    // Unregister health application through the Bluetooth Health API.
    private void unregisterApp() {
        mBluetoothHealth.unregisterAppConfiguration(mHealthAppConfig);
    }

    // Connect channel through the Bluetooth Health API.
    private void connectChannel() {
        Log.i(TAG, "connectChannel()");
        mBluetoothHealth.connectChannelToSource(mDevice, mHealthAppConfig);
    }

    // Disconnect channel through the Bluetooth Health API.
    private void disconnectChannel() {
        Log.i(TAG, "disconnectChannel()");
        mBluetoothHealth.disconnectChannel(mDevice, mHealthAppConfig, mChannelId);
    }

    // Callbacks to handle connection set up and disconnection clean up.
    private final BluetoothProfile.ServiceListener mBluetoothServiceListener =
            new BluetoothProfile.ServiceListener() {
        public void onServiceConnected(int profile, BluetoothProfile proxy) {
            if (profile == BluetoothProfile.HEALTH) {
                mBluetoothHealth = (BluetoothHealth) proxy;
                if (Log.isLoggable(TAG, Log.DEBUG))
                    Log.d(TAG, "onServiceConnected to profile: " + profile);
            }
        }

        public void onServiceDisconnected(int profile) {
            if (profile == BluetoothProfile.HEALTH) {
                mBluetoothHealth = null;
            }
        }
    };

    private final BluetoothHealthCallback mHealthCallback = new BluetoothHealthCallback() {
        // Callback to handle application registration and unregistration events.  The service
        // passes the status back to the UI client.
        public void onHealthAppConfigurationStatusChange(BluetoothHealthAppConfiguration config,
                int status) {
            if (status == BluetoothHealth.APP_CONFIG_REGISTRATION_FAILURE) {
                mHealthAppConfig = null;
                sendMessage(STATUS_HEALTH_APP_REG, RESULT_FAIL);
            } else if (status == BluetoothHealth.APP_CONFIG_REGISTRATION_SUCCESS) {
                mHealthAppConfig = config;
                sendMessage(STATUS_HEALTH_APP_REG, RESULT_OK);
            } else if (status == BluetoothHealth.APP_CONFIG_UNREGISTRATION_FAILURE ||
                    status == BluetoothHealth.APP_CONFIG_UNREGISTRATION_SUCCESS) {
                sendMessage(STATUS_HEALTH_APP_UNREG,
                        status == BluetoothHealth.APP_CONFIG_UNREGISTRATION_SUCCESS ?
                        RESULT_OK : RESULT_FAIL);
            }
        }

        // Callback to handle channel connection state changes.
        // Note that the logic of the state machine may need to be modified based on the HDP device.
        // When the HDP device is connected, the received file descriptor is passed to the
        // ReadThread to read the content.
        public void onHealthChannelStateChange(BluetoothHealthAppConfiguration config,
                BluetoothDevice device, int prevState, int newState, ParcelFileDescriptor fd,
                int channelId) {
            if (Log.isLoggable(TAG, Log.DEBUG))
                Log.d(TAG, String.format("prevState\t%d ----------> newState\t%d",
                        prevState, newState));
            if (prevState == BluetoothHealth.STATE_CHANNEL_DISCONNECTED &&
                    newState == BluetoothHealth.STATE_CHANNEL_CONNECTED) {
                if (config.equals(mHealthAppConfig)) {
                    mChannelId = channelId;
                    sendMessage(STATUS_CREATE_CHANNEL, RESULT_OK);
                    (new ReadThread(fd)).start();
                } else {
                    sendMessage(STATUS_CREATE_CHANNEL, RESULT_FAIL);
                }
            } else if (prevState == BluetoothHealth.STATE_CHANNEL_CONNECTING &&
                       newState == BluetoothHealth.STATE_CHANNEL_DISCONNECTED) {
                sendMessage(STATUS_CREATE_CHANNEL, RESULT_FAIL);
            } else if (prevState == BluetoothHealth.STATE_CHANNEL_DISCONNECTED &&
            		newState == BluetoothHealth.STATE_CHANNEL_DISCONNECTED) {
                if (config.equals(mHealthAppConfig)) {
                    sendMessage(STATUS_DESTROY_CHANNEL, RESULT_OK);
                } else {
                    sendMessage(STATUS_DESTROY_CHANNEL, RESULT_FAIL);
                }
            }
        }
    };

    // Sends an update message to registered UI client.
    private void sendMessage(int what, int value) {
        if (mClient == null) {
            Log.d(TAG, "No clients registered.");
            return;
        }

        try {
            mClient.send(Message.obtain(null, what, value, 0));
        } catch (RemoteException e) {
            // Unable to reach client.
            e.printStackTrace();
        }
    }
    
    private void sendMessageWithdata (int what,int bytescount, numericBP buffer){
      if (mClient == null) {
            Log.d(TAG, "No clients registered.");
            return;
        }

        try {
            mClient.send(Message.obtain(null, what, bytescount, -1,buffer));
        } catch (RemoteException e) {
            // Unable to reach client.
            e.printStackTrace();
        }
    }

    // Thread to read incoming data received from the HDP device.  This sample application merely
    // reads the raw byte from the incoming file descriptor.  The data should be interpreted using
    // a health manager which implements the IEEE 11073-xxxxx specifications.
    private class ReadThread extends Thread {
        private ParcelFileDescriptor mFd;

        public ReadThread(ParcelFileDescriptor fd) {
            super();
            mFd = fd;
        }
        
        
        
        // operation details is still to be decided after experiments on BT BPM
        @Override
        public void run() {
            FileInputStream fis = new FileInputStream(mFd.getFileDescriptor());
            final byte data[] = new byte[300]; //be careful the length
            int bytescount;
            numericBP bpstat = new numericBP();
            Log.i(TAG, "read thread start");
            try {
                while((bytescount = fis.read(data)) > -1) {
                    // At this point, the application can pass the raw data to a parser that
                    // has implemented the IEEE 11073-xxxxx specifications.  Instead, this sample
                    // simply indicates that some data has been received.
                    if(data[0] != (byte) 0x00){                     
                      String test = HDPdataParser.byte2hex(data);
                      Log.i(TAG, test);
                      if(data[0] == (byte) 0xE2){
                          Log.i(TAG, "E2");
                          //data_AR
                          communication_state = ASSOCIATION_RESPOND;
                          (new WriteThread(mFd)).start();
                          try {
                            sleep(100);
                          } catch (InterruptedException e) {
                            e.printStackTrace();
                          }
                          communication_state = GET_MDS_OBJ_ATTR;
                          (new WriteThread(mFd)).start();
                      }
                      
                      else if (data[0] == (byte)0xE7){
                          Log.i(TAG, "E7");
                          
                          //work for legacy device...
                          if (data[18] == (byte) 0x0d && data[19] == (byte) 0x1d)  //fixed report
                          {
                            communication_state = DATA_RESPOND; 
                            //set invoke id so get correct response
                            invoke = new byte[] { data[6], data[7] };
                            //write back response
                            (new WriteThread(mFd)).start();   
                            //parse data!! and send to controller;
                            numericBP bptemp = HDPdataParser.parseBPPacket(data);
                            bpstat.Systolic = (bptemp.Systolic != 0)?bptemp.Systolic:bpstat.Systolic;
                            bpstat.Diastolic = (bptemp.Diastolic != 0)?bptemp.Diastolic:bpstat.Diastolic;
                            bpstat.MAP = (bptemp.MAP != 0)?bptemp.MAP:bpstat.MAP;
                            bpstat.pulse = (bptemp.pulse != 0)?bptemp.pulse:bpstat.pulse;
                            bpstat.time = (bptemp.time.equals("0000-00-00 00:00:0000"))?bpstat.time:bptemp.time;
                            sendMessageWithdata(STATUS_READ_DATA, bytescount,bpstat);
                          }
                          else
                          {
                            communication_state = GET_MDS_OBJ_ATTR;
                          }
                      }
                      
                      else if (data[0] == (byte) 0xE4)
                      {
                    	  communication_state = DATA_RELEASE;
                          (new WriteThread(mFd)).start();
                          //  sendMessage();
                      }
                      //clear data
	                    for (int i = 0; i < data.length; i++){
	                    	data[i] = (byte) 0x00;
	                    }                                         
                    }
                    
                    sendMessage(STATUS_READ_DATA, 0);
                }
            } catch(IOException ioe) {}
            if (mFd != null) {
                try {
                    mFd.close();
                } catch (IOException e) { /* Do nothing. */ }
            }
            Log.i(TAG,"bp load " +bpstat.toString());
            sendMessageWithdata(STATUS_READ_DATA_DONE, -1,bpstat);
        }
    }
    
    
    private class WriteThread extends Thread {
        private ParcelFileDescriptor mFd;

        public WriteThread(ParcelFileDescriptor fd) {
            super();
            mFd = fd;
        }

        @Override
        public void run() {
            FileOutputStream fos = new FileOutputStream(mFd.getFileDescriptor());
            //FileInputStream fis = new FileInputStream(mFd.getFileDescriptor());
            //Association Response [0xE300]
            final byte data_AR[] = new byte[] {     (byte) 0xE3, (byte) 0x00,
                                  (byte) 0x00, (byte) 0x2C, 
                                  (byte) 0x00, (byte) 0x00,
                                  (byte) 0x50, (byte) 0x79,
                                  (byte) 0x00, (byte) 0x26,
                                  (byte) 0x80, (byte) 0x00, (byte) 0x00, (byte) 0x00,
                                  (byte) 0x80, (byte) 0x00,
                                  (byte) 0x80, (byte) 0x00, (byte) 0x00, (byte) 0x00,
                                  (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00,
                                  (byte) 0x80, (byte) 0x00, (byte) 0x00, (byte) 0x00,
                                  (byte) 0x00, (byte) 0x08,  //bt add for phone, can be automate in the future
                                  (byte) 0x3C, (byte) 0x5A, (byte) 0x37, (byte) 0xFF, 
                                  (byte) 0xFE, (byte) 0x95, (byte) 0xEE, (byte) 0xE3,
                                  (byte) 0x00, (byte) 0x00,
                                  (byte) 0x00, (byte) 0x00,
                                  (byte) 0x00, (byte) 0x00, 
                                  (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00};
//          Presentation APDU [0xE700]
            final byte data_DR[] = new byte[] {     (byte) 0xE7, (byte) 0x00,
                                  (byte) 0x00, (byte) 0x12,
                                  (byte) 0x00, (byte) 0x10,
                                  (byte) invoke[0], (byte) invoke[1],
                                  (byte) 0x02, (byte) 0x01,
                                  (byte) 0x00, (byte) 0x0A,
                                  (byte) 0x00, (byte) 0x00,
                                  (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00,
                                  (byte) 0x0D, (byte) 0x1D,
                                  (byte) 0x00, (byte) 0x00 };
            
            final byte get_MDS[] = new byte[] {       (byte) 0xE7, (byte) 0x00,
                            (byte) 0x00, (byte) 0x0E,
                            (byte) 0x00, (byte) 0x0C,
                            (byte) 0x00, (byte) 0x24,
                            (byte) 0x01, (byte) 0x03,
                            (byte) 0x00, (byte) 0x06,
                            (byte) 0x00, (byte) 0x00,
                            (byte) 0x00, (byte) 0x00,
                            (byte) 0x00, (byte) 0x00 };
                              
            final byte data_RR[] = new byte[] {     (byte) 0xE5, (byte) 0x00,
                                  (byte) 0x00, (byte) 0x02,
                                  (byte) 0x00, (byte) 0x00 };
            
            final byte data_RRQ[] = new byte[] {    (byte) 0xE4, (byte) 0x00,
                                  (byte) 0x00, (byte) 0x02,
                                  (byte) 0x00, (byte) 0x00 };
            
            final byte data_ABORT[] = new byte[] {    (byte) 0xE6, (byte) 0x00,
                            (byte) 0x00, (byte) 0x02,
                            (byte) 0x00, (byte) 0x00 };
            try {
              Log.i(TAG, String.valueOf(communication_state));
              if (communication_state == 1)
              {
                fos.write(data_AR);
                    Log.i(TAG, "Association Responsed!");
              }  
              else if (communication_state == 2)
              {
                fos.write(get_MDS);
                Log.i(TAG, "Get MDS object attributes!");
//                fos.write(data_ABORT);
              }
              else if (communication_state == 3) 
              {
                fos.write(data_DR);
                    Log.i(TAG, "Data Responsed!");
              }
              else if (communication_state == 4)
              {
                fos.write(data_RR);
                Log.i(TAG, "Data Released!");
              }
            } catch(IOException ioe) {}
        }
    }
    
}
