import { Challenge, ChallengeId } from '@/types';

export const CHALLENGES: Record<ChallengeId, Challenge> = {
  'sunshine-checkout': {
    id: 'sunshine-checkout',
    title: 'The Sunshine Checkout',
    category: 'situational',
    defaultLens: 'sunlight',
    compatibleLenses: ['sunlight', 'blur', 'achromatopsia'],
    difficulty: 'Beginner',
    estTime: '3-5 min',
    scenario:
      'A customer is ordering groceries on their smartphone while walking outdoors at noon. Direct sunlight (100,000+ lux) strikes the screen, washing out all low-contrast elements.',
    objective:
      'Inspect the checkout form, complete the delivery address, agree to the terms, and submit under direct sunlight. Discover why placeholder-only text and low contrast fail completely.',
    flawSummary:
      'Faint gray placeholder text (#94a3b8) used as surrogate labels with only 2.1:1 contrast ratio, microscopic 14px checkbox, and subtle borders that vanish in daylight.',
    violations: [
      {
        id: 'wcag-143',
        rule: 'WCAG 1.4.3 Contrast (Minimum)',
        level: 'AA',
        impact: 'critical',
        title: 'Contrast Ratio is only 2.1:1 (Requires 4.5:1)',
        description:
          'The placeholder text uses #94a3b8 on a #ffffff background. Normal text must maintain at least 4.5:1 contrast against its background to remain readable under glare.',
        element: 'input::placeholder',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
        howToFix: 'Replace placeholder styling with high-contrast text (#0f172a / #334155) yielding 13.5:1 contrast.',
      },
      {
        id: 'wcag-332',
        rule: 'WCAG 3.3.2 Labels or Instructions',
        level: 'A',
        impact: 'serious',
        title: 'Form Inputs Lack Persistent Labels',
        description:
          'Inputs rely solely on placeholder attributes. Placeholders disappear once text is typed, leaving users with no context, and are unannounced or buggy on many screen readers.',
        element: '<input placeholder="Street Address" />',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html',
        howToFix: 'Add explicit <label htmlFor="address"> tags with persistent, visible text above each field.',
      },
      {
        id: 'wcag-258',
        rule: 'WCAG 2.5.8 Target Size (Minimum)',
        level: 'AA',
        impact: 'serious',
        title: 'Checkbox Touch Target is only 16x16px',
        description:
          'The agreement checkbox is sized at 16x16px and does not include its adjacent text in the click boundary, requiring precision finger tapping impossible in active mobile environments.',
        element: '<input type="checkbox" />',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html',
        howToFix: 'Wrap both checkbox and text in a flex container with min-height 44px and cursor: pointer.',
      },
      {
        id: 'wcag-1411',
        rule: 'WCAG 1.4.11 Non-text Contrast',
        level: 'AA',
        impact: 'moderate',
        title: 'Input Borders Wash Out in Direct Light',
        description:
          'The input boundary border uses #e2e8f0 (1.2:1 contrast against white). Visual boundaries of form components require at least 3:1 contrast against adjacent background colors.',
        element: '.input-border',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html',
        howToFix: 'Darken input boundaries to #94a3b8 or #64748b with a crisp 1.5px border and clear active ring.',
      },
    ],
    fixToggles: [
      {
        id: 'high_contrast',
        label: 'Elevate Contrast to AAA Standard',
        description:
          'Swaps faint slate-400 text for slate-900 (13.5:1 contrast) and deepens input borders to pass WCAG 1.4.3 and 1.4.11.',
        codeDiff: {
          flawed: `<input className="border border-slate-200 text-slate-400 placeholder:text-slate-300" />`,
          fixed: `<input className="border-2 border-slate-500 text-slate-900 font-medium placeholder:text-slate-500 bg-white shadow-sm" />`,
        },
      },
      {
        id: 'semantic_labels',
        label: 'Add Persistent Semantic Labels',
        description:
          'Replaces transient placeholders with explicit, accessible <label htmlFor="..."> tags.',
        codeDiff: {
          flawed: `<input placeholder="Enter your full street address" />`,
          fixed: `<label htmlFor="street-addr" className="block text-xs font-bold text-slate-900 mb-1">
  Street Address <span aria-hidden="true" className="text-rose-600">*</span>
</label>
<input id="street-addr" aria-required="true" />`,
        },
      },
      {
        id: 'target_size',
        label: 'Expand Touch Target to 48px',
        description:
          'Wraps the agreement checkbox in an expansive label container satisfying WCAG 2.5.5 / 2.5.8 touch target standards.',
        codeDiff: {
          flawed: `<div className="flex items-center gap-1">
  <input type="checkbox" className="w-3.5 h-3.5" />
  <span className="text-[11px] text-slate-400">I agree to terms</span>
</div>`,
          fixed: `<label className="flex items-center gap-3 p-3 rounded-xl border border-slate-300 bg-slate-50/80 cursor-pointer min-h-[48px] hover:bg-slate-100 transition-colors">
  <input type="checkbox" className="w-5 h-5 rounded border-slate-400 text-emerald-600 focus:ring-emerald-500" />
  <span className="text-xs font-semibold text-slate-900 select-none">I agree to delivery terms and conditions</span>
</label>`,
        },
      },
    ],
    learningTakeaways: [
      'Never rely on placeholder text as a replacement for labels; it fails contrast, disappears when typed, and reduces recall.',
      'Mobile devices frequently operate in 50,000 to 100,000 lux outdoor daylight; subtle gray borders become 100% invisible.',
      'Interactive touch targets must be at least 44x44px (WCAG AAA) or 24x24px with padding (WCAG AA).',
    ],
  },

  'keyboard-seat-picker': {
    id: 'keyboard-seat-picker',
    title: 'The Keyboard-Only Flight Seat Booking',
    category: 'motor',
    defaultLens: 'keyboard_only',
    compatibleLenses: ['keyboard_only', 'tremor'],
    difficulty: 'Intermediate',
    estTime: '4-6 min',
    scenario:
      'A traveler with a temporary wrist sprain cannot use their mouse or trackpad. They must navigate a flight seat map, select Seat 14B, and confirm their booking using solely the keyboard (Tab, Enter, Space).',
    objective:
      'Experience the extreme barrier of <div>-based buttons, stripped focus outlines (outline:none), and un-trapped dialogs that trap or misplace keyboard focus.',
    flawSummary:
      'Seats coded as un-focusable <div> tags, global CSS stripping outlines (outline: none), missing ARIA pressed states, and confirmation dialog allowing focus to escape into background.',
    violations: [
      {
        id: 'wcag-211',
        rule: 'WCAG 2.1.1 Keyboard',
        level: 'A',
        impact: 'critical',
        title: 'Seats are Un-focusable <div> Tags',
        description:
          'Interactive seat elements are coded as <div onClick="..."> without tabIndex="0" or keyboard event listeners. Keyboard users cannot reach or trigger them.',
        element: '<div className="seat" onClick={selectSeat}>14B</div>',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html',
        howToFix: 'Use semantic <button type="button"> elements or add tabIndex="0" with onKeyDown handlers.',
      },
      {
        id: 'wcag-247',
        rule: 'WCAG 2.4.7 Focus Visible',
        level: 'AA',
        impact: 'critical',
        title: 'Focus Ring Stripped with outline: none',
        description:
          'Custom CSS applies *:focus { outline: none; }, rendering the keyboard cursor completely invisible. Users have zero indication of which element currently holds focus.',
        element: '*:focus { outline: none; }',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html',
        howToFix: 'Add prominent focus rings: focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2.',
      },
      {
        id: 'wcag-243',
        rule: 'WCAG 2.4.3 Focus Order & Modal Trapping',
        level: 'A',
        impact: 'serious',
        title: 'Modal Dialog Does Not Trap Keyboard Focus',
        description:
          'When the booking confirmation dialog opens, focus is not moved into the dialog, and pressing Tab continues to cycle through hidden background elements.',
        element: '<div role="dialog">...</div>',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html',
        howToFix: 'Shift focus into dialog on open, trap Tab cycling within dialog bounds, and close on Escape key.',
      },
      {
        id: 'wcag-412',
        rule: 'WCAG 4.1.2 Name, Role, Value',
        level: 'A',
        impact: 'moderate',
        title: 'Missing Accessible Name and Selected State',
        description:
          'Screen readers and accessibility tools hear only "14B" without information about availability, pricing, or selection state (aria-pressed / aria-selected).',
        element: '<button>14B</button>',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
        howToFix: 'Add aria-label="Seat 14B, Standard, $140, Available" and aria-pressed={isSelected}.',
      },
    ],
    fixToggles: [
      {
        id: 'semantic_buttons',
        label: 'Convert <div> to Semantic <button>',
        description:
          'Restores native browser keyboard focusability, Enter/Space activation, and role="button" semantics.',
        codeDiff: {
          flawed: `<div onClick={() => selectSeat('14B')} className="seat">14B</div>`,
          fixed: `<button type="button" onClick={() => selectSeat('14B')} className="seat cursor-pointer">14B</button>`,
        },
      },
      {
        id: 'visible_focus',
        label: 'Restore High-Visibility Focus Rings',
        description:
          'Removes outline:none and adds explicit focus-visible rings complying with WCAG 2.4.7 and 2.4.11.',
        codeDiff: {
          flawed: `<button className="focus:outline-none focus:ring-0">14B</button>`,
          fixed: `<button className="focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">14B</button>`,
        },
      },
      {
        id: 'modal_focus_trap',
        label: 'Implement Modal Focus Trap & Esc Handler',
        description:
          'Locks keyboard tab sequence inside the confirmation modal until confirmed or dismissed with the Escape key.',
        codeDiff: {
          flawed: `<div className="fixed inset-0 modal">...</div>`,
          fixed: `<div role="dialog" aria-modal="true" aria-labelledby="modal-title" onKeyDown={handleModalKeyDown}>...</div>`,
        },
      },
    ],
    learningTakeaways: [
      'Never remove CSS outline without providing an equal or superior :focus-visible replacement.',
      'Native <button> elements provide keyboard Tab stop, Enter activation, and Space activation for free.',
      'Modals must trap keyboard focus so users do not accidentally interact with background forms.',
    ],
  },

  'colorblind-form': {
    id: 'colorblind-form',
    title: 'The Colorblind Error Maze',
    category: 'visual',
    defaultLens: 'deuteranopia',
    compatibleLenses: ['deuteranopia', 'protanopia', 'achromatopsia'],
    difficulty: 'Beginner',
    estTime: '3-4 min',
    scenario:
      'A software engineer with Deuteranopia (green-blind color deficiency, affecting 6% of men) is filling out a multi-field account registration form with subtle syntax errors.',
    objective:
      'Try to identify which field failed validation when the designer used ONLY a red border for errors and green border for valid fields without text or icons.',
    flawSummary:
      'Form validation uses color alone (red vs green border) without error copy or icons, violating WCAG 1.4.1 Use of Color and leaving CVD users guessing.',
    violations: [
      {
        id: 'wcag-141',
        rule: 'WCAG 1.4.1 Use of Color',
        level: 'A',
        impact: 'critical',
        title: 'Color Used as the Sole Visual Indicator of Error',
        description:
          'The invalid email input is flagged only by changing border color from #10b981 (green) to #ef4444 (red). Under deuteranopia and protanopia, both appear as identical muddy brown hues.',
        element: 'input.border-red-500',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html',
        howToFix: 'Accompany color cues with descriptive inline text and distinct status icons (e.g. AlertCircle).',
      },
      {
        id: 'wcag-331',
        rule: 'WCAG 3.3.1 Error Identification',
        level: 'A',
        impact: 'serious',
        title: 'No Textual Error Explanation Provided',
        description:
          'When validation fails, no text explains what was wrong (e.g. "Missing @ symbol" or "Must be at least 8 characters"), violating error identification requirements.',
        element: '.form-field',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html',
        howToFix: 'Render an explicit error message element (<p id="email-error">) explaining the exact requirement.',
      },
      {
        id: 'wcag-412-aria',
        rule: 'WCAG 4.1.2 / 1.3.1 Programmatic Error Association',
        level: 'A',
        impact: 'serious',
        title: 'Missing aria-invalid and aria-describedby',
        description:
          'The input element lacks aria-invalid="true" and is not linked to its error message with aria-describedby, leaving screen readers unaware of the failure state.',
        element: '<input type="email" />',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html',
        howToFix: 'Add aria-invalid="true" and aria-describedby="email-error-msg" to the input element.',
      },
    ],
    fixToggles: [
      {
        id: 'status_icons',
        label: 'Add Non-Color Status Icon Indicators',
        description:
          'Displays an AlertCircle icon for errors and a CheckCircle for valid fields so color perception is not required.',
        codeDiff: {
          flawed: `<input className={isValid ? "border-emerald-500" : "border-rose-500"} />`,
          fixed: `<div className="relative">
  <input className={isValid ? "border-emerald-500" : "border-rose-500"} />
  {hasError ? <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-3" /> : <CheckCircle className="w-4 h-4 text-emerald-500 absolute right-3 top-3" />}
</div>`,
        },
      },
      {
        id: 'error_text',
        label: 'Provide Clear Inline Error Messages',
        description:
          'Renders descriptive, readable guidance text directly underneath invalid fields.',
        codeDiff: {
          flawed: `<!-- No error message element -->`,
          fixed: `<p id="email-error" className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
  Please enter a valid email address with an '@' symbol.
</p>`,
        },
      },
      {
        id: 'aria_validation',
        label: 'Link ARIA Error Attributes Programmatically',
        description:
          'Associates input with its error description via aria-invalid and aria-describedby.',
        codeDiff: {
          flawed: `<input type="email" id="email" />`,
          fixed: `<input type="email" id="email" aria-invalid="true" aria-describedby="email-error" />`,
        },
      },
    ],
    learningTakeaways: [
      'Color must never be the only visual means of conveying information, indicating an action, or distinguishing an element.',
      'Always combine color changes with shape changes: icons, underline text, or badge shapes.',
      'Programmatically link errors to form controls with aria-describedby so screen reader users hear the error upon focusing.',
    ],
  },

  'tremor-donation': {
    id: 'tremor-donation',
    title: 'The Tremor Donation Widget',
    category: 'motor',
    defaultLens: 'tremor',
    compatibleLenses: ['tremor', 'blur'],
    difficulty: 'Intermediate',
    estTime: '4-5 min',
    scenario:
      'A donor with Parkinson\'s disease or essential tremor is trying to contribute $25 to a community fundraiser. Involuntary hand oscillations cause the cursor to wander ±15px.',
    objective:
      'Try selecting the $25 tier and enabling the "Cover 3% fee" checkbox while the tremor lens is active. Experience how tiny targets and cramped spacing cause accidental wrong clicks.',
    flawSummary:
      'Donation amount pills are spaced only 2px apart, checkbox target is 12x12px, and slight cursor jitter repeatedly triggers the wrong amount or misses the target.',
    violations: [
      {
        id: 'wcag-255',
        rule: 'WCAG 2.5.5 / 2.5.8 Target Size',
        level: 'AA',
        impact: 'critical',
        title: 'Pills have cramped 2px spacing and small hit areas',
        description:
          'Donation buttons ($10, $25, $50, $100) are placed with only 2px gap. Users with tremors or unsteady motor control routinely miss by a few pixels and click the adjacent $100 button.',
        element: '.button-group { gap: 2px; }',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html',
        howToFix: 'Increase target dimensions to minimum 48px height and introduce generous 12px+ spacing between buttons.',
      },
      {
        id: 'wcag-258-check',
        rule: 'WCAG 2.5.8 Target Size (Minimum)',
        level: 'AA',
        impact: 'serious',
        title: 'Checkbox Hit Target is Microscopic (12x12px)',
        description:
          'The fee coverage checkbox is only 12x12px, and its adjacent text is a separate detached <span>, requiring pinpoint cursor precision that is impossible with a tremor.',
        element: '<input type="checkbox" className="w-3 h-3" />',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html',
        howToFix: 'Wrap both checkbox and text in a large <label> container with 16px padding and min-height 48px.',
      },
      {
        id: 'wcag-251',
        rule: 'WCAG 2.5.1 Pointer Gestures & Hover Traps',
        level: 'A',
        impact: 'moderate',
        title: 'Transient Hover State Disappears on Jitter',
        description:
          'Important contextual info (e.g. tax deductible receipt notice) appears only on mouse hover and vanishes instantly when the jittering cursor moves 1 pixel off.',
        element: '.hover-tooltip',
        wcagUrl: 'https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html',
        howToFix: 'Make contextual information persistent or toggled via explicit click/tap with dismiss button.',
      },
    ],
    fixToggles: [
      {
        id: 'generous_targets',
        label: 'Expand Button Target Size & Spacing',
        description:
          'Enlarges pill buttons to 48px height with 12px gap, providing forgiving boundaries that absorb tremor variance.',
        codeDiff: {
          flawed: `<div className="flex gap-0.5">
  <button className="px-2 py-1 text-xs">$10</button>
  <button className="px-2 py-1 text-xs">$25</button>
</div>`,
          fixed: `<div className="grid grid-cols-2 gap-3">
  <button className="h-12 text-sm font-bold rounded-xl border-2 hover:border-emerald-500">$10</button>
  <button className="h-12 text-sm font-bold rounded-xl border-2 hover:border-emerald-500">$25</button>
</div>`,
        },
      },
      {
        id: 'clickable_label_container',
        label: 'Generous Full-Width Checkbox Target',
        description:
          'Encloses checkbox and descriptive text into an expansive interactive card.',
        codeDiff: {
          flawed: `<div className="flex items-center gap-1">
  <input type="checkbox" className="w-3 h-3" />
  <span className="text-xs">Cover transaction fee</span>
</div>`,
          fixed: `<label className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-slate-700 bg-slate-900/60 cursor-pointer min-h-[52px] hover:border-slate-500 transition-all">
  <input type="checkbox" className="w-5 h-5 rounded text-emerald-500" />
  <span className="text-xs font-medium text-slate-200">Cover the 3% processing fee so 100% goes to the cause</span>
</label>`,
        },
      },
      {
        id: 'persistent_selection',
        label: 'Persistent Visual Feedback & Tactile Rings',
        description:
          'Replaces ephemeral hover-only cues with bold, selected borders and high-contrast indicators.',
        codeDiff: {
          flawed: `<button className="hover:bg-slate-800">...`,
          fixed: `<button className={isSelected ? "bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50" : "border-slate-800 bg-slate-900"}>...`,
        },
      },
    ],
    learningTakeaways: [
      'Target size is not just for mobile touch; millions of desktop users with motor tremors rely on forgiving hit areas.',
      'Adjacent interactive elements must have adequate spacing (at least 8-12px) to prevent disastrous mis-clicks.',
      'Never hide critical info inside hover-only tooltips that vanish with 1 pixel of pointer movement.',
    ],
  },
};

export const CHALLENGE_LIST = Object.values(CHALLENGES);
