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

    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['data-label', 'data-color', 'data-start', 'data-end', 'data-day-index'];
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
        }
        this.render();
    }

    setProperties(props: {
        label: string;
        color: string;
        time: ScheduleTime;
        startHour: number;
        dayIndex: number;
    }) {
        this.label = props.label;
        this.color = props.color;
        this.time = props.time;
        this.startHour = props.startHour;
        this.dayIndex = props.dayIndex;
        this.render();
    }

    private render() {
        const backgroundColor = this.color.startsWith('#') 
            ? `${this.color}40`
            : this.color.replace('rgb', 'rgba').replace(')', ', 0.25)');

        const startRow = this.time.start - this.startHour + 2;
        const endRow = this.time.end - this.startHour + 2;

        this.style.cssText = `
            grid-row: ${startRow} / ${endRow + 1};
            grid-column: ${this.dayIndex + 2};
            background-color: ${backgroundColor};
            border-left: 4px solid ${this.color};
            font-size: 13px;
            color: var(--text-primary-color);
            text-align: center;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            text-overflow: ellipsis;
            min-height: 28px;
            padding: 4px;
            margin: 2px;
            border-radius: 0 4px 4px 0;
        `;

        this.textContent = this.label || '';
    }
}

// Register the custom element
customElements.define('event-cell', EventCell);
