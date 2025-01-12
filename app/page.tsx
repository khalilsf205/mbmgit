import { NavBar } from '@/components/nav-bar'
import { ImageSlider } from '@/components/image-slider'
import { AboutSection } from '@/components/about-section'
import { ProductsSection } from '@/components/products-section'
import { ResellerSection } from '@/components/reseller-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      <div className="pt-16"> {/* Changed mt-16 to pt-16 for better spacing */}
        <ImageSlider />
        <main className="flex-1">
          <AboutSection />
          <ProductsSection />
          <ResellerSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}

