import { CardConfig, WeekDay } from './types';
import { generateColorFromText } from './utils/color';

export class TimeGrid extends HTMLElement {
    private config!: CardConfig;
    
    public setConfig(config: CardConfig): void {
        this.config = config;
        this.render();
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

    private render(): void {
        const days = this.config.showWeekend
            ? ['Hora', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
            : ['Hora', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

        const hours = Array.from(
            { length: this.config.endHour - this.config.startHour + 1 },
            (_, i) => `${(this.config.startHour + i).toString().padStart(2, '0')}:00`
        );

        this.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 16px;
                }
                .schedule-grid {
                    display: grid;
                    grid-template-columns: auto repeat(${days.length - 1}, 1fr);
                    grid-template-rows: auto repeat(${hours.length}, 1fr);
                    gap: 2px;
                }
                .grid-header {
                    text-align: center;
                    padding: 8px;
                    background: var(--primary-color);
                    color: var(--text-primary-color);
                    font-weight: 500;
                    font-size: 12px;
                    grid-row: 1;
                }
                .grid-time {
                    padding: 4px 8px;
                    text-align: right;
                    font-size: 12px;
                    color: var(--secondary-text-color);
                    grid-column: 1;
                }
                .grid-cell {
                    min-height: 32px;
                }
                event-cell {
                }
            </style>
            <div class="schedule-grid">
                <!-- Headers -->
                ${days.map((day, i) => `
                    <div class="grid-header" style="grid-column: ${i + 1}">${day}</div>
                `).join('')}
                
                <!-- Time labels -->
                ${hours.map((hour, i) => `
                    <div class="grid-time" style="grid-row: ${i + 2}">${hour}</div>
                `).join('')}

                <!-- Background cells -->
                ${Array.from({ length: hours.length * (days.length - 1) }, (_, i) => {
                    const row = Math.floor(i / (days.length - 1)) + 2;
                    const col = (i % (days.length - 1)) + 2;
                    return `<div class="grid-cell" style="grid-column: ${col}; grid-row: ${row}"></div>`;
                }).join('')}

                <!-- Events -->
                ${this.generateEvents(days)}
            </div>
        `;
    }

    private generateEvents(days: string[]): string {
        if (!Array.isArray(this.config.events)) return '';

        return this.config.events.map(event => {
            if (!Array.isArray(event.schedule)) return '';

            return event.schedule.map(time => {
                const dayIndex = this.getDayIndex(time.day);
                if (dayIndex <= 0 || dayIndex >= days.length) return '';

                const baseColor = event.color || generateColorFromText(event.label);

                return `
                    <event-cell
                        data-label="${event.label || ''}"
                        data-color="${baseColor}"
                        data-start="${time.start}"
                        data-end="${time.end}"
                        data-day-index="${dayIndex}"
                        data-start-hour="${this.config.startHour}"
                    ></event-cell>
                `;
            }).join('');
        }).join('');
    }
}

customElements.define('time-grid', TimeGrid);