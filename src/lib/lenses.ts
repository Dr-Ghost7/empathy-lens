import { LensId, LensInfo } from '@/types';

export const LENSES: Record<LensId, LensInfo> = {
  deuteranopia: {
    id: 'deuteranopia',
    name: 'Deuteranopia',
    category: 'visual',
    tagline: 'Green-weak / green-blind color deficiency',
    description:
      'The most prevalent form of color vision deficiency (CVD). Greens, reds, and browns merge into muted yellowish-khaki tones. Red error states and green success states become indistinguishable without supplemental icons or text.',
    prevalence: '~6% of males, ~0.4% of females',
    impairmentType: 'permanent',
    wcagCriteria: [
      { id: '1.4.1', name: 'Use of Color', level: 'A' },
      { id: '1.4.3', name: 'Contrast (Minimum)', level: 'AA' },
    ],
    technicalMechanism: 'SVG feColorMatrix color transformation simulating missing M-cone photoreceptors.',
    badgeColor: 'emerald',
  },
  protanopia: {
    id: 'protanopia',
    name: 'Protanopia',
    category: 'visual',
    tagline: 'Red-weak / red-blind color deficiency',
    description:
      'Caused by the total absence of L-cone photoreceptors. Red colors appear dark brown or charcoal, and spectral sensitivity to long wavelengths is compressed. Red text on black or dark gray backgrounds becomes virtually unreadable.',
    prevalence: '~1% of males, ~0.02% of females',
    impairmentType: 'permanent',
    wcagCriteria: [
      { id: '1.4.1', name: 'Use of Color', level: 'A' },
      { id: '1.4.3', name: 'Contrast (Minimum)', level: 'AA' },
    ],
    technicalMechanism: 'SVG feColorMatrix projecting the RGB color cube onto the deuteran/protan confusion line.',
    badgeColor: 'rose',
  },
  tritanopia: {
    id: 'tritanopia',
    name: 'Tritanopia',
    category: 'visual',
    tagline: 'Blue-yellow color deficiency',
    description:
      'A rare condition where S-cones are missing or dysfunctional. Blue appears greenish and yellow appears violet or light grey. Primary action buttons relying on high-saturation blue can lose contextual prominence.',
    prevalence: '<0.01% of population',
    impairmentType: 'permanent',
    wcagCriteria: [
      { id: '1.4.1', name: 'Use of Color', level: 'A' },
      { id: '1.4.11', name: 'Non-text Contrast', level: 'AA' },
    ],
    technicalMechanism: 'SVG feColorMatrix computing trichromatic mapping without short-wavelength sensitivity.',
    badgeColor: 'amber',
  },
  achromatopsia: {
    id: 'achromatopsia',
    name: 'Achromatopsia',
    category: 'visual',
    tagline: 'Complete monochromatic vision (Rod Monochromacy)',
    description:
      'Total inability to perceive color; vision is mediated solely by retinal rods. The entire UI is rendered strictly in grayscale luminance values. Highlights, tags, badges, and status colors must rely exclusively on luminance contrast and iconography.',
    prevalence: '1 in 30,000 to 50,000 individuals',
    impairmentType: 'permanent',
    wcagCriteria: [
      { id: '1.4.1', name: 'Use of Color', level: 'A' },
      { id: '1.4.3', name: 'Contrast (Minimum)', level: 'AA' },
      { id: '1.4.6', name: 'Contrast (Enhanced)', level: 'AAA' },
    ],
    technicalMechanism: 'Standard Rec. 601 luma matrix transform (0.299R + 0.587G + 0.114B).',
    badgeColor: 'zinc',
  },
  blur: {
    id: 'blur',
    name: 'Low Acuity / Cataracts',
    category: 'visual',
    tagline: 'Uncorrected refractive error, cataracts, or corneal clouding',
    description:
      'Simulates degraded visual sharpness. Fine lines, hairline borders, ultra-thin font weights, and low-contrast grey-on-white text turn into an illegible haze. Bold typography, clear hierarchy, and prominent borders maintain legibility.',
    prevalence: 'Over 2.2 billion globally with vision impairment',
    impairmentType: 'permanent',
    wcagCriteria: [
      { id: '1.4.3', name: 'Contrast (Minimum)', level: 'AA' },
      { id: '1.4.4', name: 'Resize Text', level: 'AA' },
      { id: '1.4.12', name: 'Text Spacing', level: 'AA' },
    ],
    technicalMechanism: 'CSS backdrop-filter blur and spread convolution simulation.',
    badgeColor: 'cyan',
  },
  tunnel: {
    id: 'tunnel',
    name: 'Tunnel Vision',
    category: 'visual',
    tagline: 'Peripheral field loss (Glaucoma, Retinitis Pigmentosa)',
    description:
      'Only the central 15-20 degrees of visual field remain intact. Users cannot perceive content outside the focal aperture without extensive panning. Wide-spread layouts with error messages placed far from inputs become virtually invisible.',
    prevalence: 'Over 80 million people affected by glaucoma worldwide',
    impairmentType: 'permanent',
    wcagCriteria: [
      { id: '3.3.1', name: 'Error Identification', level: 'A' },
      { id: '3.3.2', name: 'Labels or Instructions', level: 'A' },
      { id: '1.3.2', name: 'Meaningful Sequence', level: 'A' },
    ],
    technicalMechanism: 'Dynamic SVG radial-gradient vignette following mouse coordinates.',
    badgeColor: 'purple',
  },
  sunlight: {
    id: 'sunlight',
    name: 'Bright Sun Glare',
    category: 'situational',
    tagline: 'Mobile phone outdoors in direct sunlight (100,000+ lux)',
    description:
      'A situational impairment experienced by everyone. Screen surface reflectivity washes out contrast, blacks become milky grey, and fine UI elements disappear under daylight scattering. High contrast ratios (WCAG AAA) shine here.',
    prevalence: 'Universal situational condition (all mobile users)',
    impairmentType: 'situational',
    wcagCriteria: [
      { id: '1.4.3', name: 'Contrast (Minimum)', level: 'AA' },
      { id: '1.4.11', name: 'Non-text Contrast', level: 'AA' },
      { id: '2.5.5', name: 'Target Size (Enhanced)', level: 'AAA' },
    ],
    technicalMechanism: 'High-ambient luminance washout overlay with screen reflection artifacts.',
    badgeColor: 'yellow',
  },
  tremor: {
    id: 'tremor',
    name: 'Hand Tremor / Parkinson\'s',
    category: 'motor',
    tagline: 'Involuntary rhythmic oscillation and reduced fine motor accuracy',
    description:
      'Caused by Parkinson’s disease, essential tremor, arthritis, or extreme physical exertion. Moving a pointer to a tiny 16x16px click target or keeping the mouse stationary for a click becomes frustrating. Generous targets (44px+) and forgiving spacing are required.',
    prevalence: 'Over 10 million with Parkinson’s; 1-5% of adults have essential tremor',
    impairmentType: 'permanent',
    wcagCriteria: [
      { id: '2.5.5', name: 'Target Size (Enhanced)', level: 'AAA' },
      { id: '2.5.8', name: 'Target Size (Minimum)', level: 'AA' },
      { id: '2.5.1', name: 'Pointer Gestures', level: 'A' },
    ],
    technicalMechanism: 'Synthetic pointer noise injection via requestAnimationFrame coordinate jitter.',
    badgeColor: 'red',
  },
  keyboard_only: {
    id: 'keyboard_only',
    name: 'Keyboard Only (No Pointer)',
    category: 'motor',
    tagline: 'Mobility impairment, broken trackpad, or screen reader navigation',
    description:
      'Users navigating strictly through Tab, Shift+Tab, Enter, Space, and Arrow keys. If an interactive element is a <div> instead of a <button>, or if the designer removed outlines with outline:none, the interface is completely unusable.',
    prevalence: 'Essential for blind users, power users, and those with motor disabilities',
    impairmentType: 'permanent',
    wcagCriteria: [
      { id: '2.1.1', name: 'Keyboard', level: 'A' },
      { id: '2.1.2', name: 'No Keyboard Trap', level: 'A' },
      { id: '2.4.7', name: 'Focus Visible', level: 'AA' },
      { id: '2.4.3', name: 'Focus Order', level: 'A' },
    ],
    technicalMechanism: 'Suppression of mouse click handlers within the test viewport; focus outline validation.',
    badgeColor: 'indigo',
  },
  slow_network: {
    id: 'slow_network',
    name: 'Subway 2G / Throttled',
    category: 'situational',
    tagline: 'High packet latency (2000ms+ round-trip) and intermittent drops',
    description:
      'When riding a train through a tunnel or in rural low-bandwidth areas. Buttons clicked without immediate loading feedback cause frantic multiple submissions. Optimistic UI, disabled submitting states, and clear skeletons are essential.',
    prevalence: 'Every mobile user in congested networks or rural zones',
    impairmentType: 'situational',
    wcagCriteria: [
      { id: '2.2.1', name: 'Timing Adjustable', level: 'A' },
      { id: '4.1.3', name: 'Status Messages', level: 'AA' },
    ],
    technicalMechanism: 'Artificial asynchronous execution delay injection with synthetic failure simulation.',
    badgeColor: 'blue',
  },
  distraction: {
    id: 'distraction',
    name: 'Cognitive Overload / ADHD',
    category: 'cognitive',
    tagline: 'Sensory distractions, divided attention, and short-term memory limits',
    description:
      'Living with ADHD, executive dysfunction, or navigating in a chaotic airport terminal. Complex forms with scattered visual hierarchy, flashing badges, and ambiguous instructions cause abandonment. Clean, sequential steps are critical.',
    prevalence: 'Estimated 5-8% of the global population has ADHD / neurodivergence',
    impairmentType: 'permanent',
    wcagCriteria: [
      { id: '2.2.2', name: 'Pause, Stop, Hide', level: 'A' },
      { id: '3.3.2', name: 'Labels or Instructions', level: 'A' },
      { id: '1.4.2', name: 'Audio Control', level: 'A' },
    ],
    technicalMechanism: 'Dynamic peripheral visual noise and simulated cognitive interruptions.',
    badgeColor: 'violet',
  },
};

export const LENS_LIST = Object.values(LENSES);
