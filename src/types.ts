export interface Module {
  id: string;
  code: string;
  filename: string;
  title: string;
}

export interface Engineer {
  name: string;
  level: string;
  score: string;
  started: string;
}

export interface UserState {
  name: string | null;
  score: number | null;
  levelShort: string | null;
  levelFull: string | null;
  firstModule: string | null;
  onboarded: boolean;
}

export const EMPTY_USER: UserState = {
  name: null,
  score: null,
  levelShort: null,
  levelFull: null,
  firstModule: null,
  onboarded: false,
};
