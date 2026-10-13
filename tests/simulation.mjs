import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync(new URL('../particle-dashboard.html', import.meta.url), 'utf8');
const elements = new Map();
const ctx = new Proxy({}, { get(target, key) {
  if (key === 'createRadialGradient') return () => ({ addColorStop() {} });
  return target[key] ?? (() => {});
} });
function element(id) {
  if (!elements.has(id)) elements.set(id, { value: 500, textContent: '', innerHTML: '',
    addEventListener() {}, setAttribute() {}, getContext: () => ctx, classList: { add() {}, remove() {} } });
  return elements.get(id);
}
const sandbox = vm.createContext({
  document: { getElementById: element, querySelectorAll: () => [] },
  window: { innerWidth: 800, innerHeight: 600, addEventListener() {} },
  performance: { now: () => 0 }, requestAnimationFrame() {}
});
vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], sandbox);
const evaluate = (code) => vm.runInContext(code, sandbox);
element('rCount').value = '50';
element('rCount').oninput();
assert.equal(evaluate('update().count'), 50, 'lowering the slider must reach the selected count');
element('rCount').value = '200';
element('rCount').oninput();
assert.equal(evaluate('update().count'), 200);
evaluate(`particles = [createParticle(0, 0, 0, 0), createParticle(10, 0, 0, 0), createParticle(500, 500, 0, 0)];
  stats = { count: 3, totalSpeed: 0, connections: 0 }; draw(stats);`);
assert.equal(evaluate('stats.connections'), 1, 'readout counts each nearby pair once');
evaluate('updateEntropy(); updateStats();');
assert.equal(element('sConn').textContent, 1);
assert.ok(Number.isFinite(Number(element('sEntropy').textContent)));
evaluate('spawnBurst(100, 100, 40);');
assert.equal(evaluate('particles.length'), 43, 'bursts remain visible alongside the selected base count');
console.log('PASS count decrease/increase, pair count/readout, entropy, burst');
