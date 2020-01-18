'use strict';

Module.register("MMM-homeassistant-sensors", {
	result: {},
	defaults: {
		prettyName: true,
		stripName: true,
		title: 'Home Assistant',
		host: 'hassio.local',
		port: '8321',
		https: false, 
		token: '',
		apipassword: '',
		updateInterval: 300000,
		displaySymbol: true,
		debuglogging: false,
		values: []
	},

	getStyles: function () {
		return ["modules/MMM-homeassistant-sensors/MaterialDesign-Webfont-master/css/materialdesignicons.min.css", "MMM-homeassistant-sensors.css"];
	},

	start: function () {
		this.getStats();
		this.scheduleUpdate();
	},
	isEmpty: function (obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	},
	getDom: function () {
		var wrapper = document.createElement("ticker");
		wrapper.className = 'ha-sensors';
		var data = this.result;
		var statElement = document.createElement("header");
		var title = this.config.title;
		statElement.innerHTML = title;
		wrapper.appendChild(statElement);

		if (data && !this.isEmpty(data)) {
			var tableElement = document.createElement("table");
			var values = this.config.values;
			if (values.length > 0) {
				for (var i = 0; i < values.length; i++) {
					if (values[i].icons) {
						var icons = values[i].icons[0];
					} else {
						var icons = "none";
					}
					if (values[i].replace) {
						var replace = values[i].replace[0];
					} else {
						var replace = "none";
					}
					if (values[i].defunit) {
						var defunit = values[i].defunit;
					} else {
						var defunit = "none";
					}
					var sensor = values[i].sensor;
					var displayname = values[i].name;
					var val = this.getValue(data, sensor);
					var name = this.getName(data, sensor);
					var unit = this.getUnit(data, sensor);
					if (val) {
						tableElement.appendChild(this.addValue(name, val, unit, icons, replace, displayname, defunit));
					}
				}
			} else {
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						tableElement.appendChild(this.addValue(key, data[key], "", "", "", "", ""));
					}
				}
			}
			wrapper.appendChild(tableElement);
		} else {
			var error = document.createElement("span");
			error.innerHTML = "Error fetching stats.";
			wrapper.appendChild(error);
		}
		return wrapper;
	},
	getValue: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				return data[i].state;
			}
		}
		return null;
	},
	getUnit: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				if (typeof data[i].attributes.unit_of_measurement !== "undefined") {
					return data[i].attributes.unit_of_measurement;
				}
				return "";
			}
		}
		return "";
	},
	getName: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				return data[i].attributes.friendly_name;
			}
		}
		return null;
	},
	addValue: function (name, value, unit, icons, replace, displayname, defunit) {
		var newrow,
		newText,
		newCell;
		var newValue;
		newrow = document.createElement("tr");
		if (displayname) {
			name = displayname;
		} else {
			if (this.config.stripName) {
				var split = name.split(".");
				name = split[split.length - 1];
			}
			if (this.config.prettyName) {
				name = name.replace(/([A-Z])/g, function ($1) {
						return "_" + $1.toLowerCase();
					});
				name = name.split("_").join(" ");
				name = name.replace(/\w\S*/g, function (txt) {
						return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
					});
			}
		}
		// Unit
		if (defunit !== "none") {
			console.log(defunit);
			unit = defunit;
		}
		// icons
		newCell = newrow.insertCell(0);
		newCell.className = "align-left";
		if (this.config.displaySymbol) {
			if (typeof icons === "object") {
				var iconsinline = "none";
				//Change icons based on HA status
				for (var key in icons) {
					// Sets the icon defined in the config specified value will give specified icon.
				    if (value === key) {
						iconsinline = document.createElement("i");
						iconsinline.className = "ha-icon mdi mdi-" + icons[key];	
						break;
					} 
					// If no icon is set by values, the default one will be used.
					if (iconsinline === "none") {
						iconsinline = document.createElement("i");
						iconsinline.className = "ha-icon mdi mdi-" + icons.default;
					}
				}
				newCell.appendChild(iconsinline);
			}
		}
		// Replace the "value" with something defined in config.
		for (var key in replace) {
			if (value === key) {
				newValue = replace[key];
				break;
			} else {
				newValue = value;
			}
			//console.log("sdsdf");
		}
		// Name
		newCell = newrow.insertCell(1);
		newCell.className = "ha-name";
		newText = document.createTextNode(name);
		newCell.appendChild(newText);
		// Value
		newCell = newrow.insertCell(2);
		newCell.className = "ha-value";
		newText = document.createTextNode(newValue);
		newCell.appendChild(newText);
		// Unit
		newCell = newrow.insertCell(3);
		newCell.className = "ha-unit";
		newText = document.createTextNode(unit);
		newCell.appendChild(newText);
		return newrow;
	},
	scheduleUpdate: function (delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		var self = this;
		setInterval(function () {
			self.getStats();
		}, nextLoad);
	},
	getStats: function () {
		this.sendSocketNotification('GET_STATS', this.config);
	},
	socketNotificationReceived: function (notification, payload) {
		if (notification === "STATS_RESULT") {
			this.result = payload;
			var fade = 500;
			this.updateDom(fade);
		}
	},
});
