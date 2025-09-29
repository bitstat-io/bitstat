import { AlertTriangle, Target, BarChart3, Shield } from "lucide-react";

export default function About() {
  return (
    <section className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            The Web3 Game Development Data Problem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Game developers struggle with fragmented analytics, poor user
            insights, and lack of actionable data to optimize their Web3 games
            for growth and retention.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          {/* Problem Side */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold">Current Challenges</h3>
            </div>

            <div className="space-y-4">
              <ProblemCard
                title="Fragmented Analytics"
                description="User data scattered across multiple platforms with no unified view of player behavior"
              />
              <ProblemCard
                title="Poor User Insights"
                description="Limited understanding of player retention, churn patterns, and engagement metrics"
              />
              <ProblemCard
                title="Manual Data Collection"
                description="Hours spent manually gathering and analyzing data from different sources"
              />
              <ProblemCard
                title="No Revenue Intelligence"
                description="Lack of actionable insights to optimize monetization and increase player lifetime value"
              />
            </div>
          </div>

          {/* Solution Side */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">GameVault Solution</h3>
            </div>

            <div className="space-y-4">
              <SolutionCard
                title="Unified Analytics Dashboard"
                description="Complete view of user behavior, retention, and revenue metrics in one platform"
                icon={<BarChart3 className="w-5 h-5" />}
              />
              <SolutionCard
                title="Advanced User Intelligence"
                description="Deep insights into player journeys, cohort analysis, and predictive churn modeling"
                icon={<Target className="w-5 h-5" />}
              />
              <SolutionCard
                title="Automated Data Pipeline"
                description="Real-time data collection and processing with seamless integration APIs"
                icon={<Shield className="w-5 h-5" />}
              />
              <SolutionCard
                title="Revenue Optimization"
                description="AI-powered recommendations to increase monetization and player lifetime value"
                icon={<BarChart3 className="w-5 h-5" />}
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">The Result</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-primary mb-2">40%</div>
              <div className="text-muted-foreground">
                Improved User Retention
              </div>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-primary mb-2">2.5x</div>
              <div className="text-muted-foreground">Revenue Growth</div>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <div className="text-muted-foreground">Faster Data Insights</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
      <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
      <div>
        <h4 className="font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function SolutionCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
      <div className="p-1 rounded bg-primary/10 text-primary flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
