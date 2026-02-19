import { Container } from './ui/Container'

const aims = [
  {
    id: 'product',
    title: 'Product',
    description: 'Build a functional prototype of a product or feature that can generate revenue.',
  },
  {
    id: 'ai',
    title: 'AI',
    description: 'Propose or build an AI/ML solution that adds value to a product or workflow.',
  },
  {
    id: 'felicis',
    title: 'Felicis Portfolio',
    description: 'Build something that integrates with or extends a Felicis portfolio company.',
  },
]

export const Aims = () => {
  return (
    <section id="about" className="py-16 sm:py-20 border-t border-stone-200">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#ED843D' }}>
            01 — About
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-sans text-gray-900 mb-4 tracking-tight">
            What You&apos;ll Work On
          </h2>
          <p className="text-sm sm:text-base text-stone-500 font-light">
            Build toward one or more of these focus areas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {aims.map((aim) => (
            <div
              key={aim.id}
              className="glass-shot-card rounded-2xl overflow-hidden p-6 sm:p-7 flex flex-col"
            >
              <div className="glass-shimmer" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-8 h-0.5 bg-felicis-orange mb-5 rounded-full" />
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  {aim.title}
                </h4>
                <p className="text-sm text-stone-500 flex-1">{aim.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
