import { Container } from './ui/Container'

const portfolio = [
  'Notion', 'Canva', 'Shopify', 'Runway',
  'Mercor', 'Weights & Biases', 'Supabase', 'Verkada',
]


export const AboutFelicis = () => {
  return (
    <section className="bg-felicis-peach py-16 sm:py-24">
      <Container>
        <div className="max-w-5xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            {/* Left — copy */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-felicis-orange mb-4">
                About Felicis
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-5">
                Luck isn't made,<br />
                <span className="text-felicis-orange italic font-light">it's engineered.</span>
              </h2>
              <p className="text-base text-gray-500 font-light leading-relaxed">
                Felicis has been backing category-defining companies since 2006 —
                identifying high-signal founders before anyone else does.
              </p>
            </div>

            {/* Right — portfolio list */}
            <div className="border-t border-[#ddd0c0]">
              {portfolio.map((co) => (
                <div key={co} className="border-b border-[#ddd0c0] py-3">
                  <span className="text-base font-medium text-gray-900">{co}</span>
                </div>
              ))}
              <p className="text-xs text-gray-400 font-light mt-4">
                + hundreds more
              </p>
            </div>
          </div>

        </div>
      </Container>
    </section>
  )
}
