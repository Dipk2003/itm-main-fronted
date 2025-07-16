import React from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { BookOpen, Video, FileText, Download, Clock, User, Star, Search, Filter } from 'lucide-react';

const LearningCentrePage = () => {
  const courses = [
    {
      id: 1,
      title: "B2B Sales Fundamentals",
      description: "Master the basics of B2B sales including lead generation, qualification, and closing techniques.",
      instructor: "Dr. Rajesh Kumar",
      duration: "4 hours",
      level: "Beginner",
      rating: 4.8,
      students: 1250,
      category: "Sales",
      image: "/api/placeholder/300/200",
      lessons: 12,
      type: "video"
    },
    {
      id: 2,
      title: "Digital Marketing for B2B",
      description: "Learn how to effectively market your B2B products using digital channels and strategies.",
      instructor: "Priya Sharma",
      duration: "6 hours",
      level: "Intermediate",
      rating: 4.7,
      students: 890,
      category: "Marketing",
      image: "/api/placeholder/300/200",
      lessons: 18,
      type: "video"
    },
    {
      id: 3,
      title: "Export Documentation Guide",
      description: "Complete guide to export documentation, compliance, and international trade procedures.",
      instructor: "Amit Patel",
      duration: "3 hours",
      level: "Intermediate",
      rating: 4.9,
      students: 650,
      category: "Export",
      image: "/api/placeholder/300/200",
      lessons: 10,
      type: "document"
    },
    {
      id: 4,
      title: "Supply Chain Management",
      description: "Understand supply chain optimization, vendor management, and logistics coordination.",
      instructor: "Neha Gupta",
      duration: "5 hours",
      level: "Advanced",
      rating: 4.6,
      students: 420,
      category: "Operations",
      image: "/api/placeholder/300/200",
      lessons: 15,
      type: "video"
    },
    {
      id: 5,
      title: "Financial Planning for SMEs",
      description: "Essential financial planning strategies for small and medium enterprises in B2B sector.",
      instructor: "CA Suresh Modi",
      duration: "4 hours",
      level: "Intermediate",
      rating: 4.8,
      students: 780,
      category: "Finance",
      image: "/api/placeholder/300/200",
      lessons: 14,
      type: "video"
    },
    {
      id: 6,
      title: "Quality Assurance in Manufacturing",
      description: "Comprehensive guide to implementing quality assurance processes in manufacturing units.",
      instructor: "Ravi Krishnan",
      duration: "3.5 hours",
      level: "Intermediate",
      rating: 4.7,
      students: 560,
      category: "Quality",
      image: "/api/placeholder/300/200",
      lessons: 11,
      type: "video"
    }
  ];

  const resources = [
    {
      title: "B2B Marketplace Success Guide",
      description: "Complete guide to succeeding in B2B marketplaces with practical tips and strategies.",
      type: "PDF Guide",
      size: "2.5 MB",
      downloads: 1200,
      category: "Business"
    },
    {
      title: "Export Business Checklist",
      description: "Step-by-step checklist for starting and managing export business operations.",
      type: "Checklist",
      size: "850 KB",
      downloads: 890,
      category: "Export"
    },
    {
      title: "GST Compliance for B2B",
      description: "Understanding GST requirements and compliance procedures for B2B transactions.",
      type: "PDF Guide",
      size: "1.8 MB",
      downloads: 750,
      category: "Finance"
    },
    {
      title: "Digital Marketing Templates",
      description: "Ready-to-use templates for B2B digital marketing campaigns and strategies.",
      type: "Template Pack",
      size: "3.2 MB",
      downloads: 650,
      category: "Marketing"
    }
  ];

  const webinars = [
    {
      title: "Future of B2B Commerce in India",
      date: "2024-01-25",
      time: "3:00 PM IST",
      speaker: "Industry Expert Panel",
      registrations: 450,
      status: "upcoming"
    },
    {
      title: "Scaling Your B2B Business",
      date: "2024-01-18",
      time: "2:00 PM IST",
      speaker: "Rohit Agarwal, CEO",
      registrations: 380,
      status: "recorded"
    },
    {
      title: "Digital Transformation in Manufacturing",
      date: "2024-01-10",
      time: "4:00 PM IST",
      speaker: "Tech Leaders",
      registrations: 290,
      status: "recorded"
    }
  ];

  const categories = [
    "All Categories",
    "Sales",
    "Marketing",
    "Export",
    "Operations",
    "Finance",
    "Quality",
    "Technology"
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Learning Centre</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enhance your B2B business skills with our comprehensive learning resources, courses, and expert guidance
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses, guides, resources..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Filter className="mr-2" size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-sm text-gray-600">Courses Available</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">10,000+</div>
            <div className="text-sm text-gray-600">Students Enrolled</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600">20+</div>
            <div className="text-sm text-gray-600">Expert Instructors</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-orange-600">100+</div>
            <div className="text-sm text-gray-600">Resources</div>
          </div>
        </div>

        {/* Featured Courses */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    {course.type === 'video' ? (
                      <Video size={48} className="mx-auto mb-2" />
                    ) : (
                      <FileText size={48} className="mx-auto mb-2" />
                    )}
                    <div className="text-sm font-medium">{course.category}</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level}
                    </span>
                    <div className="flex items-center">
                      <Star className="text-yellow-500 mr-1" size={14} />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User className="mr-1" size={14} />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="mr-1" size={14} />
                      <span>{course.duration}</span>
                    </div>
                    <span>{course.students} students</span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Free Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FileText className="text-blue-600 mr-2" size={20} />
                      <span className="text-sm font-medium text-blue-600">{resource.category}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{resource.type}</span>
                      <span className="mx-2">•</span>
                      <span>{resource.size}</span>
                      <span className="mx-2">•</span>
                      <span>{resource.downloads} downloads</span>
                    </div>
                  </div>
                  <button className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Webinars Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Webinars</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {webinars.map((webinar, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{webinar.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <span>{new Date(webinar.date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{webinar.time}</span>
                        <span className="mx-2">•</span>
                        <span>{webinar.speaker}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {webinar.registrations} registrations
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        webinar.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {webinar.status === 'upcoming' ? 'Upcoming' : 'Recorded'}
                      </span>
                      <button className="block mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                        {webinar.status === 'upcoming' ? 'Register' : 'Watch'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Level Up Your B2B Business?</h2>
          <p className="text-xl mb-6">Join thousands of successful businesses who have transformed their operations with our learning resources</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse All Courses
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Get Free Resources
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LearningCentrePage;
