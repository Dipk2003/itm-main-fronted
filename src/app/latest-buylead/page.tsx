import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Search, Filter, Clock, MapPin, Package, User, Star, Phone, Mail } from 'lucide-react';

const LatestBuyLeadPage = () => {
  const buyLeads = [
    {
      id: 1,
      title: "Industrial Grade Steel Pipes Required",
      company: "ABC Construction Ltd",
      location: "Mumbai, Maharashtra",
      category: "Steel & Metal",
      quantity: "500 Tons",
      budget: "₹50,00,000 - ₹75,00,000",
      timePosted: "2 hours ago",
      validTill: "15 days",
      description: "Looking for high-quality industrial grade steel pipes for construction project. Requirements include various sizes and specifications.",
      requirements: [
        "Grade: IS 3589 or equivalent",
        "Size: 100mm to 300mm diameter",
        "Length: 6-12 meters",
        "Certification: ISI marked"
      ],
      buyerRating: 4.5,
      verified: true
    },
    {
      id: 2,
      title: "Organic Cotton Fabric Bulk Order",
      company: "Fashion Forward Textiles",
      location: "Bangalore, Karnataka",
      category: "Textiles",
      quantity: "10,000 Meters",
      budget: "₹15,00,000 - ₹20,00,000",
      timePosted: "5 hours ago",
      validTill: "12 days",
      description: "Seeking suppliers for organic cotton fabric for our sustainable clothing line. Quality and certifications are priority.",
      requirements: [
        "100% Organic Cotton",
        "GOTS Certified",
        "Width: 58-60 inches",
        "GSM: 180-220"
      ],
      buyerRating: 4.8,
      verified: true
    },
    {
      id: 3,
      title: "Electronic Components for LED Manufacturing",
      company: "BrightLight Electronics",
      location: "Pune, Maharashtra",
      category: "Electronics",
      quantity: "Bulk Order",
      budget: "₹25,00,000 - ₹30,00,000",
      timePosted: "1 day ago",
      validTill: "20 days",
      description: "Required electronic components for LED light manufacturing. Long-term partnership opportunity for reliable suppliers.",
      requirements: [
        "LED Chips: High efficiency",
        "Drivers: 12V and 24V",
        "Heat Sinks: Aluminum",
        "PCB Boards: Custom designs"
      ],
      buyerRating: 4.3,
      verified: true
    },
    {
      id: 4,
      title: "Food Grade Packaging Materials",
      company: "Fresh Foods Packaging",
      location: "Delhi, NCR",
      category: "Packaging",
      quantity: "Monthly Order",
      budget: "₹8,00,000 - ₹12,00,000",
      timePosted: "1 day ago",
      validTill: "10 days",
      description: "Looking for food-grade packaging materials for our food processing unit. Regular monthly orders expected.",
      requirements: [
        "Food Grade Certified",
        "Biodegradable options preferred",
        "Various sizes available",
        "Bulk supply capability"
      ],
      buyerRating: 4.6,
      verified: true
    },
    {
      id: 5,
      title: "Pharmaceutical Raw Materials",
      company: "MedCore Pharmaceuticals",
      location: "Hyderabad, Telangana",
      category: "Pharmaceuticals",
      quantity: "As per specification",
      budget: "₹40,00,000 - ₹60,00,000",
      timePosted: "2 days ago",
      validTill: "25 days",
      description: "Seeking reliable suppliers for pharmaceutical raw materials. All materials must meet regulatory standards.",
      requirements: [
        "WHO GMP Certified",
        "COA Required",
        "Regulatory compliance",
        "Timely delivery"
      ],
      buyerRating: 4.7,
      verified: true
    },
    {
      id: 6,
      title: "Solar Panel Installation Equipment",
      company: "GreenTech Solar Solutions",
      location: "Jaipur, Rajasthan",
      category: "Solar Equipment",
      quantity: "Complete Setup",
      budget: "₹35,00,000 - ₹50,00,000",
      timePosted: "3 days ago",
      validTill: "18 days",
      description: "Required solar panel installation equipment for residential and commercial projects across Rajasthan.",
      requirements: [
        "Monocrystalline panels",
        "Inverters: 5kW to 50kW",
        "Mounting structures",
        "Installation support"
      ],
      buyerRating: 4.4,
      verified: true
    }
  ];

  const categories = [
    "All Categories",
    "Steel & Metal",
    "Textiles",
    "Electronics",
    "Packaging",
    "Pharmaceuticals",
    "Solar Equipment",
    "Machinery",
    "Chemicals",
    "Agriculture"
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Buy Leads</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover fresh business opportunities with verified buyer requirements from across India
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search buy leads..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Locations</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bangalore</option>
              <option>Pune</option>
              <option>Hyderabad</option>
            </select>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Filter className="mr-2" size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">250+</div>
            <div className="text-sm text-gray-600">Active Buy Leads</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">50+</div>
            <div className="text-sm text-gray-600">New Today</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600">₹500Cr+</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-orange-600">15+</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>

        {/* Buy Leads List */}
        <div className="space-y-6">
          {buyLeads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 mr-3">{lead.title}</h3>
                    {lead.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <User className="mr-2" size={16} />
                    <span className="font-medium">{lead.company}</span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <Star className="text-yellow-500 mr-1" size={14} />
                      <span>{lead.buyerRating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="mr-2" size={16} />
                    <span>{lead.location}</span>
                    <span className="mx-2">•</span>
                    <Package className="mr-2" size={16} />
                    <span>{lead.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600 mb-1">{lead.budget}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="mr-1" size={14} />
                    {lead.timePosted}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{lead.description}</p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {lead.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Quantity:</strong> {lead.quantity}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Valid Till:</strong> {lead.validTill}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  <Mail className="mr-2" size={16} />
                  Send Quotation
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                  <Phone className="mr-2" size={16} />
                  Contact Buyer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <nav className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
          </nav>
        </div>
      </main>

    </div>
  );
};

export default LatestBuyLeadPage;
