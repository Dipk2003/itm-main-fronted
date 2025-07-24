export default function JoinSales() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <main className="flex-grow max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Join Our Sales Team</h1>
          <p className="text-lg text-gray-700 mb-6">
            Become part of our dynamic sales team and help connect businesses across India with cutting-edge solutions.
          </p>

          <div className="bg-blue-600 text-white rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold">Why Join Us?</h2>
            <ul className="list-disc list-inside space-y-2 text-blue-100 text-left mt-4">
              <li>Competitive salary and benefits</li>
              <li>Opportunities for career growth</li>
              <li>Collaborative and inclusive culture</li>
              <li>Access to top-tier technologies</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Apply</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-4 text-left">
              <li>
                Send your resume to{' '}
                <a href="mailto:careers@indiantrademart.com" className="text-blue-600 hover:underline">
                  careers@indiantrademart.com
                </a>
              </li>
              <li>
                Include a cover letter detailing your sales experience and what you can bring to our team.
              </li>
              <li>
                Our HR team will review your application and contact selected candidates for interviews.
              </li>
            </ol>
          </div>

          <div className="mt-10 text-center">
            <a
              href="/contact-us"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Contact HR
            </a>
          </div>
        </div>
      </main>

    </div>
  );
}
