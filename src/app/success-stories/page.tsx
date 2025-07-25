
import { Star, Users, TrendingUp, Award } from 'lucide-react';

export default function SuccessStories() {
  const stories = [
    {
      company: "TechCorp Solutions",
      category: "Technology",
      story: "Increased sales by 300% within 6 months of joining Indian Trade Mart",
      testimonial: "Indian Trade Mart transformed our business. We connected with buyers across India and expanded our market reach significantly.",
      author: "Rajesh Kumar",
      position: "CEO, TechCorp Solutions",
      growth: "300%",
      metric: "Sales Growth"
    },
    {
      company: "GreenTech Industries",
      category: "Manufacturing",
      story: "Found 50+ verified suppliers and reduced procurement costs by 25%",
      testimonial: "The platform helped us streamline our supply chain and find reliable partners. The verification process gives us confidence in our suppliers.",
      author: "Priya Sharma",
      position: "Procurement Manager",
      growth: "25%",
      metric: "Cost Reduction"
    },
    {
      company: "Fashion Forward",
      category: "Textiles",
      story: "Expanded to 15 new cities and doubled customer base",
      testimonial: "As a small textile business, we struggled to find buyers. Indian Trade Mart connected us with retailers nationwide.",
      author: "Amit Patel",
      position: "Founder",
      growth: "200%",
      metric: "Customer Growth"
    },
    {
      company: "AutoParts Plus",
      category: "Automotive",
      story: "Reduced order processing time by 60% with streamlined operations",
      testimonial: "The platform's tools helped us automate our processes and respond to customer inquiries faster than ever.",
      author: "Sunita Mehta",
      position: "Operations Head",
      growth: "60%",
      metric: "Efficiency Gain"
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Customers" },
    { icon: TrendingUp, value: "₹500Cr+", label: "Total GMV" },
    { icon: Award, value: "95%", label: "Success Rate" },
    { icon: Star, value: "4.8/5", label: "Customer Rating" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how businesses across India are growing and thriving with Indian Trade Mart
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <stat.icon className="mx-auto text-blue-600 mb-3" size={32} />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <div className="space-y-8">
          {stories.map((story, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                  <div className="lg:w-1/3 mb-6 lg:mb-0">
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{story.growth}</div>
                      <div className="text-sm text-gray-600">{story.metric}</div>
                    </div>
                  </div>
                  
                  <div className="lg:w-2/3">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{story.company}</h3>
                      <p className="text-blue-600 font-medium">{story.category}</p>
                    </div>
                    
                    <p className="text-lg text-gray-700 mb-6 font-medium">{story.story}</p>
                    
                    <blockquote className="border-l-4 border-blue-500 pl-6 mb-6">
                      <p className="text-gray-700 italic mb-4">"{story.testimonial}"</p>
                      <footer className="text-sm text-gray-600">
                        <strong>{story.author}</strong> - {story.position}
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses that have transformed their operations with Indian Trade Mart
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/vendor/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Start Selling
            </a>
            <a
              href="/auth/user/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              Start Buying
            </a>
          </div>
        </div>
      </main>

    </div>
  );
}
