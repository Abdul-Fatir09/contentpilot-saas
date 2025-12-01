export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: December 1, 2025</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using ContentPilot ("the Service"), you accept and agree to be bound by the 
                terms and provisions of this agreement. If you do not agree to these terms, please do not use 
                the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                ContentPilot is an AI-powered content marketing platform that helps users generate, organize, 
                and manage content for various purposes including blog posts, social media, and marketing materials. 
                The Service uses Google Gemini AI technology to generate content based on user inputs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use our Service, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Be at least 18 years of age</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Subscription Plans</h2>
              <div className="bg-slate-50 rounded-lg p-6 my-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Plans:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li><strong>Free:</strong> 5 AI generations per day</li>
                  <li><strong>Starter ($19/month):</strong> 50 generations/day, basic analytics</li>
                  <li><strong>Pro ($49/month):</strong> Unlimited generations, advanced features</li>
                  <li><strong>Agency ($99/month):</strong> Team collaboration, priority support</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Subscriptions are billed monthly and automatically renew unless cancelled. You can upgrade, 
                downgrade, or cancel your subscription at any time from your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Payment and Refunds</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>All payments are processed securely through Paddle</li>
                <li>Prices are subject to change with 30 days notice</li>
                <li>Refunds are available within 7 days of initial purchase</li>
                <li>No refunds for partial month cancellations</li>
                <li>Failed payments may result in service suspension</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Acceptable Use Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree NOT to use the Service to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Generate illegal, harmful, or offensive content</li>
                <li>Violate intellectual property rights</li>
                <li>Spread misinformation or spam</li>
                <li>Harass, abuse, or harm others</li>
                <li>Attempt to reverse engineer or access our systems unauthorized</li>
                <li>Resell or redistribute generated content as a service</li>
                <li>Use automated tools to abuse the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Content Ownership</h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>Your Content:</strong> You retain all rights to content you create using our Service. 
                You are responsible for ensuring your use of AI-generated content complies with applicable laws 
                and does not infringe on third-party rights.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>Our Content:</strong> The Service, including its design, features, and underlying technology, 
                is owned by ContentPilot and protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. AI-Generated Content</h2>
              <p className="text-gray-700 leading-relaxed">
                AI-generated content is provided "as is" and should be reviewed and edited before publication. 
                We do not guarantee accuracy, originality, or suitability for any specific purpose. You are 
                responsible for fact-checking and ensuring compliance with applicable regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Service Availability</h2>
              <p className="text-gray-700 leading-relaxed">
                We strive to provide 99.9% uptime but do not guarantee uninterrupted access. We may perform 
                maintenance, updates, or modifications at any time. We are not liable for any downtime or 
                service interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account if you violate these terms. Upon 
                termination, your right to use the Service will immediately cease. You may delete your account 
                at any time from your settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, ContentPilot shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
                whether incurred directly or indirectly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We may modify these terms at any time. We will notify users of significant changes via email 
                or through the Service. Continued use of the Service after changes constitutes acceptance of 
                the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-gray-700"><strong>Email:</strong> legal@contentpilot.dev</p>
                <p className="text-gray-700"><strong>Website:</strong> contentpilot.vercel.app</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <a
              href="/"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
