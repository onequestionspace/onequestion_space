'use client';

import { Card, CardContent } from '@/components/ui/Card';
import {
  User,
  Upload,
  Bot,
  Link,
  BarChart3,
  Settings,
} from 'lucide-react';

const FEATURES = [
  {
    title: "Claim Your Username",
    description: "Get your own space at onequestion.space/yourname",
    icon: User,
  },
  {
    title: "Knowledge Upload",
    description: "Upload documents your AI will learn from.",
    icon: Upload,
  },
  {
    title: "AI-Powered Answers",
    description: "AI responds using your uploaded knowledge.",
    icon: Bot,
  },
  {
    title: "Shareable Public Page",
    description: "A public page anyone can visit anytime.",
    icon: Link,
  },
  {
    title: "Analytics Dashboard",
    description: "Track visitors, questions, and engagement.",
    icon: BarChart3,
  },
  {
    title: "Space Management",
    description: "Manage everything in one place.",
    icon: Settings,
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-24">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight">
            Features
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Everything you need to build your AI-powered space
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <Card
                key={i}
                className="
                  group
                  hover:shadow-lg
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                  border-border/50
                "
              >
                <CardContent className="p-6">

                  {/* Icon container */}
                  <div className="mb-5">
                    <div className="
                      w-12 h-12
                      rounded-xl
                      bg-primary/10
                      flex items-center justify-center
                      group-hover:bg-primary/20
                      transition
                    ">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}
