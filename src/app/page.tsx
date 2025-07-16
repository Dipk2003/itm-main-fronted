import HeroBanner from '@/components/homepage/HeroBanner'
import CategoryGrid from '@/components/homepage/CategoryGrid'
import ProductGrid from '@/components/homepage/ProductGrid'
import CTASection from '@/components/homepage/CTASection'
import PremiumBrands from '@/components/homepage/PremiumBrands'
import TopCities from '@/components/homepage/TopCities'
import MegaMenu from '@/components/homepage/MegaMenu'
import ProductDetails from '@/components/vendor/ProductDetails'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
   
   {/*  <CategoryGrid />*/ } 
      <MegaMenu/>
      <ProductDetails/>
      <ProductGrid />
      <TopCities />
      <PremiumBrands/>
      <CTASection />
    </>
  )
}
