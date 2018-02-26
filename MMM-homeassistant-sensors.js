'use strict';

Module.register("MMM-homeassistant-sensors", {
	result: {},
	defaults: {
		prettyName: true,
		stripName: true,
		title: 'Home Assistant',
		url: '',
		updateInterval: 3000,
		values: []
	},
	start: function() {
		this.getStats();
		this.scheduleUpdate();
	},
	isEmpty: function(obj) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	},
	getDom: function() {
		var wrapper = document.createElement("ticker");
		wrapper.className = 'dimmed small';

		var data = this.result;
		var statElement =  document.createElement("header");
		var title = this.config.title;
		statElement.innerHTML = title;
		wrapper.appendChild(statElement);
	   
		if (data && !this.isEmpty(data)) {
			var tableElement = document.createElement("table");
			var values = this.config.values;
			if (values.length > 0) {
				for (var i = 0; i < values.length; i++) {
					var val = this.getValue(data, values[i]);
					var name = this.getName(data, values[i]);
					if (val) {
						tableElement.appendChild(this.addValue(name, val));
					}
				}
			}
			else {
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						tableElement.appendChild(this.addValue(key, data[key]));
					}
				}
			}
			wrapper.appendChild(tableElement);
		} 
		else {
			var error = document.createElement("span");
			error.innerHTML = "Error fetching stats.";
			wrapper.appendChild(error);
		}
		return wrapper;
	},
	getValue: function(data, value) {
		for(var i=0; i<data.length;i++){
			if (data[i].entity_id == value){
				console.log(data[i].state + " " + data[i].attributes.unit_of_measurement);
				var unit = "";
				if (data[i].attributes.unit_of_measurement != undefined) {
					unit = data[i].attributes.unit_of_measurement;
				}
				return data[i].state + " " + unit;
		   }
		}
		return null;
	},
	getName: function(data, value) {
		for(var i=0; i<data.length;i++){
			if (data[i].entity_id == value){
				console.log(data[i].attributes.friendly_name);
				return data[i].attributes.friendly_name;
			}
		}
		return null;
	},
	addValue: function(name, value) {
		var newrow, newText, namecell, valuecell;
		newrow = document.createElement("tr");
		if (this.config.stripName) {
			var split = name.split(".");
			name = split[split.length - 1];
		}
		if (this.config.prettyName) {
			name = name.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
			name = name.split("_").join(" ");
			name = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}
		namecell = newrow.insertCell(0);
		newText  = document.createTextNode(name);
		namecell.appendChild(newText);
		valuecell = newrow.insertCell(1);
		newText  = document.createTextNode(value);
		valuecell.appendChild(newText);
		// newrow.innerHTML = name + ": " + value;
		return newrow;
	},
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		var self = this;
		setInterval(function() {
			self.getStats();
		}, nextLoad);
		},
	getStats: function () {
		this.sendSocketNotification('GET_STATS', this.config.url);
	},
	socketNotificationReceived: function(notification, payload) {
		if (notification === "STATS_RESULT") {
			this.result = payload;
			var fade = 500;
			this.updateDom(fade);
		}
	},
});