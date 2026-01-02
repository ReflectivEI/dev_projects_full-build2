// Types for type-safe navigation with wouter
export type Path = 
  | '/'
  | '/chat'
  | '/roleplay'
  | '/exercises'
  | '/modules'
  | '/frameworks'
  | '/signal-intelligence'
  | '/data-reports'
  | '/knowledge'
  | '/sql'
  | '/heuristics'
  | '/methodology';

export type Params = Record<string, string | undefined>;
