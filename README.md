# MMM-homeassistant-sensors
This a module for the [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop). 
It can display information from [Home Assistant](https://home-assistant.io/) using the home assistant REST API.

## Installation
Navigate into your MagicMirror's `modules` folder and clone this repository. 
`cd ~\MagicMirror\modules && git clone https://github.com/leinich/MMM-homeassistant-sensors.git`

## Configuration
It is very simple to set up this module, a sample configuration looks like this:

## Configuration Options

| Option               | Description |
| -------------------- | ----------- |
| `prettyName`         | Pretty print the name of each JSON key (remove camelCase and underscores). <br><br> **Default value:** `true` |
| `stripName`          | Removes all keys before the printed key. <br><br>**Example:** `a.b.c` will print `c`.<br> **Default value:** `true` |
| `title`              | Title to display at the top of the module. <br><br> **Default value: ** `Home Assistant` |
| `url`                | The url of the homeassitant api . <br><br> **Default value:** `REQUIRED` |
| `updateInterval`     | The time between updates (In milliseconds). / <br><br> **Default value:** `300000 (5 minutes)` |
| `values`             | Specify specific values from the json feed to only show what you need (entity_id). <br><br>**Example:** `["key1", "key2", "keyA.keyB.keyC"]`<br> **Default value:** `[]` (Shows all keys in the object) |

Here is an example of an entry in `config.js`
```
modules: [
  {
    module: 'MMM-homeassistant-sensors',
    position: 'top_left',
    config: {
      url: 'https://youehomeassistant:8123/api/states?api_password=secret',
      prettyName : false,
      stripName: false,
      values: ["cover.office", "sensor.owm_pressure"]
    }
  }
]
```

## Special Thanks
- [Michael Teeuw](https://github.com/MichMich) for creating the awesome [MagicMirror2](https://github.com/MichMich/MagicMirror/tree/develop) project that made this module possible.
- [tkoeberl](https://github.com/tkoeberl) for creating the initial module that I used as guidance in creating this module.
