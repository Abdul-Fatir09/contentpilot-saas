export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: December 1, 2025</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to ContentPilot. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our 
                website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect and process the following types of information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Account Information:</strong> Name, email address, password (encrypted)</li>
                <li><strong>Profile Data:</strong> Bio, company name, website URL</li>
                <li><strong>Content Data:</strong> Generated content, folders, brand profiles</li>
                <li><strong>Usage Data:</strong> How you use our service, features accessed, time spent</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                <li><strong>Payment Data:</strong> Processed securely through Paddle (we don't store card details)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>To provide and maintain our AI content generation service</li>
                <li>To personalize your experience and improve our service</li>
                <li>To process your payments and manage subscriptions</li>
                <li>To send you important updates and notifications</li>
                <li>To provide customer support</li>
                <li>To analyze usage patterns and improve our platform</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
                <li>Encrypted data transmission (SSL/TLS)</li>
                <li>Secure password hashing (bcrypt)</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Database hosted on secure Supabase infrastructure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Google Gemini AI:</strong> For content generation</li>
                <li><strong>Supabase:</strong> For database hosting</li>
                <li><strong>Vercel:</strong> For application hosting</li>
                <li><strong>Paddle:</strong> For payment processing</li>
                <li><strong>Google OAuth:</strong> For authentication (optional)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under data protection laws, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal data only for as long as necessary to provide our services and comply 
                with legal obligations. When you delete your account, we will delete or anonymize your personal 
                data within 30 days, unless we are required to retain it by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                We use essential cookies to maintain your session and remember your preferences. We do not use 
                tracking or advertising cookies. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this privacy policy or our data practices, please contact us at:
              </p>
              <div className="bg-slate-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700"><strong>Email:</strong> privacy@contentpilot.dev</p>
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
