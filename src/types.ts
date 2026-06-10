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

export interface ModuleCompletion {
  artifact: string;
  completedAt: string;
}

export interface UserState {
  name: string | null;
  score: number | null;
  levelShort: string | null;
  levelFull: string | null;
  firstModule: string | null;
  onboarded: boolean;
  moduleCompletions: Record<string, ModuleCompletion>;
}

export const EMPTY_USER: UserState = {
  name: null,
  score: null,
  levelShort: null,
  levelFull: null,
  firstModule: null,
  onboarded: false,
  moduleCompletions: {},
};
