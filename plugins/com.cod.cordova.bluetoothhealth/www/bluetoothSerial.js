/*global cordova*/
module.exports = {

    xx: function(success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "xx", []);
    },

    connect: function(macAddress, success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "connect", [macAddress]);
    },

    // Android only - see http://goo.gl/1mFjZY
    connectInsecure: function(macAddress, success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "connectInsecure", [macAddress]);
    },

    disconnect: function(success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "disconnect", []);
    },

    // list bound devices
    list: function(success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "list", []);
    },

    isEnabled: function(success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "isEnabled", []);
    },

    isConnected: function(success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "isConnected", []);
    },

    // the number of bytes of data available to read is passed to the success function
    available: function(success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "available", []);
    },

    // read all the data in the buffer
    read: function(success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "read", []);
    },

    // reads the data in the buffer up to and including the delimiter
    readUntil: function(delimiter, success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "readUntil", [delimiter]);
    },

    // writes data to the bluetooth serial port - data must be a string
    write: function(data, success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "write", [data]);
    },

    // calls the success callback when new data is available
    subscribe: function(delimiter, success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "subscribe", [delimiter]);
    },

    // removes data subscription
    unsubscribe: function(success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "unsubscribe", []);
    },

    // clears the data buffer
    clear: function(success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "clear", []);
    },

    // reads the RSSI of the *connected* peripherial
    readRSSI: function(success, failure) {
        cordova.exec(success, failure, "HDPBluetoothSerial", "readRSSI", []);
    },

};