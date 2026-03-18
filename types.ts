
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface ItineraryItem {
  time: string;
  activity: string;
}

export interface Padrinos {
  brideParents: string[];
  groomParents: string[];
  godparents: string[];
}
