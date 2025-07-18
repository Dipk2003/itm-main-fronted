import { Calendar, Download, ExternalLink, FileText } from 'lucide-react';

export default function PressSection() {
  const pressReleases = [
    {
      date: "2024-12-15",
      title: "Indian Trade Mart Raises $50M in Series B Funding to Expand B2B Operations",
      excerpt: "Leading B2B marketplace secures significant funding to accelerate growth and enhance technology platform across India.",
      category: "Funding",
      downloadLink: "#"
    },
    {
      date: "2024-11-28",
      title: "Indian Trade Mart Crosses 1 Million Product Listings Milestone",
      excerpt: "Platform achieves major milestone with over 1 million active product listings from verified suppliers nationwide.",
      category: "Company News",
      downloadLink: "#"
    },
    {
      date: "2024-10-20",
      title: "Indian Trade Mart Launches AI-Powered Supplier Matching System",
      excerpt: "New artificial intelligence technology helps buyers find the most suitable suppliers based on requirements and preferences.",
      category: "Product Launch",
      downloadLink: "#"
    },
    {
      date: "2024-09-15",
      title: "Indian Trade Mart Partners with MSME Development Foundation",
      excerpt: "Strategic partnership aimed at supporting small and medium enterprises with digital transformation and market access.",
      category: "Partnership",
      downloadLink: "#"
    },
    {
      date: "2024-08-10",
      title: "Indian Trade Mart Expands to 50+ Cities Across India",
      excerpt: "B2B marketplace extends its reach to tier-2 and tier-3 cities, connecting more businesses to the digital ecosystem.",
      category: "Expansion",
      downloadLink: "#"
    },
    {
      date: "2024-07-05",
      title: "Indian Trade Mart Wins 'Best B2B Platform' Award at Indian eCommerce Awards",
      excerpt: "Platform recognized for excellence in B2B commerce and innovation in connecting businesses across India.",
      category: "Awards",
      downloadLink: "#"
    }
  ];

  const mediaKit = [
    {
      name: "Company Logo Pack",
      description: "High-resolution logos in various formats",
      type: "ZIP",
      size: "2.5 MB"
    },
    {
      name: "Brand Guidelines",
      description: "Complete brand identity and usage guidelines",
      type: "PDF",
      size: "1.8 MB"
    },
    {
      name: "Product Screenshots",
      description: "High-quality screenshots of our platform",
      type: "ZIP",
      size: "8.2 MB"
    },
    {
      name: "Executive Photos",
      description: "Professional headshots of leadership team",
      type: "ZIP",
      size: "3.1 MB"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Active Sellers" },
    { value: "50,000+", label: "Registered Buyers" },
    { value: "1M+", label: "Product Listings" },
    { value: "₹500Cr+", label: "GMV Processed" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
 
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Press Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, announcements, and developments from Indian Trade Mart
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Press Releases */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Press Releases</h2>
            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Calendar className="text-gray-400 mr-2" size={16} />
                        <span className="text-sm text-gray-600">
                          {new Date(release.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {release.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{release.title}</h3>
                      <p className="text-gray-600 mb-4">{release.excerpt}</p>
                      <div className="flex space-x-4">
                        <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                          <ExternalLink size={16} className="mr-1" />
                          Read More
                        </a>
                        <a href={release.downloadLink} className="text-blue-600 hover:text-blue-800 flex items-center">
                          <Download size={16} className="mr-1" />
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Media Kit */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Media Kit</h3>
              <div className="space-y-4">
                {mediaKit.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{item.type}</span>
                          <span>{item.size}</span>
                        </div>
                      </div>
                      <button className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Press Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Press Contact</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">Media Relations</p>
                  <p className="text-sm text-gray-600">press@indiantrademart.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">+91 9876543210</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Response Time</p>
                  <p className="text-sm text-gray-600">Within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="space-y-2">
                <a href="#" className="block text-blue-600 hover:text-blue-800">LinkedIn</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Twitter</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Facebook</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">Instagram</a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-blue-600 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Press Newsletter</h3>
              <p className="text-blue-100 mb-4">Get the latest news and updates delivered to your inbox</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button className="w-full bg-white text-blue-600 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
