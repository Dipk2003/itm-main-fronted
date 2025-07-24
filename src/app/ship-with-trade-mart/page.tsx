import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Truck, Package, MapPin, Clock, Shield, Calculator, CheckCircle, Phone } from 'lucide-react';

const ShipWithTradeMartPage = () => {
  const shippingOptions = [
    {
      id: 1,
      name: "Express Delivery",
      icon: Truck,
      description: "Fast delivery within 1-2 days for urgent shipments",
      deliveryTime: "1-2 days",
      coverage: "Major cities",
      price: "Premium",
      features: ["Real-time tracking", "Insurance included", "Priority handling", "24/7 support"]
    },
    {
      id: 2,
      name: "Standard Shipping",
      icon: Package,
      description: "Cost-effective solution for regular shipments",
      deliveryTime: "3-5 days",
      coverage: "Pan India",
      price: "Affordable",
      features: ["Online tracking", "Secure packaging", "Bulk discounts", "Wide coverage"]
    },
    {
      id: 3,
      name: "Bulk Freight",
      icon: Truck,
      description: "Heavy cargo and bulk shipments handling",
      deliveryTime: "5-7 days",
      coverage: "All major routes",
      price: "Economical",
      features: ["Special handling", "Volume discounts", "Dedicated fleet", "Custom solutions"]
    },
    {
      id: 4,
      name: "International Shipping",
      icon: Package,
      description: "Global shipping solutions for export businesses",
      deliveryTime: "7-15 days",
      coverage: "Worldwide",
      price: "Competitive",
      features: ["Customs clearance", "Documentation", "Multi-modal", "Global network"]
    }
  ];

  const services = [
    {
      icon: Package,
      title: "Packaging Solutions",
      description: "Professional packaging services to ensure safe delivery of your products"
    },
    {
      icon: Shield,
      title: "Insurance Coverage",
      description: "Comprehensive insurance options to protect your valuable shipments"
    },
    {
      icon: MapPin,
      title: "Warehousing",
      description: "Secure warehouse facilities for storage and distribution needs"
    },
    {
      icon: Calculator,
      title: "Cost Calculator",
      description: "Instant shipping cost estimates based on weight, size, and destination"
    },
    {
      icon: Clock,
      title: "Time-Definite Delivery",
      description: "Guaranteed delivery within specified time frames"
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Quality checks and handling protocols for different product types"
    }
  ];

  const partners = [
    {
      name: "DHL Express",
      logo: "/api/placeholder/100/50",
      specialty: "International Express"
    },
    {
      name: "FedEx",
      logo: "/api/placeholder/100/50",
      specialty: "Global Shipping"
    },
    {
      name: "Blue Dart",
      logo: "/api/placeholder/100/50",
      specialty: "Domestic Express"
    },
    {
      name: "DTDC",
      logo: "/api/placeholder/100/50",
      specialty: "Pan India Network"
    },
    {
      name: "Delhivery",
      logo: "/api/placeholder/100/50",
      specialty: "E-commerce Logistics"
    },
    {
      name: "Ecom Express",
      logo: "/api/placeholder/100/50",
      specialty: "Last Mile Delivery"
    }
  ];

  const testimonials = [
    {
      company: "ABC Manufacturing",
      person: "Rajesh Kumar, Operations Manager",
      rating: 5,
      comment: "Trade Mart's shipping solutions have streamlined our logistics operations. Fast, reliable, and cost-effective."
    },
    {
      company: "XYZ Exports",
      person: "Priya Sharma, Export Manager",
      comment: "International shipping made easy. Excellent documentation support and tracking system."
    },
    {
      company: "Tech Solutions Ltd",
      person: "Amit Patel, CEO",
      comment: "Their bulk freight service has significantly reduced our shipping costs while maintaining quality."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
  
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ship With Trade Mart</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive logistics solutions for your B2B shipments with reliable partners and competitive rates
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">500+</div>
            <div className="text-sm text-gray-600">Cities Covered</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">99.5%</div>
            <div className="text-sm text-gray-600">On-Time Delivery</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600">50K+</div>
            <div className="text-sm text-gray-600">Shipments Monthly</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-gray-600">Customer Support</div>
          </div>
        </div>

        {/* Shipping Options */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Choose Your Shipping Option</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingOptions.map((option) => (
              <div key={option.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <option.icon className="text-blue-600 mr-3" size={32} />
                  <h3 className="text-xl font-semibold text-gray-900">{option.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Time:</span>
                    <span className="font-medium">{option.deliveryTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Coverage:</span>
                    <span className="font-medium">{option.coverage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pricing:</span>
                    <span className="font-medium">{option.price}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {option.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="text-green-500 mr-2" size={16} />
                      {feature}
                    </div>
                  ))}
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Select Option
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <service.icon className="text-blue-600 mr-3" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cost Calculator */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Calculate Shipping Cost</h2>
            <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From (Pickup Location)</label>
                  <input
                    type="text"
                    placeholder="Enter pickup city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To (Delivery Location)</label>
                  <input
                    type="text"
                    placeholder="Enter delivery city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="Enter weight"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (L x W x H cm)</label>
                  <input
                    type="text"
                    placeholder="e.g., 30 x 20 x 10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Express Delivery</option>
                    <option>Standard Shipping</option>
                    <option>Bulk Freight</option>
                    <option>International Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Electronics</option>
                    <option>Textiles</option>
                    <option>Machinery</option>
                    <option>Chemicals</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Calculate Cost
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Logistics Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow">
                <div className="h-12 bg-gray-200 rounded mb-3 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">{partner.name}</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{partner.name}</h4>
                <p className="text-xs text-gray-600">{partner.specialty}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{testimonial.person}</div>
                  <div className="text-gray-600">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need Custom Shipping Solutions?</h2>
          <p className="text-xl mb-6">Our logistics experts are ready to help you find the perfect shipping solution for your business</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
              <Phone className="mr-2" size={20} />
              Call Us Now
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Get Quote
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ShipWithTradeMartPage;
