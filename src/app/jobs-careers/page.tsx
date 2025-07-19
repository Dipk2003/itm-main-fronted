import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { MapPin, Clock, Users, Star, Briefcase } from 'lucide-react';

export default function JobsCareers() {
  const openings = [
    {
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Gurgaon, India",
      type: "Full-time",
      experience: "3-5 years",
      description: "Join our engineering team to build scalable B2B marketplace solutions using React, Node.js, and modern technologies."
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Gurgaon, India",
      type: "Full-time",
      experience: "4-6 years",
      description: "Lead product strategy and roadmap for our B2B marketplace platform, working closely with engineering and design teams."
    },
    {
      title: "Business Development Manager",
      department: "Sales",
      location: "Mumbai, India",
      type: "Full-time",
      experience: "2-4 years",
      description: "Drive business growth by acquiring new vendors and buyers, building strategic partnerships in the B2B space."
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "2-4 years",
      description: "Create intuitive and engaging user experiences for our B2B marketplace platform and mobile applications."
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      experience: "1-3 years",
      description: "Analyze marketplace data to derive insights and support data-driven decision making across the organization."
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Delhi, India",
      type: "Full-time",
      experience: "2-3 years",
      description: "Ensure customer satisfaction and success by providing support, training, and strategic guidance to our B2B clients."
    }
  ];

  const benefits = [
    "Competitive salary and equity",
    "Comprehensive health insurance",
    "Flexible work arrangements",
    "Learning and development budget",
    "Modern office with amenities",
    "Team outings and events",
    "Performance bonuses",
    "Career growth opportunities"
  ];

  const values = [
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in working together to achieve great things"
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We strive for excellence in everything we do"
    },
    {
      icon: Briefcase,
      title: "Innovation",
      description: "We encourage innovative thinking and creative solutions"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
   
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us build the future of B2B commerce in India. Join a team of passionate professionals working to connect businesses nationwide.
          </p>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm text-center">
                <value.icon className="text-blue-600 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Open Positions</h2>
          <div className="space-y-6">
            {openings.map((job, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Briefcase size={16} className="mr-1" />
                        {job.department}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center">
                        <Users size={16} className="mr-1" />
                        {job.experience}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Apply Now
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">{job.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Work With Us?</h2>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Hiring Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Application</h3>
              <p className="text-gray-600">Submit your resume and cover letter</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Screening</h3>
              <p className="text-gray-600">Initial phone or video screening</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview</h3>
              <p className="text-gray-600">Technical and cultural fit interviews</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Offer</h3>
              <p className="text-gray-600">Job offer and onboarding</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Don't See the Right Role?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:careers@indiantrademart.com"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Send Resume
            </a>
            <a
              href="/contact-us"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Contact HR
            </a>
          </div>
        </div>
      </main>

    </div>
  );
}
