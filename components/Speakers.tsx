import { Container } from './ui/Container'

export const Speakers = () => {
  const activities = [
    {
      title: 'Felicis Speaker',
      description: 'Introduction to Venture Capital',
      details: 'Learn from Felicis partners about the VC landscape, what investors look for, and how to build fundable companies.'
    },
    {
      title: 'Skild Speaker',
      description: 'Industry Insights',
      details: 'Gain valuable insights from Skild experts on innovation and building impactful technology.'
    },
    {
      title: 'Free Lunch',
      description: 'Catered on us',
      details: 'Fuel up mid-hack with a free catered lunch — so you can stay focused on building.'
    },
  ]

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Speakers & Activities
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 font-light">
            Learn from industry leaders and connect with venture capitalists
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {activities.map((activity, index) => (
            <div key={index} className="glass-shot-card rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-2 ease-liquid duration-300">
                <div className="glass-shimmer"></div>
                <div className="relative space-y-3 sm:space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {activity.title}
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    {activity.details}
                  </p>
                </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
