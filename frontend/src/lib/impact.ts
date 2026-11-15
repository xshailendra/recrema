// Emission factors applied to approved coffee-waste quantities (kg).
// Shared by the public Insights page and the partner portal so both stay in sync.
export const methaneFactor = 0.072; // kg CH₄ averted per kg of waste upcycled
export const co2eFactor = 2.016; // kg CO₂e avoided per kg of waste upcycled

export const impactNumberFormat = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });
