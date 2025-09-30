import {
  IconBinaryTree2,
  IconBrain,
  IconDatabase,
  IconMoneybag,
  IconUserCheck,
  IconZoomCheck,
} from "@tabler/icons-react";
import {
  FeatureCard,
  FeatureType,
} from "@workspace/ui/components/feature-card";
import { Zap } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="pt-16">
      {/* CTA Section */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          Integrate in under 10 minutes
        </div>
      </div>
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance font-mono">
          Powerful Analytics
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
          Comprehensive analytics tools designed to optimize user experience,
          retention, and revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 divide-x divide-y divide-dashed border-y border-dashed sm:grid-cols-2 md:grid-cols-3">
        {features.map((feature, i) => (
          <FeatureCard key={i} feature={feature} />
        ))}
      </div>
    </section>
  );
}

const features: FeatureType[] = [
  {
    title: "User Acquisition Analytics",
    description:
      "Deep insights into player acquisition channels, conversion rates, and user journey optimization.",
    features: [
      "Acquisition funnels",
      "Conversion tracking",
      "Channel attribution",
      "Campaign ROI analysis",
    ],
    icon: IconUserCheck,
  },
  {
    title: "Retention & Engagement",
    description:
      "Understand player behavior patterns and optimize for long-term engagement and retention.",
    features: [
      "Cohort analysis",
      "Churn prediction",
      "Engagement heatmaps",
      "Session analytics",
    ],
    icon: IconZoomCheck,
  },
  {
    title: "Revenue Intelligence",
    description:
      "Comprehensive revenue analytics with predictive modeling and monetization optimization.",
    features: [
      "Revenue forecasting",
      "LTV analysis",
      "Pricing optimization",
      "Monetization insights",
    ],
    icon: IconMoneybag,
  },
  {
    title: "AI-Powered Insights",
    description:
      "Machine learning algorithms that identify patterns and provide actionable recommendations.",
    features: [
      "Predictive analytics",
      "Anomaly detection",
      "Smart recommendations",
      "Trend analysis",
    ],
    icon: IconBrain,
  },
  {
    title: "Real-Time Data Pipeline",
    description:
      "Seamless data collection and processing with enterprise-grade reliability and security.",
    features: [
      "Real-time streaming",
      "Custom events",
      "Data warehousing",
      "API integrations",
    ],
    icon: IconDatabase,
  },
  {
    title: "Advanced Segmentation",
    description:
      "Powerful user segmentation tools to understand different player cohorts and behaviors.",
    features: [
      "Dynamic segments",
      "Behavioral clustering",
      "Custom attributes",
      "A/B testing",
    ],
    icon: IconBinaryTree2,
  },
];
