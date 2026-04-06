export type DesiredKey = 'left' | 'right';

export type ClickerMode = 'auto' | 'burst';

export interface ClickerSettings {
  cps: number;
  variation: number;
  hotkey: string;
  button: 'left' | 'right';
  holdToClick: boolean;
}

export interface BurstClickerSettings {
  clicks: number;
  delay: number;
  button: 'left' | 'right';
}

export interface SessionConfig {
  id: number;
  mode: ClickerMode;
  cps: number;
  variation: number;
  hotkey: string;
  desiredKey: DesiredKey;
  holdToClick: boolean;
  burstClicks: number;
  burstDelay: number;
  burstDesiredKey: DesiredKey;
}