// Types for type-safe navigation with wouter
export type Path = 
  | '/'
  | '/chat'
  | '/roleplay'
  | '/exercises'
  | '/modules'
  | '/frameworks'
  | '/ei-metrics'
  | '/data-reports'
  | '/knowledge'
  | '/sql'
  | '/heuristics'
  | '/methodology';

export type Params = Record<string, string | undefined>;
