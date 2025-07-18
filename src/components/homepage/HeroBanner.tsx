export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-green-500 text-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-sm">
          Empowering Businesses with Smart Technology
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl text-white/90">
          Explore innovative solutions and services tailored to your industry. Indian Trade Mart is your gateway to digital transformation.
        </p>
        <button className="mt-8 px-8 py-3 bg-white text-blue-700 rounded-full text-base font-semibold hover:bg-gray-100 shadow transition duration-300">
          Get Started
        </button>
      </div>

      {/* Optional Background Shape or Illustration */}
      <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
}

