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
		displaydates: false,
		displaytimes: false,
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
		// For debugging
		//console.log(data);
		var statElement = document.createElement("header");
		var title = this.config.title;
		statElement.innerHTML = title;
		wrapper.appendChild(statElement);

		if (data && !this.isEmpty(data)) {
			var tableElement = document.createElement("table");
			var values = this.config.values;
			if (values.length > 0) {
				for (var i = 0; i < values.length; i++) {

					// Check if there is icons.
					if (values[i].icons) {
						var icons = values[i].icons[0];
					} else {
						var icons = "none";
					}

					// Check if there is values to replace.
					if (values[i].replace) {
						var replace = values[i].replace[0];
					} else {
						var replace = "none";
					}

					// Check if the unit should be replaced.
					if (values[i].defunit) {
						var defunit = values[i].defunit;
					} else {
						var defunit = "none";
					}

					// Check if a global Show Date is set.
					if (this.config.displaydates === true) {
						var showdate = true;
					} else {
						var showdate = false;
					}

					// Check if a local entity date is set to show (overriding the default).
					if (values[i].showdate === true) {
						showdate = true;
					} 

					// Check if a local entity date is not set to show (overriding the default).
					if (values[i].showdate === false) {
						showdate = false;
					}

					// Check if a global Show Time is set.
					if (this.config.displaytimes === true) {
						var showtime = true;
					} else {
						var showtime = false;
					}

					// Check if a local entity time is set to show (overriding the default).
					if (values[i].showtime === true) {
						showtime = true;
					} 

					// Check if a local entity time is not set to show (overriding the default).
					if (values[i].showtime === false) {
						showtime = false;
					}

					// Pulling all entity values.
					var sensor = values[i].sensor;
					var displayname = values[i].name;
					var val = this.getValue(data, sensor);
					var lastupd = this.getLastupd(data, sensor);
					var picture = this.getPicture(data, sensor);
					var name = this.getName(data, sensor);
					var unit = this.getUnit(data, sensor);
					if (val) {
						tableElement.appendChild(this.addValue(name, val, unit, icons, replace, displayname, defunit, showdate, showtime, lastupd, picture, this.config.host, this.config.port, this.config.https));
					}
				}
			} else {
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						tableElement.appendChild(this.addValue(key, data[key], "", "", "", "", "", "", "", "", "", "", "", ""));
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

	// Collect the value from the entity.
	getValue: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				return data[i].state;
			}
		}
		return null;
	},

	// Collect the unit from the entity.
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

	// Collect the name from the entity.
	getName: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				return data[i].attributes.friendly_name;
			}
		}
		return null;
	},

	// Collect the last update date and time from the entity.
	getLastupd: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				return data[i].last_updated;
			}
		}
		return null;
	},

	// Collect the picture from the entity.	
	getPicture: function (data, value) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].entity_id == value) {
				return data[i].attributes.entity_picture;
			}
		}
		return null;
	},
	
	addValue: function (name, value, unit, icons, replace, displayname, defunit, showdate, showtime, lastupd, picture, host, port, https) {
		var newrow,
		newText,
		newCell;
		var newValue;
		var datedata;
		var timedata;
		newrow = document.createElement("tr");

		// Split up the time and date.
		var datestring = lastupd.split("T");
		datedata = datestring[0];
		var timestring = datestring[1].split(".");
		timedata = timestring[0];

		// Unit
		if (defunit !== "none") {
			unit = defunit;
			unit = unit.replace("%t%", timedata);
			unit = unit.replace("%d%", datedata);
		}

		// Name
		if (displayname) {
			name = displayname;
			name = name.replace("%t%", timedata);
			name = name.replace("%d%", datedata);
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

		// Adds the date to the output table if selected.
		if (showdate) {
			datedata = datestring[0];
		} else {
			datedata = "";
		}

		// Adds the date to the output table if selected.
		if (showtime) {
			timedata = timestring[0];
		} else {
			timedata = "";
		}

		// Column start point. 
		var column = -1;

		// Last Date Updated
		column++;
		newCell = newrow.insertCell(column);
		newCell.className = "ha-date";
		newText = document.createTextNode(datedata);
		newCell.appendChild(newText);

		// Last Time Updated
		column++;
		newCell = newrow.insertCell(column);
		newCell.className = "ha-time";
		newText = document.createTextNode(timedata);
		newCell.appendChild(newText);

		// icons
		column++;
		newCell = newrow.insertCell(column);
		newCell.className = "ha-icon";
		if (this.config.displaySymbol) {
			if (typeof icons === "object") {
				var iconsinline = "none";
				//Change icons based on HA status
				for (var key in icons) {
					// Sets the icon defined in the config specified value will give specified icon.
				    if (value === key) {
						iconsinline = document.createElement("i");
						iconsinline.className = "mdi mdi-" + icons[key];	
						break;
					} 
					// If no icon is set by values, the default one will be used.
					if (iconsinline === "none") {
						iconsinline = document.createElement("i");
						iconsinline.className = "mdi mdi-" + icons.default;
					}
				}
				newCell.appendChild(iconsinline);
			} else {
				// Setting the Picture if defined in the entity.
				// Todo, user defined pictures...
				if (picture) {
					if (!picture.includes("http")) {
						if (https) {
							var picturestart = "https://";
						} else {
							var picturestart = "http://";
						}
						picture = picturestart.concat(host, ":", port, picture);
					}
					var iconsinline = document.createElement("img");
					iconsinline.src = picture;
					iconsinline.className = "ha-img";
					newCell.appendChild(iconsinline);
				}
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
		}

		// Name
		column++;
		newCell = newrow.insertCell(column);
		newCell.className = "ha-name";
		newText = document.createTextNode(name);
		newCell.appendChild(newText);

		// Value
		column++;
		newCell = newrow.insertCell(column);
		newCell.className = "ha-value";
		newText = document.createTextNode(newValue);
		newCell.appendChild(newText);

		// Unit
		column++;
		newCell = newrow.insertCell(column);
		newCell.className = "ha-unit";
		newText = document.createTextNode(unit);
		newCell.appendChild(newText);
		return newrow;
	},
	
	// Update
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
