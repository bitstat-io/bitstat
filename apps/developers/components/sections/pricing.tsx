"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Check, X } from "lucide-react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",

      description: "Perfect for indie developers and small studios",
      monthlyPrice: 49,
      annualPrice: 490,
      features: [
        "Up to 10K monthly active users",
        "Core analytics dashboard",
        "Basic retention metrics",
        "Email support",
        "Standard integrations",
        "7-day data retention",
      ],
      limitations: [
        "Advanced AI insights",
        "Custom dashboards",
        "Team collaboration",
        "Priority support",
      ],
      popular: false,
      cta: "Start Free Trial",
    },
    {
      name: "Professional",

      description: "For growing studios with advanced analytics",
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        "Up to 100K monthly active users",
        "Advanced analytics & AI insights",
        "Custom dashboard builder",
        "Cohort & retention analysis",
        "Revenue optimization tools",
        "A/B testing framework",
        "Priority support",
        "API access (10K calls/month)",
        "90-day data retention",
      ],
      limitations: ["White-label reports", "Dedicated account manager"],
      popular: true,
      cta: "Start Pro Trial",
    },
    {
      name: "Enterprise",

      description: "Complete analytics suite for large game studios",
      monthlyPrice: 499,
      annualPrice: 4990,
      features: [
        "Unlimited monthly active users",
        "Everything in Professional",
        "AI-powered predictive analytics",
        "Team collaboration tools",
        "White-label reports",
        "Custom integrations",
        "Unlimited API access",
        "Dedicated account manager",
        "SLA guarantee (99.9% uptime)",
        "Unlimited data retention",
        "SOC2 compliance",
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="py-16 border-t mt-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty mb-8">
          Choose the perfect plan for your game development needs. Scale as your
          player base grows.
        </p>

        {/* Annual/Monthly Toggle */}
        <div className="inline-flex items-center gap-4 p-1 rounded-full bg-muted">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !isAnnual
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isAnnual
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Annual
            <span className="ml-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative p-8 rounded-none ${
              plan.popular
                ? "border border-primary bg-gradient-card"
                : "border-0 border-y"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
            )}

            <div className="text-center mb-8 space-y-4">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">
                {plan.description}
              </p>

              <div className="mb-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold">
                    $
                    {isAnnual
                      ? Math.floor(plan.annualPrice / 12)
                      : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {isAnnual && plan.annualPrice > 0 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Billed annually (${plan.annualPrice}/year)
                  </div>
                )}
              </div>

              <Button
                size="lg"
                className={`w-full ${plan.popular ? "gradient-primary" : ""}`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">What&apos;s included:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.limitations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-muted-foreground">
                    Not included:
                  </h4>
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <li
                        key={limitationIndex}
                        className="flex items-center gap-3"
                      >
                        <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {limitation}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
