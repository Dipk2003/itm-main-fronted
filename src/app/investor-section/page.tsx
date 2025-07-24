import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { TrendingUp, Calendar, FileText, Download, DollarSign, Users, BarChart3 } from 'lucide-react';

export default function InvestorSection() {
  const financialHighlights = [
    { metric: "Revenue", value: "₹250 Cr", growth: "+45%" },
    { metric: "GMV", value: "₹500 Cr", growth: "+65%" },
    { metric: "Active Users", value: "60,000+", growth: "+40%" },
    { metric: "Market Cap", value: "₹2,500 Cr", growth: "+30%" }
  ];

  const reports = [
    {
      title: "Q3 2024 Financial Results",
      date: "2024-12-15",
      type: "Quarterly Report",
      format: "PDF",
      size: "2.1 MB"
    },
    {
      title: "Annual Report 2024",
      date: "2024-12-01",
      type: "Annual Report",
      format: "PDF",
      size: "5.8 MB"
    },
    {
      title: "Q2 2024 Earnings Call Transcript",
      date: "2024-09-15",
      type: "Earnings Call",
      format: "PDF",
      size: "1.2 MB"
    },
    {
      title: "Investor Presentation Q2 2024",
      date: "2024-09-10",
      type: "Presentation",
      format: "PDF",
      size: "3.4 MB"
    }
  ];

  const upcomingEvents = [
    {
      title: "Q4 2024 Earnings Call",
      date: "2025-01-20",
      time: "4:00 PM IST",
      type: "Earnings Call"
    },
    {
      title: "Annual Investor Meet",
      date: "2025-02-15",
      time: "10:00 AM IST",
      type: "Annual Meeting"
    },
    {
      title: "Technology Showcase",
      date: "2025-03-10",
      time: "2:00 PM IST",
      type: "Product Demo"
    }
  ];

  const keyMetrics = [
    {
      icon: TrendingUp,
      title: "Revenue Growth",
      value: "45%",
      description: "Year-over-year revenue growth"
    },
    {
      icon: Users,
      title: "User Base",
      value: "60,000+",
      description: "Active registered users"
    },
    {
      icon: DollarSign,
      title: "GMV",
      value: "₹500 Cr",
      description: "Gross merchandise value"
    },
    {
      icon: BarChart3,
      title: "Market Share",
      value: "15%",
      description: "B2B marketplace market share"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Investor Relations</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to Indian Trade Mart's investor relations center. Find the latest financial information, reports, and updates for our stakeholders.
          </p>
        </div>

        {/* Financial Highlights */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Financial Highlights</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {financialHighlights.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-sm text-gray-600 mb-2">{item.metric}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
                <div className="text-sm text-green-600 font-medium">{item.growth}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Key Performance Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <metric.icon className="text-blue-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900">{metric.title}</h3>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reports & Filings */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Reports & Filings</h2>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{report.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar className="mr-1" size={16} />
                        {new Date(report.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        <span className="mx-2">•</span>
                        <span>{report.type}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="mr-1" size={16} />
                        {report.format} • {report.size}
                      </div>
                    </div>
                    <button className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                    <div className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-gray-600">{event.time}</div>
                    <div className="text-xs text-blue-600 mt-1">{event.type}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Stock Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock Symbol</span>
                  <span className="font-medium">ITM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exchange</span>
                  <span className="font-medium">NSE/BSE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Price</span>
                  <span className="font-medium text-green-600">₹1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">52-Week High</span>
                  <span className="font-medium">₹1,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">52-Week Low</span>
                  <span className="font-medium">₹850</span>
                </div>
              </div>
            </div>

            {/* Investor Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Investor Contact</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">Investor Relations</p>
                  <p className="text-sm text-gray-600">investors@indiantrademart.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">+91 9876543210</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">
                    Indian Trade Mart Pvt. Ltd.<br />
                    123 Business Hub, Tech City<br />
                    Gurgaon, Haryana 122001
                  </p>
                </div>
              </div>
            </div>

            {/* Email Alerts */}
            <div className="bg-blue-600 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Email Alerts</h3>
              <p className="text-blue-100 mb-4">Subscribe to receive financial updates and announcements</p>
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

        {/* Investment Thesis */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Investment Thesis</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Leadership</h3>
              <p className="text-gray-600">Leading position in India's growing B2B marketplace sector with 15% market share</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Strong Growth</h3>
              <p className="text-gray-600">Consistent revenue growth of 45% year-over-year with expanding user base</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Technology Edge</h3>
              <p className="text-gray-600">Advanced AI-powered platform with innovative features driving competitive advantage</p>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
