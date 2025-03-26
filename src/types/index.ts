export enum WeekDay {
    Monday = 'monday',
    Tuesday = 'tuesday',
    Wednesday = 'wednesday',
    Thursday = 'thursday',
    Friday = 'friday',
    Saturday = 'saturday',
    Sunday = 'sunday'
}

export interface ScheduleEvent {
    day: WeekDay;
    start: number;
    end: number;
    label: string;
    color: string;
}

export interface CardConfig {
    type: string;
    title?: string;
    content?: string;
    startHour: number;
    endHour: number;
    showWeekend: boolean;
    size?: number;
    events: ScheduleEvent[];
}

export type CardEditorConfig = Omit<CardConfig, 'type'>;

export const DEFAULT_CONFIG: Required<CardEditorConfig> = {
    title: '',
    content: '',
    startHour: 9,
    endHour: 17,
    showWeekend: false,
    size: 1,
    events: []
};