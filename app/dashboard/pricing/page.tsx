'use client';

import { Check, Sparkles, Zap, Crown, Rocket } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ToastContainer';

export default function PricingPage() {
  const toast = useToast();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for trying out ContentPilot',
      icon: Sparkles,
      gradient: 'from-gray-500 to-gray-600',
      features: [
        '5 AI generations per day',
        'Basic content types',
        '1 social media account',
        'Email support',
        'Basic analytics',
      ],
      limitations: [
        'No A/B testing',
        'No team collaboration',
        'Limited templates',
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      name: 'Starter',
      price: { monthly: 29, annual: 290 },
      description: 'Great for solo content creators',
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-600',
      features: [
        '100 AI generations per day',
        'All content types',
        '5 social media accounts',
        'Priority email support',
        'Advanced analytics',
        'Content calendar',
        'SEO optimization',
        '50+ templates',
      ],
      limitations: [
        'No A/B testing',
        'No team collaboration',
      ],
      cta: 'Upgrade to Starter',
      popular: false,
    },
    {
      name: 'Professional',
      price: { monthly: 79, annual: 790 },
      description: 'Perfect for growing businesses',
      icon: Crown,
      gradient: 'from-purple-500 to-pink-600',
      features: [
        'Unlimited AI generations',
        'All content types',
        'Unlimited social accounts',
        '24/7 priority support',
        'Advanced analytics & reports',
        'Content calendar',
        'SEO optimization',
        'Unlimited templates',
        'A/B testing',
        'Brand voice training',
        'Team collaboration (5 members)',
        'API access',
      ],
      limitations: [],
      cta: 'Upgrade to Professional',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: { monthly: 199, annual: 1990 },
      description: 'For large teams and agencies',
      icon: Rocket,
      gradient: 'from-indigo-600 to-purple-600',
      features: [
        'Everything in Professional',
        'Unlimited team members',
        'Dedicated account manager',
        'Custom AI model training',
        'White-label options',
        'Advanced API access',
        'Custom integrations',
        'SLA guarantee',
        'Onboarding & training',
        'Custom contracts',
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const handleUpgrade = (planName: string) => {
    if (planName === 'Free') {
      toast.info('You are currently on the Free plan');
    } else if (planName === 'Enterprise') {
      toast.info('Contact our sales team at sales@contentpilot.com for Enterprise pricing');
    } else {
      toast.success(`Upgrade to ${planName} plan - Payment integration coming soon!`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Choose Your Plan</h1>
        <p className="text-gray-600 text-lg mb-6">
          Upgrade to unlock more features and grow your content strategy
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              billingPeriod === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              billingPeriod === 'annual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Annual
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = plan.price[billingPeriod];
          const savings = billingPeriod === 'annual' && plan.price.monthly > 0
            ? (plan.price.monthly * 12 - plan.price.annual)
            : 0;

          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-white border-2 transition-all hover:shadow-2xl ${
                plan.popular
                  ? 'border-purple-500 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ⭐ Most Popular
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.gradient} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-gray-600">
                      /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  {savings > 0 && (
                    <p className="text-sm text-green-600 font-semibold mt-1">
                      Save ${savings}/year
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(plan.name)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all cursor-pointer mb-6 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
                      : plan.name === 'Free'
                      ? 'bg-gray-100 text-gray-600 cursor-default'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Features */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900 mb-2">What's included:</p>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <>
                      <div className="border-t pt-3 mt-3">
                        <p className="text-sm font-semibold text-gray-500 mb-2">Not included:</p>
                      </div>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                          </div>
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
            <p className="text-gray-600 text-sm">
              Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600 text-sm">
              We accept all major credit cards, PayPal, and can arrange invoicing for Enterprise customers.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
            <p className="text-gray-600 text-sm">
              Our Free plan lets you try ContentPilot with 5 generations per day. No credit card required!
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What happens if I exceed my limit?</h3>
            <p className="text-gray-600 text-sm">
              You'll be notified when approaching your limit. You can upgrade anytime or wait until your limit resets.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
        <h2 className="text-2xl font-bold mb-3">Need a custom plan?</h2>
        <p className="text-gray-600 mb-6">
          Contact our sales team for custom pricing, volume discounts, or special requirements.
        </p>
        <button
          onClick={() => alert('Contact sales@contentpilot.com or call +1 (555) 123-4567')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all cursor-pointer"
        >
          <Rocket className="w-5 h-5" />
          Contact Sales
        </button>
      </div>
    </div>
  );
}
