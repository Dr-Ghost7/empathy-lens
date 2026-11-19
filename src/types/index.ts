export type LensCategory = 'visual' | 'motor' | 'situational' | 'cognitive';

export type LensId =
  | 'deuteranopia'
  | 'protanopia'
  | 'tritanopia'
  | 'achromatopsia'
  | 'blur'
  | 'tunnel'
  | 'sunlight'
  | 'tremor'
  | 'keyboard_only'
  | 'slow_network'
  | 'distraction';

export interface LensInfo {
  id: LensId;
  name: string;
  category: LensCategory;
  tagline: string;
  description: string;
  prevalence: string;
  impairmentType: 'permanent' | 'temporary' | 'situational';
  wcagCriteria: {
    id: string;
    name: string;
    level: 'A' | 'AA' | 'AAA';
  }[];
  technicalMechanism: string;
  badgeColor: string;
}

export type ChallengeId =
  | 'sunshine-checkout'
  | 'keyboard-seat-picker'
  | 'colorblind-form'
  | 'tremor-donation';

export interface WcagViolation {
  id: string;
  rule: string;
  level: 'A' | 'AA' | 'AAA';
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  title: string;
  description: string;
  element: string;
  wcagUrl: string;
  howToFix: string;
}

export interface ChallengeFixToggle {
  id: string;
  label: string;
  description: string;
  codeDiff: {
    flawed: string;
    fixed: string;
  };
}

export interface Challenge {
  id: ChallengeId;
  title: string;
  category: LensCategory;
  defaultLens: LensId;
  compatibleLenses: LensId[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estTime: string;
  scenario: string;
  objective: string;
  flawSummary: string;
  violations: WcagViolation[];
  fixToggles: ChallengeFixToggle[];
  learningTakeaways: string[];
}
