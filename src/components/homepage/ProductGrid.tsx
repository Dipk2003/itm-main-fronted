const products = new Array(3).fill(null);

export default function ProductGrid() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Featured Products</h2>
      <p className="text-gray-500 mb-10 max-w-xl mx-auto">
        Hand-picked solutions to power your business growth — quality guaranteed.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {products.map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 group"
          >
            <div className="h-44 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
              <span className="text-gray-400 group-hover:text-gray-500 transition">Image Placeholder</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-1 group-hover:text-blue-600 transition">
              Product Name
            </h3>
            <p className="text-gray-500 text-sm mb-2">Short product description or category</p>
            <div className="text-blue-600 font-bold text-lg">$99.99</div>
          </div>
        ))}
      </div>
    </section>
  );
}
