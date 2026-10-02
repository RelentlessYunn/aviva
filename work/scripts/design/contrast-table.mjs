// Prints the WCAG 2.x contrast table for aviva's palette. Usage: node contrast-table.mjs
import { ratio, over } from './contrast.mjs';
const P = {
  paper: '#F7F5F0', studio: '#ECEBE7', studioShade: '#E2E1DC', graphite: '#2A2926', muted: '#615F58',
  ink: '#2E2A8E', inkDeep: '#1E1A60', onInk: '#F7F5F0', onInkMuted: '#C8C6E4', rule: '#D9D6CE', ruleStrong: '#827F77',
  disabled: '#A3A099',
};
const rows = [
  ['graphite', 'paper', 'body text', 4.5], ['graphite', 'studio', 'text over the 3D studio', 4.5], ['graphite', 'studioShade', 'text over the studio vignette', 4.5],
  ['muted', 'paper', 'secondary text', 4.5], ['muted', 'studio', 'secondary over studio', 4.5], ['muted', 'studioShade', 'secondary over vignette', 4.5],
  ['ink', 'paper', 'ink accent / focus on paper', 4.5], ['ink', 'studio', 'ink on studio', 4.5],
  ['paper', 'graphite', 'primary button label', 4.5],
  ['onInk', 'ink', 'text on ink ground', 4.5], ['onInkMuted', 'ink', 'secondary on ink', 4.5], ['onInk', 'inkDeep', 'text on ink-deep', 4.5],
  ['ink', 'onInk', 'button label on paper button (ink ground)', 4.5],
  ['ruleStrong', 'paper', 'UI boundary (inputs, buttons)', 3], ['ruleStrong', 'studio', 'UI boundary on studio', 3],
  ['rule', 'paper', 'decorative hairline (exempt)', 1], ['disabled', 'paper', 'disabled label (exempt)', 1],
];
const fmt = (r) => r.toFixed(2).padStart(6);
for (const [f, b, use, need] of rows) {
  const r = ratio(P[f], P[b]);
  console.log(`${f.padEnd(11)} ${P[f]} on ${b.padEnd(11)} ${P[b]} ${fmt(r)} : 1  ${r >= need ? 'pass' : 'FAIL'} (${need === 1 ? 'n/a' : '≥ ' + need})  ${use}`);
}
// alpha rules on ink
const ruleInk = over('#F7F5F0', 0.28, P.ink), ruleStrongInk = over('#F7F5F0', 0.62, P.ink);
console.log('rule on ink (paper 28 %) =', ruleInk, fmt(ratio(ruleInk, P.ink)), '| rule-strong on ink (paper 62 %) =', ruleStrongInk, fmt(ratio(ruleStrongInk, P.ink)));
