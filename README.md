# Home Assistant Weekly Schedule Card

A custom card for Home Assistant that displays a weekly schedule grid with configurable events.

![Weekly Schedule Card](screenshots/example.png)

## Installation

### HACS (Recommended)

1. Make sure you have [HACS](https://hacs.xyz) installed
2. Add this repository as a custom repository in HACS:
   - Open HACS
   - Go to "Frontend" section
   - Click menu (3 dots in top right)
   - Select "Custom repositories"
   - Add URL: `https://github.com/yourusername/ha-weekly-schedule-card`
   - Category: "Lovelace"
3. Click "Install"
4. Refresh your browser

### Manual Installation

1. Download `weekly-schedule-card.js` from the latest release
2. Upload the file to your Home Assistant instance using the following path:
   ```
   /config/www/community/weekly-schedule-card/weekly-schedule-card.js
   ```
3. Add the resource in your dashboard configuration:
   ```yaml
   resources:
     - url: /local/community/weekly-schedule-card/weekly-schedule-card.js
       type: module
   ```
4. Refresh your browser

## Usage

Add the card to your dashboard using the UI editor or YAML:

```yaml
type: custom:weekly-schedule-card
startHour: 6
endHour: 22
showWeekend: true
events:
  - label: Work
    color: "#ff0000"
    schedule:
      - day: Monday
        start: 9
        end: 17
      - day: Tuesday
        start: 9
        end: 17
      - day: Wednesday
        start: 9
        end: 17
      - day: Thursday
        start: 9
        end: 17
      - day: Friday
        start: 9
        end: 16
  - label: Gym
    color: "#00ff00"
    schedule:
      - day: Monday
        start: 18
        end: 19
      - day: Wednesday
        start: 18
        end: 19
      - day: Friday
        start: 18
        end: 19
```

## Options

| Name          | Type    | Default | Description                           |
| ------------- | ------- | ------- | ------------------------------------- |
| `startHour`   | number  | `9`     | First hour to show in the grid (0-23) |
| `endHour`     | number  | `17`    | Last hour to show in the grid (0-23)  |
| `showWeekend` | boolean | `false` | Show Saturday and Sunday columns      |
| `events`      | array   | `[]`    | List of events to display             |

### Event Options

| Name       | Type   | Description                       |
| ---------- | ------ | --------------------------------- |
| `label`    | string | Text to display in the event cell |
| `color`    | string | Color for the event (hex or RGB)  |
| `schedule` | array  | List of time slots for this event |

### Schedule Options

| Name    | Type   | Description                     |
| ------- | ------ | ------------------------------- |
| `day`   | string | Day of the week (Monday-Sunday) |
| `start` | number | Start hour (0-23)               |
| `end`   | number | End hour (0-23)                 |

## Editor

The card includes a visual editor that allows you to:

- Set basic configuration (start hour, end hour, show weekend)
- Add, edit, and remove events
- For each event:
  - Set label and color
  - Add, edit, and remove schedule entries
  - Select days and times visually

To access the editor:

1. Add the card to your dashboard
2. Click the three dots menu in the top-right corner of the card
3. Click "Edit"

### Adding Events

1. Click "Add Event"
2. Set the event label and color
3. Click "Add Schedule" to add time slots
4. For each schedule entry:
   - Select the day of the week
   - Set start and end hours
   - Click the trash icon to remove unwanted entries

### Editing Events

1. Click on an existing event to expand it
2. Modify the label, color, or schedule entries
3. Changes are saved automatically

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes
npm run watch
```

## Contributing

Feel free to submit issues and pull requests!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
