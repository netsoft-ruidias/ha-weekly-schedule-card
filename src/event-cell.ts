import { ScheduleTime, WeekDay } from './types';

export class EventCell extends HTMLElement {
    private label: string = '';
    private color: string = '';
    private time: ScheduleTime = { 
        day: WeekDay.Monday, // Default to Monday instead of 0
        start: 0, 
        end: 0 
    };
    private startHour: number = 0;
    private dayIndex: number = 0;

    static get observedAttributes() {
        return ['data-label', 'data-color', 'data-start', 'data-end', 'data-day-index', 'data-start-hour'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        switch(name) {
            case 'data-label':
                this.label = newValue;
                break;
            case 'data-color':
                this.color = newValue;
                break;
            case 'data-start':
                this.time.start = parseInt(newValue, 10);
                break;
            case 'data-end':
                this.time.end = parseInt(newValue, 10);
                break;
            case 'data-day-index':
                this.dayIndex = parseInt(newValue, 10);
                break;
            case 'data-start-hour':
                this.startHour = parseInt(newValue, 10);
                break;
        }
        this.render();
    }

    private render() {
        const backgroundColor = this.color.startsWith('#') 
            ? `${this.color}40`
            : this.color.replace('rgb', 'rgba').replace(')', ', 0.25)');

        const startRow = this.time.start - this.startHour + 2;
        const endRow = this.time.end - this.startHour + 1;

        this.style.cssText = `
            grid-row: ${startRow} / ${endRow + 1};
            grid-column: ${this.dayIndex + 1};
            background-color: ${backgroundColor};
            border-left: 4px solid ${this.color};
            font-size: 12px;
            color: var(--text-primary-color);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            text-overflow: ellipsis;
            min-height: 28px;
            padding: 4px;
            border-radius: 0 4px 4px 0;
            z-index: 1;
        `;

        this.textContent = this.label || '';
    }
}

customElements.define('event-cell', EventCell);
