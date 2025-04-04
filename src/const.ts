import { CardEditorConfig } from './types';

export const DEFAULT_CONFIG: Required<CardEditorConfig> = {
    startHour: 9,
    endHour: 17,
    showWeekend: false,
    size: 1,
    events: []
};