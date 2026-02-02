"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Startup / Core",
    annualPrice: 6000,
    companySize: "< 20 Employees",
    description: "Prove receipt + baseline understanding",
    bestFor: "Smaller orgs or first rollout",
    features: [
      "Content ingestion & distribution",
      "Policy acknowledgments",
      "Basic comprehension checks",
      "Standard reporting",
      "Email support"
    ],
    cta: "Get Started",
    highlighted: false
  },
  {
    name: "Growth",
    annualPrice: 15000,
    companySize: "20 – 100 Employees",
    description: "Verify understanding + manage remediation",
    bestFor: "Regulated teams, multi-department organizations",
    features: [
      "Everything in Startup / Core, plus:",
      "Role-based learning paths",
      "Scenario-based checks",
      "Remediation workflows",
      "Manager dashboards",
      "Advanced reporting"
    ],
    cta: "Get Started",
    highlighted: true
  },
  {
    name: "Scale / Enterprise",
    annualPrice: 35000,
    companySize: "100 – 500 Employees",
    description: "Assurance at scale + audit-grade evidence",
    bestFor: "Multi-site, highly regulated environments",
    features: [
      "Everything in Growth, plus:",
      "SSO / SAML integration",
      "Advanced analytics",
      "Custom attestation templates",
      "API access & data export",
      "Retention rules & admin controls",
      "Premium support"
    ],
    cta: "Contact Sales",
    highlighted: false
  }
];

const addOns = [
  {
    name: "ISO 27001",
    price: "+$5k–$10k"
  },
  {
    name: "HIPAA",
    price: "+$5k–$10k"
  }
];

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function getMonthlyPrice(annualPrice: number): number {
  // Monthly without discount = (annual * 1.1) / 12
  return Math.round((annualPrice * 1.1) / 12);
}

function getAnnualMonthlyPrice(annualPrice: number): number {
  // Monthly with annual discount = annual / 12 (rounded up for clean display)
  return Math.ceil(annualPrice / 12);
}

function getSavingsAmount(annualPrice: number): number {
  const monthlyPrice = getMonthlyPrice(annualPrice);
  const annualMonthlyPrice = Math.round(annualPrice / 12);
  return (monthlyPrice - annualMonthlyPrice) * 12;
}

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--text-main)] mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-[var(--text-main)]/70">
            Choose the plan that fits your organization.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-3 mb-12">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              !isAnnual
                ? "bg-[var(--color-ink)] text-white"
                : "bg-[var(--bg-surface)] text-[var(--text-main)]/60 hover:text-[var(--text-main)]"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              isAnnual
                ? "bg-[var(--color-ink)] text-white"
                : "bg-[var(--bg-surface)] text-[var(--text-main)]/60 hover:text-[var(--text-main)]"
            }`}
          >
            Annual
            {isAnnual && (
              <span className="bg-[var(--color-accent)] text-[var(--color-ink)] text-xs font-bold px-2 py-0.5 rounded-full">
                Save 10%
              </span>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 flex flex-col ${
                tier.highlighted
                  ? "bg-[var(--color-ink)] text-white ring-4 ring-[var(--color-accent)]"
                  : "bg-[var(--bg-surface)] border border-black/5"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-[var(--color-ink)] text-xs font-bold px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className={`font-display font-bold text-xl mb-2 ${tier.highlighted ? "text-white" : "text-[var(--text-main)]"}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm ${tier.highlighted ? "text-white/70" : "text-[var(--text-main)]/60"}`}>
                  {tier.description}
                </p>
              </div>

              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className={`font-display font-extrabold text-4xl ${tier.highlighted ? "text-white" : "text-[var(--text-main)]"}`}>
                    {isAnnual 
                      ? formatPrice(getAnnualMonthlyPrice(tier.annualPrice))
                      : formatPrice(getMonthlyPrice(tier.annualPrice))
                    }
                  </span>
                  <span className={`text-sm ${tier.highlighted ? "text-white/70" : "text-[var(--text-main)]/60"}`}>
                    per month
                  </span>
                </div>
                {isAnnual && (
                  <div className={`text-sm mt-1 ${tier.highlighted ? "text-[var(--color-accent)]" : "text-[var(--color-accent-2)]"}`}>
                    <span className="line-through opacity-60">{formatPrice(getMonthlyPrice(tier.annualPrice))}/mo</span>
                    <span className="ml-2 font-semibold">Save {formatPrice(getSavingsAmount(tier.annualPrice))}/year</span>
                  </div>
                )}
              </div>

              <div className={`text-sm font-semibold mb-6 ${tier.highlighted ? "text-white" : "text-[var(--text-main)]"}`}>
                {tier.companySize}
              </div>

              <div className={`text-xs font-medium mb-4 ${tier.highlighted ? "text-[var(--color-accent)]" : "text-[var(--color-accent-2)]"}`}>
                Best for: {tier.bestFor}
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.highlighted ? "text-[var(--color-accent)]" : "text-[var(--color-accent-2)]"}`} />
                    <span className={`text-sm ${tier.highlighted ? "text-white/90" : "text-[var(--text-main)]/80"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
                  tier.highlighted
                    ? "bg-[var(--color-accent)] text-[var(--color-ink)] hover:bg-[var(--color-accent)]/90"
                    : "bg-[var(--color-ink)] text-white hover:bg-black"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Add-ons section */}
        <div className="mt-12">
          <h3 className="font-display font-bold text-xl text-[var(--text-main)] text-center mb-6">
            Multi-Framework Add-ons
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {addOns.map((addon, i) => (
              <div
                key={i}
                className="relative bg-[var(--color-ink)] text-white rounded-2xl p-6 ring-4 ring-[var(--color-accent)] min-w-[200px]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Plus className="w-5 h-5 text-[var(--color-accent)]" />
                  <span className="font-display font-bold text-lg">{addon.name}</span>
                </div>
                <div className="font-display font-extrabold text-2xl text-[var(--color-accent)]">
                  {addon.price}
                </div>
                <p className="text-xs text-white/60 mt-2">per framework / year</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--text-main)]/60">
            All plans include onboarding support. Custom enterprise solutions available.{" "}
            <Link href="/contact" className="text-[var(--color-accent-2)] hover:underline">
              Contact us
            </Link>{" "}
            for details.
          </p>
        </div>
      </div>
    </section>
  );
}
