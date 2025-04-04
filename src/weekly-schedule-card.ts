import { CardConfig, Event, ScheduleTime, DEFAULT_CONFIG, WeekDay } from './types';
import { generateColorFromText } from './utils/color';
import { EventCell } from './event-cell';
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

    private getDayIndex(day: WeekDay): number {
        const dayMap = {
            [WeekDay.Monday]: 1,
            [WeekDay.Tuesday]: 2,
            [WeekDay.Wednesday]: 3,
            [WeekDay.Thursday]: 4,
            [WeekDay.Friday]: 5,
            [WeekDay.Saturday]: 6,
            [WeekDay.Sunday]: 7
        };
        return dayMap[day];
    }

    private generateTimeGrid(): string {
        const days = this.config.showWeekend
            ? ['Hora', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
            : ['Hora', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

        const hours = Array.from(
            { length: this.config.endHour - this.config.startHour + 1 },
            (_, i) => {
                const hour = this.config.startHour + i;
                return `${hour.toString().padStart(2, '0')}:00`;
            }
        );

        const headerRow = days.map(day => `<div class="grid-header">${day}</div>`).join('');

        // Create a map of existing events for each day
        const eventsByDay: Array<Array<{label: string; color: string; time: ScheduleTime}>> = 
            Array(days.length - 1).fill(null).map(() => []);

        // Process events into days
        if (Array.isArray(this.config.events)) {
            this.config.events.forEach((event: Event) => {
                // Skip events without schedule
                if (!Array.isArray(event.schedule)) {
                    console.warn(`Event "${event.label}" has no schedule defined`);
                    return;
                }

                event.schedule.forEach((time: ScheduleTime) => {
                    const dayIndex = this.getDayIndex(time.day) - 1;
                    if (dayIndex >= 0 && dayIndex < days.length - 1) {
                        eventsByDay[dayIndex].push({
                            label: event.label,
                            color: event.color,
                            time: time
                        });
                    }
                });
            });
        }

        // Generate time cells
        const timeCells = hours.map(hour => `<div class="grid-time">${hour}</div>`).join('');

        // Generate event cells for each day
        const eventCells = eventsByDay.map((dayEvents, dayIndex: number) => {
            return dayEvents.map(({ label, color, time }) => {
                const baseColor = color || generateColorFromText(label);
                return `
                    <event-cell
                        data-label="${label}"
                        data-color="${baseColor}"
                        data-start="${time.start}"
                        data-end="${time.end}"
                        data-day-index="${dayIndex}"
                    ></event-cell>
                `;
            }).join('');
        }).join('');

        // Generate empty cells for the grid structure
        const emptyCells = hours.map((_, hourIndex) =>
            Array(days.length - 1).fill('')
                .map((_, dayIndex) => `<div class="grid-cell empty" style="grid-row: ${hourIndex + 2}; grid-column: ${dayIndex + 2};"></div>`)
                .join('')
        ).join('');

        return `
            <div class="schedule-grid" 
                style="
                    display: grid;
                    grid-template-columns: auto repeat(${days.length - 1}, 1fr);
                    grid-template-rows: auto repeat(${hours.length}, 1fr);
                    position: relative;
                "
            >
                ${headerRow}
                ${timeCells}
                ${emptyCells}
                ${eventCells}
            </div>
        `;
    }

    render(): void {
        this.innerHTML = `
            <style>
                ha-card {
                    backdrop-filter: var(--ha-card-backdrop-filter, none);
                    box-shadow: var(--ha-card-box-shadow, none);
                    box-sizing: border-box;
                    border-radius: var(--ha-card-border-radius, 12px);
                    border-width: var(--ha-card-border-width, 1px);
                    border-style: solid;
                    border-color: var(--ha-card-border-color, var(--divider-color, #e0e0e0));
                    color: var(--primary-text-color);                   
                }
                .header {
                    font-size: var(--ha-card-header-font-size, 20px);
                    margin-bottom: 8px;
                    padding: 0 12px;
                }
                .schedule-grid {
                    display: grid;
                    position: relative;
                    font-size: 14px;
                }
                .grid-header {
                    text-align: center;
                    padding: 6px;
                    background: var(--primary-color);
                    color: var(--text-primary-color);
                    grid-row: 1;
                    font-weight: 500;
                }
                .grid-time {
                    padding: 4px;
                    text-align: right;
                    grid-column: 1;
                    font-size: 12px;
                    color: var(--secondary-text-color);
                }
                .grid-cell {
                    min-height: 28px;
                    padding: 4px;
                }
                .grid-cell.empty {
                    _border: 1px solid var(--divider-color);
                }
                .grid-cell.event {
                    font-size: 13px;
                    color: var(--text-primary-color);
                    text-align: center;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: 'hidden';
                    textOverflow: 'ellipsis';
                }
            </style>
            <ha-card>
                ${this.config.title ? `<h1 class="header">${this.config.title}</h1>` : ''}
                ${this.config.content ? `<p class="content">${this.config.content}</p>` : ''}
                ${this.generateTimeGrid()}
            </ha-card>
        `;

        // After the DOM is updated, configure the event cells
        this.querySelectorAll('event-cell').forEach((element: Element) => {
            const cell = element as EventCell;
            const dataset = cell.dataset;
            
            cell.setProperties({
                label: dataset.label || '',
                color: dataset.color || '',
                time: {
                    day: WeekDay.Monday, // Default day, will be handled by cell based on dayIndex
                    start: parseInt(dataset.start || '0', 10),
                    end: parseInt(dataset.end || '0', 10)
                },
                startHour: this.config.startHour,
                dayIndex: parseInt(dataset.dayIndex || '0', 10)
            });
        });
    }
}

customElements.define('weekly-schedule-card', WeeklyScheduleCard);