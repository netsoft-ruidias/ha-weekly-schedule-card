import { CardConfig, DEFAULT_CONFIG } from './types';
import { TimeGrid } from './time-grid';  // Import the TimeGrid type
import './time-grid';  // Import for side effects only
import './editor';
import './event-cell';

/* eslint no-console: 0 */
console.info(
    `%c  WEEKLY-SCHEDULE-CARD \n%c  Version 0.1.0    `,
    'color: orange; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: dimgray',
);

// This puts the card into the UI card picker dialog
window.customCards = window.customCards || [];
window.customCards.push({
    type: "weekly-schedule-card",
    name: "Weekly Schedule Card",
    description: "A weekly schedule card for Home Assistant"
});

class WeeklyScheduleCard extends HTMLElement {
    private config!: CardConfig;  // Add the ! operator to indicate it will be initialized

    // Adicione este método para suportar o editor
    static getConfigElement() {
        return document.createElement('weekly-schedule-card-editor');
    }

    setConfig(config: Partial<CardConfig>): void {
        // Ensure required properties have values
        const validatedConfig = {
            ...DEFAULT_CONFIG,
            type: 'weekly-schedule-card',
            ...config,
            startHour: config.startHour ?? DEFAULT_CONFIG.startHour!,
            endHour: config.endHour ?? DEFAULT_CONFIG.endHour!,
            showWeekend: config.showWeekend ?? DEFAULT_CONFIG.showWeekend!,
            events: config.events ?? DEFAULT_CONFIG.events!
        };

        this.config = validatedConfig as CardConfig;
        this.render();
    }

    getCardSize(): number {
        return this.config.size || 1; // Default size
    }

    render(): void {
        this.innerHTML = `
            <style>
                ha-card {
                    background: var(--card-background-color);
                    backdrop-filter: var(--ha-card-backdrop-filter, none);
                    box-shadow: var(--ha-card-box-shadow, none);
                    box-sizing: border-box;
                    border-radius: var(--ha-card-border-radius, 12px);
                    border-width: var(--ha-card-border-width, 1px);
                    border-style: solid;
                    border-color: var(--ha-card-border-color, var(--divider-color, #e0e0e0));
                    color: var(--primary-text-color);                   
                }
            </style>
            <ha-card>
                <time-grid></time-grid>
            </ha-card>
        `;

        const grid = this.querySelector('time-grid') as TimeGrid;
        if (grid && typeof grid.setConfig === 'function') {
            grid.setConfig(this.config);
        } else {
            console.error('TimeGrid component not properly initialized');
        }
    }
}

customElements.define('weekly-schedule-card', WeeklyScheduleCard);