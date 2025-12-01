import Link from "next/link";
import { Zap, Target, TrendingUp, Users, Sparkles, Rocket, BarChart3 } from "lucide-react";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm bg-white/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">ContentPilot</span>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <Link 
                  href="/dashboard" 
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 btn-glow"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    href="/auth/signin" 
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 btn-glow"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32 text-center relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-200 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">Powered by GPT-4</span>
          </div>
          
          <h1 className="mb-6 text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            AI-Powered Content
            <br />
            <span className="gradient-text">Made Simple</span>
          </h1>
          
          <p className="mb-10 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Generate high-quality blog posts, social media content, and ad copy in seconds.
            Schedule, publish, and track performance—all in one beautiful platform.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/auth/signup" 
              className="group rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 btn-glow inline-flex items-center gap-2"
            >
              Get Started
              <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#features" 
              className="rounded-full border-2 border-indigo-600 px-8 py-4 text-lg font-semibold text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
            >
              See Features
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { label: "Content Generated", value: "10M+" },
              { label: "Active Users", value: "50K+" },
              { label: "Time Saved", value: "100K+ hrs" },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl">
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24 bg-white rounded-3xl shadow-2xl -mt-16 relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to supercharge your content marketing
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Zap className="h-10 w-10" />,
              title: "AI Content Generation",
              description: "Create blog posts, social media content, and ad copy with GPT-4",
              color: "from-indigo-500 to-purple-600",
              bgColor: "bg-indigo-50",
            },
            {
              icon: <Target className="h-10 w-10" />,
              title: "Multi-Platform Publishing",
              description: "Schedule and publish to Twitter, LinkedIn, Facebook, and Instagram",
              color: "from-purple-500 to-pink-600",
              bgColor: "bg-purple-50",
            },
            {
              icon: <TrendingUp className="h-10 w-10" />,
              title: "Performance Analytics",
              description: "Track engagement, reach, and ROI across all platforms",
              color: "from-blue-500 to-cyan-600",
              bgColor: "bg-blue-50",
            },
            {
              icon: <Users className="h-10 w-10" />,
              title: "Team Collaboration",
              description: "Work together with your team on content creation and approval",
              color: "from-green-500 to-teal-600",
              bgColor: "bg-green-50",
            },
          ].map((feature, index) => (
            <div key={index} className="group card-hover rounded-2xl bg-white p-8 border border-gray-100 shadow-lg hover:border-indigo-200 transition-all duration-300">
              <div className={`mb-6 p-4 rounded-xl ${feature.bgColor} inline-block`}>
                <div className={`bg-gradient-to-br ${feature.color} text-white p-3 rounded-lg`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your business
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: ["5 AI generations/day", "1 social platform", "Basic templates"],
                cta: "Start Free",
                gradient: "from-gray-400 to-gray-600",
              },
              {
                name: "Starter",
                price: "$15",
                period: "/month",
                features: ["50 generations/day", "3 platforms", "Basic analytics"],
                cta: "Get Started",
                gradient: "from-blue-500 to-cyan-600",
              },
              {
                name: "Pro",
                price: "$39",
                period: "/month",
                features: ["Unlimited generations", "All platforms", "Full analytics", "A/B testing"],
                popular: true,
                cta: "Start Pro",
                gradient: "from-indigo-600 to-purple-600",
              },
              {
                name: "Agency",
                price: "$79",
                period: "/month",
                features: ["Everything in Pro", "Multiple brands", "Team collaboration", "API access"],
                cta: "Go Agency",
                gradient: "from-purple-600 to-pink-600",
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`group relative rounded-3xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl card-hover ${
                  plan.popular ? "ring-2 ring-indigo-600 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                      <div className={`p-1 rounded-full bg-gradient-to-br ${plan.gradient}`}>
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link
                  href="/auth/signin?callbackUrl=/dashboard/pricing"
                  className={`block rounded-full px-6 py-3 text-center font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/50 btn-glow"
                      : "border-2 border-gray-300 text-gray-900 hover:border-indigo-600 hover:text-indigo-600"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 py-12 text-white border-t border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">ContentPilot</span>
            </div>
            <p className="text-gray-400">&copy; 2025 ContentPilot. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
