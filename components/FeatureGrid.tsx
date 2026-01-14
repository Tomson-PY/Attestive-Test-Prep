import { CheckCircle2, Brain, BarChart3 } from "lucide-react";

const features = [
  {
    icon: CheckCircle2,
    title: "Verifiable Comprehension",
    description: "Produce audit-grade proof that people understood—not just opened—your policies. Defensible evidence for regulators, auditors, and incident review."
  },
  {
    icon: Brain,
    title: "AI-Powered Explanation",
    description: "Personalized, plain-language explanations tailored by role, department, and context. Make complex policies accessible to everyone."
  },
  {
    icon: BarChart3,
    title: "Risk Intelligence",
    description: "Identify which teams misunderstand what, where confusion clusters, and what remediation actually works. Act before incidents happen."
  }
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-24 bg-white relative z-20">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--text-main)] mb-4">
            From Policy to Proven Understanding
          </h2>
          <p className="text-lg text-[var(--text-main)]/70">
            Close the gap between "I saw it" and "I can do it" with AI-powered verification.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-black/5 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-[var(--color-accent)]" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-[var(--text-main)]">{feature.title}</h3>
              <p className="text-[var(--text-main)]/70 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
