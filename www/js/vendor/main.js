var Bluetooth, BluetoothState, Device, DeviceCollection, DeviceListView, DeviceView, onDeviceReady;

$.fn.extend({
  enable: function() {
    return this.removeAttr("disabled");
  },
  disable: function() {
    return this.attr("disabled", "disabled");
  }
});

BluetoothState = Backbone.Model.extend({}, {
  Off: 1,
  Busy: 2,
  Ready: 3,
  Connected: 4
});

Bluetooth = new BluetoothState({
  state: BluetoothState.Busy
});

Device = Backbone.Model.extend({
  defaults: {
    name: "name",
    address: "address",
    isConnected: false
  }
});

DeviceCollection = Backbone.Collection.extend({
  model: Device
});

DeviceView = Backbone.View.extend({
  template: templates.device,
  events: {
    "click .btn-bt-connect": "connect",
    "click .btn-bt-disconnect": "disconnect"
  },
  initialize: function() {
    return this.model.on("change", this.render, this);
  },
  render: function() {
    this.$el.html(_.template(this.template, {
      name: this.model.get("name"),
      isConnected: this.model.get("isConnected")
    }));
    return this;
  },
  connect: function() {
    var gotUuids, onError;
    onError = (function(_this) {
      return function() {
        Bluetooth.set({
          state: BluetoothState.Ready
        });
        return _this.$(".btn-bt-connect").button("reset");
      };
    })(this);
    gotUuids = (function(_this) {
      return function(device) {
        var onConnectionEstablished;
        onConnectionEstablished = function() {
          var onConnectionLost, onMessageReceived;
          onMessageReceived = function(msg) {
            return console.log(msg);
          };
          onConnectionLost = function() {
            _this.model.set({
              isConnected: false
            });
            return onError();
          };
          _this.model.set({
            isConnected: true
          });
          return window.bluetooth.startConnectionManager(onMessageReceived, onConnectionLost);
        };
        return window.bluetooth.connect(onConnectionEstablished, onError, {
          address: _this.model.get("address"),
          uuid: device.uuids[0]
        });
      };
    })(this);
    Bluetooth.set({
      state: BluetoothState.Busy
    });
    this.$(".btn-bt-connect").button("loading");
    return window.bluetooth.getUuids(gotUuids, onError, this.model.get("address"));
  },
  disconnect: function() {
    var onDisconnected;
    onDisconnected = function() {
      this.model.set({
        isConnected: false
      });
      return Bluetooth.set({
        state: BluetoothState.Ready
      });
    };
    Bluetooth.set({
      state: BluetoothState.Busy
    });
    return window.bluetooth.disconnect(onDisconnected);
  }
});

DeviceListView = Backbone.View.extend({
  el: "#list-devices",
  initialize: function() {
    return this.collection.on("reset add", this.render, this);
  },
  render: function() {
    this.$el.html("");
    return this.collection.each((function(_this) {
      return function(device) {
        return _this.$el.append(new DeviceView({
          model: device
        }).render().el);
      };
    })(this));
  }
});

onDeviceReady = function() {
  var deviceList, onBluetoothStateChanged, onDiscover, onToggleOff, onToggleOn;
  deviceList = new DeviceListView({
    collection: new DeviceCollection
  });
  onBluetoothStateChanged = function() {
    switch (Bluetooth.get("state")) {
      case BluetoothState.Off:
        $("#btn-bt-on").enable();
        $("#btn-bt-off").disable();
        $("#btn-bt-discover").disable();
        $(".btn-bt-connect").disable();
        return $(".btn-bt-disconnect").disable();
      case BluetoothState.Busy:
        $("#btn-bt-on").disable();
        $("#btn-bt-off").disable();
        $("#btn-bt-discover").disable();
        $(".btn-bt-connect").disable();
        return $(".btn-bt-disconnect").disable();
      case BluetoothState.Ready:
        $("#btn-bt-on").disable();
        $("#btn-bt-off").enable();
        $("#btn-bt-discover").enable();
        $(".btn-bt-connect").enable();
        return $(".btn-bt-disconnect").enable();
      case BluetoothState.Connected:
        $("#btn-bt-on").disable();
        $("#btn-bt-off").disable();
        $("#btn-bt-discover").disable();
        $(".btn-bt-connect").disable();
        return $(".btn-bt-disconnect").enable();
    }
  };
  onToggleOn = function() {
    var onBluetoothEnabled;
    onBluetoothEnabled = function() {
      return Bluetooth.set({
        state: BluetoothState.Ready
      });
    };
    Bluetooth.set({
      state: BluetoothState.Busy
    });
    return window.bluetooth.enable(onBluetoothEnabled);
  };
  onToggleOff = function() {
    var onBluetoothDisabled;
    onBluetoothDisabled = function() {
      return Bluetooth.set({
        state: BluetoothState.Off
      });
    };
    Bluetooth.set({
      state: BluetoothState.Busy
    });
    return window.bluetooth.disable(onBluetoothDisabled);
  };
  onDiscover = function() {
    var onDeviceDiscovered, onDiscoveryFinished;
    onDeviceDiscovered = function(device) {
      return deviceList.collection.add(new Device(device));
    };
    onDiscoveryFinished = function() {
      Bluetooth.set({
        state: BluetoothState.Ready
      });
      return $("#btn-bt-discover").button("reset");
    };
    Bluetooth.set({
      state: BluetoothState.Busy
    });
    $("#btn-bt-discover").button("loading");
    deviceList.collection.reset();
    return window.bluetooth.startDiscovery(onDeviceDiscovered, onDiscoveryFinished, onDiscoveryFinished);
  };
  $("#btn-bt-on").on("click", onToggleOn);
  $("#btn-bt-off").on("click", onToggleOff);
  $("#btn-bt-discover").on("click", onDiscover);
  Bluetooth.on("change", onBluetoothStateChanged);
  return window.bluetooth.isEnabled(function(isEnabled) {
    if (isEnabled) {
      return Bluetooth.set({
        state: BluetoothState.Ready
      });
    } else {
      return Bluetooth.set({
        state: BluetoothState.Off
      });
    }
  });
};

$(document).on("deviceready", onDeviceReady);
