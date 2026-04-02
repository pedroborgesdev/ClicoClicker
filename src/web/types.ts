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