'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const categories = [
  {
    title: 'Industrial Plants & Machinery',
    icon: '/icons/machinery.svg',
    subcategories: ['Material Handling', 'Machines', 'Processing Equipment']
  },
  {
    title: 'Electronics & Electrical',
    icon: '/icons/electronics.svg',
    subcategories: ['Cables', 'Batteries', 'LEDs', 'Transformers']
  },
  {
    title: 'Food & Beverages',
    icon: '/icons/food.svg',
    subcategories: ['Snacks', 'Beverages', 'Grains', 'Packaged Food']
  },
  {
    title: 'Hospital & Diagnostics',
    icon: '/icons/hospital.svg',
    subcategories: ['X-ray Machines', 'Lab Equipment', 'Surgical Tools']
  },
  {
    title: 'Apparel & Garments',
    icon: '/icons/apparel.svg',
    subcategories: ['Menswear', 'Womenswear', 'Kidswear']
  },
  {
    title: 'Security Systems & Services',
    icon: '/icons/security.svg',
    subcategories: ['CCTV', 'Biometric Systems', 'Alarm Systems']
  },
  {
    title: 'Computer & IT Solutions',
    icon: '/icons/computer.svg',
    subcategories: ['Laptops', 'Networking', 'Software']
  },
  {
    title: 'Building & Construction',
    icon: '/icons/construction.svg',
    subcategories: ['Cement', 'Tiles', 'Plumbing', 'Tools']
  }
]

export default function CategoryGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="relative group bg-white border rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-left">{cat.title}</h3>
              <ChevronDown className="w-5 h-5 text-gray-500 group-hover:rotate-180 transition" />
            </div>

            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 space-y-2"
                >
                  {cat.subcategories.map((sub, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-gray-700 hover:text-blue-600 transition"
                    >
                      {sub}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
