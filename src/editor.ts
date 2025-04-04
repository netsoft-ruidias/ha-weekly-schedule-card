import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, fireEvent } from 'custom-card-helpers';
import { mdiDelete } from '@mdi/js';
import { CardEditorConfig, Event, WeekDay } from './types';

@customElement('weekly-schedule-card-editor')
export class WeeklyScheduleCardEditor extends LitElement {
    @property({ attribute: false }) public hass!: HomeAssistant;
    @property({ attribute: false }) private _config?: CardEditorConfig;
    @state() private _events: Event[] = [];
    @state() private _activeEventIndex: number = -1;

    setConfig(config: CardEditorConfig): void {
        this._config = config;
        this._events = [...(config.events || [])];
    }

    private _selectEvent(index: number): void {
        this._activeEventIndex = this._activeEventIndex === index ? -1 : index;
        this.requestUpdate();
    }

    private _deleteEvent(e: MouseEvent, index: number): void {
        e.stopPropagation();
        this._events.splice(index, 1);
        this._activeEventIndex = -1;
        this._updateConfig();
    }

    private _addEvent(): void {
        this._events.push({
            label: 'New Event',
            color: '#ff0000',
            schedule: []
        });
        this._updateConfig();
    }

    private _updateEventProperty(index: number, property: keyof Event, value: string, ev: InputEvent): void {
        ev.stopPropagation();
        if (this._events[index]) {
            this._events[index] = {
                ...this._events[index],
                [property]: value
            };
            this._updateConfig();
        }
    }

    private _addSchedule(eventIndex: number): void {
        if (this._events[eventIndex]) {
            // Create a new event object with a new schedule array
            this._events[eventIndex] = {
                ...this._events[eventIndex],
                schedule: [
                    ...(this._events[eventIndex].schedule || []),
                    {
                        day: WeekDay.Monday,
                        start: this._config?.startHour || 9,
                        end: this._config?.endHour || 17
                    }
                ]
            };
            
            this._updateConfig();
        }
    }

    private _updateSchedule(
        eventIndex: number, 
        scheduleIndex: number, 
        field: string, 
        value: any,
        ev: InputEvent | CustomEvent
    ): void {
        ev.stopPropagation();
        if (this._events[eventIndex]?.schedule?.[scheduleIndex]) {
            const newSchedule = [...this._events[eventIndex].schedule!];
            
            // Create new schedule item
            const updatedSchedule = {
                ...newSchedule[scheduleIndex],
                [field]: field === 'day' 
                    ? (value as WeekDay)
                    : value
            };

            // Update the schedule
            newSchedule[scheduleIndex] = updatedSchedule;
            
            // Update the event
            this._events[eventIndex] = {
                ...this._events[eventIndex],
                schedule: newSchedule
            };

            this._updateConfig();
            this.requestUpdate();
        }
    }

    private _deleteSchedule(eventIndex: number, scheduleIndex: number): void {
        if (this._events[eventIndex]?.schedule) {
            const newSchedule = [...this._events[eventIndex].schedule];
            newSchedule.splice(scheduleIndex, 1);
            this._events[eventIndex] = {
                ...this._events[eventIndex],
                schedule: newSchedule
            };
            this._updateConfig();
        }
    }

    private _updateConfig(): void {
        if (!this._config) return;

        const newConfig = {
            ...this._config,
            events: [...this._events]
        };

        fireEvent(this, 'config-changed', { config: newConfig });
    }

    protected configChanged(ev: InputEvent): void {
        const target = ev.target as HTMLInputElement & { configValue: string, checked?: boolean };
        if (!this._config || !target) return;

        let value: string | number | boolean;

        if (target.configValue === 'showWeekend') {
            value = target.checked ?? false;
        } else if (target.configValue === 'startHour' || target.configValue === 'endHour') {
            const numValue = parseInt(target.value);
            value = isNaN(numValue) ? 0 : Math.min(Math.max(numValue, 0), 23);
        } else {
            value = target.value || '';
        }

        const newConfig = {
            ...this._config,
            [target.configValue]: value,
        };

        fireEvent(this, 'config-changed', { config: newConfig });
    }

    protected render() {
        if (!this.hass || !this._config) {
            return html``;
        }

        return html`
            <div class="card-config">
                <div class="basic-config">
                    <ha-textfield
                        label="Start Hour (0-23)"
                        type="number"
                        min="0"
                        max="23"
                        .value="${this._config.startHour}"
                        @change="${this.configChanged}"
                        .configValue=${'startHour'}
                    ></ha-textfield>
                    <ha-textfield
                        label="End Hour (0-23)"
                        type="number"
                        min="0"
                        max="23"
                        .value="${this._config.endHour}"
                        @change="${this.configChanged}"
                        .configValue=${'endHour'}
                    ></ha-textfield>
                    <ha-formfield label="Show Weekend">
                        <ha-switch
                            .checked="${this._config.showWeekend}"
                            @change="${this.configChanged}"
                            .configValue=${'showWeekend'}
                        ></ha-switch>
                    </ha-formfield>
                </div>

                <div class="events-config">
                    <div class="events-list">
                        ${this._events.map((event, index) => html`
                            <div class="event-item ${this._activeEventIndex === index ? 'active' : ''}">
                                <div class="event-header" @click="${() => this._selectEvent(index)}">
                                    <div class="event-color" style="background-color: ${event.color}"></div>
                                    <div class="event-label">${event.label}</div>
                                    <ha-icon-button
                                        .path=${mdiDelete}
                                        @click="${(e: MouseEvent) => this._deleteEvent(e, index)}"
                                    ></ha-icon-button>
                                </div>
                                ${this._activeEventIndex === index ? html`
                                    <div class="event-details">
                                        <ha-textfield
                                            label="Label"
                                            .value="${event.label}"
                                            @change="${(e: InputEvent) => this._updateEventProperty(index, 'label', (e.target as HTMLInputElement).value, e)}"
                                        ></ha-textfield>
                                        <ha-textfield
                                            label="Color"
                                            .value="${event.color}"
                                            @change="${(e: InputEvent) => this._updateEventProperty(index, 'color', (e.target as HTMLInputElement).value, e)}"
                                        ></ha-textfield>
                                        <div class="schedule-list">
                                            ${event.schedule?.map((schedule, scheduleIndex) => html`
                                                <div class="schedule-item">
                                                    <ha-select
                                                        label="Day"
                                                        .value="${schedule.day}"
                                                        @selected="${(e: CustomEvent) => this._handleDaySelect(index, scheduleIndex, e)}"
                                                    >
                                                        ${Object.entries(WeekDay).map(([key, value]) => html`
                                                            <ha-list-item 
                                                                .value="${value}"
                                                                ?selected="${value === schedule.day}"
                                                            >
                                                                ${key}
                                                            </ha-list-item>
                                                        `)}
                                                    </ha-select>
                                                    <ha-textfield
                                                        label="Start"
                                                        type="number"
                                                        min="0"
                                                        max="23"
                                                        .value="${schedule.start}"
                                                        @change="${(e: InputEvent) => this._updateSchedule(index, scheduleIndex, 'start', Number((e.target as HTMLInputElement).value), e)}"
                                                    ></ha-textfield>
                                                    <ha-textfield
                                                        label="End"
                                                        type="number"
                                                        min="0"
                                                        max="23"
                                                        .value="${schedule.end}"
                                                        @change="${(e: InputEvent) => this._updateSchedule(index, scheduleIndex, 'end', Number((e.target as HTMLInputElement).value), e)}"
                                                    ></ha-textfield>
                                                    <ha-icon-button
                                                        .path=${mdiDelete}
                                                        @click="${() => this._deleteSchedule(index, scheduleIndex)}"
                                                    ></ha-icon-button>
                                                </div>
                                            `)}
                                            <ha-button
                                                @click="${() => this._addSchedule(index)}"
                                            >Add Schedule</ha-button>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        `)}
                        <ha-button
                            @click="${this._addEvent}"
                        >Add Event</ha-button>
                    </div>
                </div>
            </div>
        `;
    }

    static styles = css`
        .card-config {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .basic-config {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        .events-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .event-item {
            border: 1px solid var(--divider-color);
            border-radius: 4px;
            padding: 8px;
        }
        .event-header {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }
        .event-color {
            width: 16px;
            height: 16px;
            border-radius: 50%;
        }
        .event-details {
            margin-top: 8px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .schedule-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .schedule-item {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr auto;
            gap: 8px;
            align-items: center;
        }
    `;

    // First, add a new method to handle day selection specifically
    private _handleDaySelect(
        eventIndex: number,
        scheduleIndex: number,
        e: CustomEvent
    ): void {
        // Stop propagation immediately
        e.preventDefault();
        e.stopPropagation();
        
        const selectedDay = e.detail.value as WeekDay;
        
        // Update schedule directly
        if (this._events[eventIndex]?.schedule?.[scheduleIndex]) {
            const newSchedule = [...this._events[eventIndex].schedule!];
            newSchedule[scheduleIndex] = {
                ...newSchedule[scheduleIndex],
                day: selectedDay
            };
            
            this._events[eventIndex] = {
                ...this._events[eventIndex],
                schedule: newSchedule
            };
            
            this._updateConfig();
        }
    }
}