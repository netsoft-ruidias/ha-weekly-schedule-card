import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant, fireEvent } from 'custom-card-helpers';
import { CardEditorConfig, DEFAULT_CONFIG } from './types';

@customElement('weekly-schedule-card-editor')
export class WeeklyScheduleCardEditor extends LitElement {
    @property({ attribute: false }) public hass!: HomeAssistant;
    @property({ attribute: false }) private _config?: CardEditorConfig;

    setConfig(config: CardEditorConfig): void {
        this._config = {
            ...DEFAULT_CONFIG,
            ...config
        };
    }

    protected configChanged(ev: Event): void {
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

    static styles = css`
        .option {
            padding: 4px 0px;
            display: flex;
            flex-direction: column;
        }
        ha-switch {
            margin-right: 16px;
        }
        .option > div {
            display: flex;
            align-items: center;
        }
    `;

    protected render() {
        if (!this.hass || !this._config) {
            return html``;
        }

        return html`
            <div class="card-config">
                <div class="option">
                    <ha-textfield
                        label="Hora de Início (0-23)"
                        type="number"
                        min="0"
                        max="23"
                        .value="${this._config.startHour ?? DEFAULT_CONFIG.startHour}"
                        .configValue=${'startHour'}
                        @input=${this.configChanged}
                    ></ha-textfield>
                </div>
                <div class="option">
                    <ha-textfield
                        label="Hora de Fim (0-23)"
                        type="number"
                        min="0"
                        max="23"
                        .value="${this._config.endHour ?? DEFAULT_CONFIG.endHour}"
                        .configValue=${'endHour'}
                        @input=${this.configChanged}
                    ></ha-textfield>
                </div>
                <div class="option">
                    <div>
                        <ha-switch
                            .checked="${this._config.showWeekend ?? DEFAULT_CONFIG.showWeekend}"
                            .configValue=${'showWeekend'}
                            @change=${this.configChanged}
                        ></ha-switch>
                        <span>Mostrar Fim de Semana</span>
                    </div>
                </div>
            </div>
        `;
    }
}