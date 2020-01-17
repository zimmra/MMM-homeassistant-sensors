# MMM-homeassistant-sensors
This a module for the [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop). 
It can display information from [Home Assistant](https://home-assistant.io/) using the home assistant REST API.

## Installation
Navigate into your MagicMirror's `modules` folder and clone this repository:  
`cd ~/MagicMirror/modules && git clone https://github.com/leinich/MMM-homeassistant-sensors.git`

If you want to use icons for the sensors download the `MaterialDesignIcons` webfont from https://github.com/Templarian/MaterialDesign-Webfont/archive/master.zip and unzip the folder:  
`cd ~/MagicMirror/modules/MMM-homeassistant-sensors && wget https://github.com/Templarian/MaterialDesign-Webfont/archive/master.zip && unzip master.zip`

## Configuration
It is very simple to set up this module, a sample configuration looks like this:

## Configuration Options

| Option               | Deafult | Description |
| -------------------- | ------- | ----------- |
| `prettyName`         | `true` | Pretty print the name of each JSON key (remove camelCase and underscores). <br>|
| `stripName`          | `true` | Removes all keys before the printed key. <br><br>**Example:** `a.b.c` will print `c`. <br>|
| `title`              | Home Assistant | Title to display at the top of the module. <br>|
| `host`               | `REQUIRED hassio.local` | The hostname or ip adress of the home assistant instance. <br>|
| `port`               | `8321` | Port of homeassistant e.g. 443 for SSL. <br>|
| `https`              | `REQUIRED false` | Is SSL enabled on home assistant (true/false) <br>|
| `token`              | `REQUIRED` | The long lived token. <br>|
| `updateInterval`     | `300000` | The time between updates (In milliseconds). (300000 = 5 minutes) <br>|
| `selfsigned`         | `false` | Allows self signed certificates/ less secure (true/false). <br>|
| `debuglogging`       | `false` | Enable logging into /home/pi/.pm2/logs/mm-error.log (true/false). <br>|
| `values`             |  | Specify specific values from the json feed to only show what you need (entity_id). <br><br> Check the options! <br>|

## Sensor options
| Option               | default |Description |
| -------------------- | ------- |----------- |
| `sensor`             | `entity_id` | Entity ID from Home Assistant. Please have a look at the states pages for the unique `entity_id` of your sensor <br>|
| `icons`              |  | Icons object for the on/off status of sensor. see: [MaterialDesignIcons](https://materialdesignicons.com/) <br>|

## Sensor icon options
| Option               || Description |
| -------------------- || ----------- |
| `value`              || You can define a specific icon for a specific value. <br>|
| `default`            || The defaukt icon for the sensor (if nothing else is specified). <br>|

## Sensor value options
| Option               || Description |
| -------------------- || ----------- |
| `value`              || You can define a specific icon for a specific value. <br>|
| `default`            || The defaukt icon for the sensor (if nothing else is specified). <br>|


Here is an example of an entry in `config.js`
```
		{
			module: 'MMM-homeassistant-sensors',
			position: 'top_left',
			config: {
				host: "IP TO HOME ASSISTANT",
				port: "8123",
				https: false,
				token: "YOUR OWN",
				title: 'Husinformation',
				values: [
					{
						sensor: "sensor.greenhouse_temp_and_humid_01_temperature",
						name: "Temp i växsthuset",
						defunit: " grader.",
						icons: [{
								"default": "thermometer",
							}
						],
					},
					{
						sensor: "sensor.greenhouse_temp_and_humid_01_humidity",
						name: "Fukt i växthuset",
						icons: [{
								"default": "water-percent",
							}
						]
					},
					{
						sensor: "media_player.snilles_tv",
						icons: [{
								"default": "television-off",
								"off": "television-off",
								"on": "television"
							}
						],
						replace: [{
								"on": "På",
								"off": "Av",
								"unknown": "Av",
							}
						]
					},
					{
						sensor: "binary_sensor.pet_cappuccino",
						icons: [{
								"off": "paw-off",
								"on": "paw",
							}
						],
						replace: [{
								"on": "Inne",
								"off": "Ute",
							}
						]
					},
					{
						sensor: "binary_sensor.pet_kakan",
						icons: [{
								"off": "paw-off",
								"on": "paw"
							}
						],
						replace: [{
								"on": "Inne",
								"off": "Ute",
							}
						]
					},
					{
						sensor: "binary_sensor.dishwasher",
						icons: [{
								"off": "dishwasher-off",
								"on": "dishwasher"
							}
						],
						replace: [{
								"on": "Diskar",
								"off": "Klar",
							}
						]
					},
					{
						sensor: "binary_sensor.espresso_machine",
						icons: [{
								"off": "coffee-off",
								"on": "coffee"
							}
						],
						replace: [{
								"on": "På",
								"off": "Av",
							}
						]
					}
				]
			}
		},```
**Result** example:

![Alt text](.github/example01.png)

## Special Thanks
- [Michael Teeuw](https://github.com/MichMich) for creating the awesome [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/develop) project that made this module possible.
- [tkoeberl](https://github.com/tkoeberl) for creating the initial module that I used as guidance in creating this module.
