// Shared helpers for mockups-v3 restyle concepts.
// Real data comes from ../../site/explorer-data.js (window.COA_EXPLORER).
window.V3 = (() => {
  "use strict";
  const D = window.COA_EXPLORER;
  if (!D) throw new Error("explorer-data.js not loaded");
  const esc = v => String(v ?? "").replace(/[&<>'"]/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[c]);
  const ORD = { "low": 1, "low-moderate": 2, "moderate": 3, "moderate-high": 4, "high": 5 };
  const AXES = {
    core_actions: "Core actions", state_tracking: "State tracking", sequencing: "Sequencing",
    reactive_decisions: "Reactive decisions", execution: "Execution", failure_cost: "Failure cost",
  };
  const spec = id => D.specs.find(s => s.id === id);
  const family = id => D.families.find(f => f.id === id);
  const inFamily = famId => D.specs.filter(s => s.atlas === famId);
  const cx = (s, axis, ctx = "boss") => (s.complexity[axis] || {})[ctx] || null;
  return { D, esc, ORD, AXES, spec, family, inFamily, cx };
})();
