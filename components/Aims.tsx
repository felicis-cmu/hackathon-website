import { Container } from './ui/Container'

const aims = [
  {
    id: 'product',
    title: 'Product',
    description: 'Build a functional prototype of a product or feature that can generate revenue.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    id: 'ai',
    title: 'AI',
    description: 'Propose or build an AI/ML solution that adds value to a product or workflow.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'felicis',
    title: 'Felicis Portfolio',
    description: 'Build something that integrates with or extends a Felicis portfolio company.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
]

export const Aims = () => {
  return (
    <section id="aims" className="py-16 sm:py-20">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-medium tracking-widest text-gray-500 uppercase mb-2">
            [What You&apos;ll Work On]
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-2 tracking-tight">
            VentureHacks
          </h2>
          <h3 className="text-xl sm:text-2xl font-light text-gray-600 mb-4">Aims</h3>
          <p className="text-sm sm:text-base text-gray-500 font-light">
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
                <div className="text-gray-600 mb-4">{aim.icon}</div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  {aim.title}
                </h4>
                <p className="text-sm text-gray-600 flex-1">{aim.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
