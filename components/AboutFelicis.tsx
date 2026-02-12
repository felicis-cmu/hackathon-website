import { Container } from './ui/Container'

const portfolio = [
  'Notion', 'Canva', 'Shopify', 'Runway', 'Mercor',
  'Weights & Biases', 'Adyen', 'Fitbit', 'Supabase', 'Verkada',
]

const stats = [
  { num: '$220B+', label: 'Portfolio Value' },
  { num: '$100B+', label: 'Exit Market Cap' },
  { num: '19',     label: 'IPOs' },
  { num: '100+',   label: 'Exits' },
]

export const AboutFelicis = () => {
  return (
    <section className="bg-stone-100 py-16 sm:py-24">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start max-w-5xl mx-auto">

          {/* Left — copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-4">
              About Felicis
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-5">
              Luck isn't made,<br />
              <span className="text-orange-400 italic font-light">it's engineered.</span>
            </h2>
            <p className="text-base text-gray-500 font-light leading-relaxed mb-10">
              Felicis has been backing category-defining companies since 2006.
              Their portfolio reads like a who's-who of the internet — not through luck,
              but by identifying high-signal founders before anyone else does.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {stats.map((s) => (
                <div key={s.label} className="border-t border-stone-300 pt-4">
                  <div className="text-2xl font-bold text-gray-900 tracking-tight">{s.num}</div>
                  <div className="text-sm text-gray-500 font-light mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — portfolio names */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
              Portfolio companies
            </p>
            <div className="flex flex-wrap gap-2">
              {portfolio.map((co) => (
                <span
                  key={co}
                  className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 border border-stone-300 bg-white/60"
                >
                  {co}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 font-light mt-5">
              + hundreds more across every major sector
            </p>
          </div>

        </div>
      </Container>
    </section>
  )
}
