import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Store, TrendingUp, Users, Shield, Zap, Globe } from 'lucide-react';

export default function SellOnTradeMart() {
  const benefits = [
    {
      icon: Globe,
      title: "Reach Millions of Buyers",
      description: "Access to verified buyers across India looking for your products"
    },
    {
      icon: TrendingUp,
      title: "Increase Sales",
      description: "Grow your business with our powerful sales tools and analytics"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Protected transactions with multiple payment options"
    },
    {
      icon: Zap,
      title: "Easy Setup",
      description: "Quick and simple onboarding process to start selling"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "24/7 customer support to help you succeed"
    },
    {
      icon: Store,
      title: "Free Listing",
      description: "List your products for free with no setup costs"
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Register Your Business",
      description: "Sign up and verify your business details"
    },
    {
      step: 2,
      title: "Add Products",
      description: "Upload your product catalog with images and descriptions"
    },
    {
      step: 3,
      title: "Set Pricing",
      description: "Configure your pricing, shipping, and payment terms"
    },
    {
      step: 4,
      title: "Start Selling",
      description: "Go live and start receiving orders from buyers"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
   
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Sell on Indian Trade Mart
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of successful sellers and grow your business with India's leading B2B marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/vendor/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
            >
              Start Selling Now
            </a>
            <a
              href="/contact-us"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
            >
              Contact Sales Team
            </a>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Indian Trade Mart?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <benefit.icon className="text-blue-600 mr-3" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                </div>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
            <p className="text-blue-100">Be part of India's most trusted B2B marketplace</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Active Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Verified Buyers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">Products Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">₹500Cr+</div>
              <div className="text-blue-100">GMV</div>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Requirements to Start Selling
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Documents</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Valid GST Registration Certificate</li>
                <li>• Business Registration Documents</li>
                <li>• PAN Card</li>
                <li>• Bank Account Details</li>
                <li>• Address Proof</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• High-quality product images</li>
                <li>• Detailed product descriptions</li>
                <li>• Pricing information</li>
                <li>• Shipping details</li>
                <li>• Product certifications (if applicable)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of successful businesses already selling on Indian Trade Mart
          </p>
          <a
            href="/auth/vendor/register"
            className="bg-blue-600 text-white px-12 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg inline-block"
          >
            Register as Seller
          </a>
        </div>
      </main>
 
    </div>
  );
}
