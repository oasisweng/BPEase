package com.cod.cordova;

import android.util.Log;

import com.cod.cordova.numericBP;

public class HDPdataParser {
    private static final String TAG = "PARSER";
    //private  byte invoke[]; 
    /*
    public HDPdataParser( byte[] invoke){
    	 this.invoke = invoke;
    }*/
      
    public static numericBP parseBPPacket(byte[] data){
      numericBP bpstat = new numericBP();
      int length = data[21];
      Log.i(TAG, "length is " + length);
      // check data-req-id 
      // int report_no = data[22+3];
      int number_of_data_packets = data[22+5];
      //packet_start starts from handle 0 byte
      int packet_start = 30;
      final int SYS_DIA_MAP_DATA = 1;
      final int PULSE_DATA = 2;
      final int ERROR_CODE_DATA = 3;
      for (int i = 0; i < number_of_data_packets; i++)
      {
        int obj_handle = data[packet_start+1];
        Log.d(TAG,"obj_handle " + obj_handle); 
        switch (obj_handle)
        {
            case SYS_DIA_MAP_DATA:
              bpstat.Systolic = byteToUnsignedInt(data[packet_start+9]);
              bpstat.Diastolic = byteToUnsignedInt(data[packet_start+11]);
              bpstat.MAP = byteToUnsignedInt(data[packet_start+13]);
                            
              String[] temp = new String[8];              
              for(int j = 0; j< temp.length;j++){
                byte[] b = {data[packet_start+14+j]};  
                temp[j] = byte2hex(b);
              }
              bpstat.time = temp[0] + temp[1] + "-" + temp[2] + "-" + temp[3]
                                 + " " + temp[4] +":"+ temp[5] +":"+ temp[6]+temp[7];
              
              Log.i(TAG, "sys is "+ bpstat.Systolic);
              Log.i(TAG, "dia is "+ bpstat.Diastolic);;
              Log.i(TAG, "map is "+ bpstat.MAP);
              Log.i(TAG, "time is" + bpstat.time);
              //test
              //sendMessage(RECEIVED_MAP, map);
              break;
            case PULSE_DATA:
              //parse
              bpstat.pulse = byteToUnsignedInt(data[packet_start+5]);
              Log.i(TAG, "pulse is " + bpstat.pulse);
              break;
            case ERROR_CODE_DATA:
              //need more signal
              break;
            }
        packet_start += 4 + data[packet_start+3]; //4 = ignore beginning four bytes
      }                           
      return bpstat;
    }
    
    /*
    // to be decided by protocol  need experiment
    public static byte[] makeHDPpacket(int communication_state){
       final byte data_AR[] = new byte[] {(byte) 0xE3, (byte) 0x00,
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
         // Presentation APDU [0xE700]
       final byte data_DR[] = new byte[] {(byte) 0xE7, (byte) 0x00,
                                         (byte) 0x00, (byte) 0x12,
                                         (byte) 0x00, (byte) 0x10,
                                         (byte) invoke[0], (byte) invoke[1],
                                         (byte) 0x02, (byte) 0x01,
                                         (byte) 0x00, (byte) 0x0A,
                                         (byte) 0x00, (byte) 0x00,
                                         (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00,
                                         (byte) 0x0D, (byte) 0x1D,
                                         (byte) 0x00, (byte) 0x00 };
       
       final byte get_MDS[] = new byte[] {(byte) 0xE7, (byte) 0x00,
                                         (byte) 0x00, (byte) 0x0E,
                                         (byte) 0x00, (byte) 0x0C,
                                         (byte) 0x00, (byte) 0x24,
                                         (byte) 0x01, (byte) 0x03,
                                         (byte) 0x00, (byte) 0x06,
                                         (byte) 0x00, (byte) 0x00,
                                         (byte) 0x00, (byte) 0x00,
                                         (byte) 0x00, (byte) 0x00 };
                         
       final byte data_RR[] = new byte[] {(byte) 0xE5, (byte) 0x00,
                                          (byte) 0x00, (byte) 0x02,
                                          (byte) 0x00, (byte) 0x00 };
       
       final byte data_RRQ[] = new byte[] {(byte) 0xE4, (byte) 0x00,
                                          (byte) 0x00, (byte) 0x02,
                                          (byte) 0x00, (byte) 0x00 };
       
       final byte data_ABORT[] = new byte[] {(byte) 0xE6, (byte) 0x00,
                                            (byte) 0x00, (byte) 0x02,
                                            (byte) 0x00, (byte) 0x00 };
                                            
       switch(communication_state){
       	   case BluetoothHDPService.ASSOCIATION_RESPOND:
       	         return data_AR;
       	         
       	   case BluetoothHDPService.GET_MDS_OBJ_ATTR:   
       	         return get_MDS;
       	                                                                                                                    
           case BluetoothHDPService.DATA_RESPOND:
                 return data_DR;
           
           case BluetoothHDPService.DATA_RELEASE:    
                 return data_RR;
                                                                 
       }                                                                                                                            
                                                                                                                                     
    }*/
    
    
    public static String byte2hex(byte[] b)
    {
     // String Buffer can be used instead
       String hs = "";
       String stmp = "";

       for (int n = 0; n < b.length; n++)
       {
          stmp = (java.lang.Integer.toHexString(b[n] & 0XFF));

          if (stmp.length() == 1)
          {
             hs = hs + "0" + stmp;
          }
          else
          {
             hs = hs + stmp;
          }

          if (n < b.length - 1)
          {
             hs = hs + "";
          }
       }

       return hs;
    }
    
    public static int byteToUnsignedInt(byte b) {
        return 0x00 << 24 | b & 0xff;
    }
}
