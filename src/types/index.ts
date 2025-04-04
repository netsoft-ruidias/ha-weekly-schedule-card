export enum WeekDay {
    Monday = 'monday',
    Tuesday = 'tuesday',
    Wednesday = 'wednesday',
    Thursday = 'thursday',
    Friday = 'friday',
    Saturday = 'saturday',
    Sunday = 'sunday'
}

export interface ScheduleTime {
    day: WeekDay;
    start: number;
    end: number;
}

export interface Event {
    label: string;
    color: string;
    schedule?: ScheduleTime[]; // Make schedule optional but ensure it's an array when present
}

export interface CardConfig {
    type: string;
    startHour: number;
    endHour: number;
    showWeekend: boolean;
    size?: number;
    events: Event[];
}

export type CardEditorConfig = Omit<CardConfig, 'type'>;

export const DEFAULT_CONFIG: Required<CardEditorConfig> = {
    startHour: 9,
    endHour: 17,
    showWeekend: false,
    size: 1,
    events: []
};