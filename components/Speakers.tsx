import { Container } from './ui/Container'
import { Card } from './ui/Card'

export const Speakers = () => {
  const activities = [
    {
      title: 'Felicis Speaker',
      description: 'Introduction to Venture Capital',
      details: 'Learn from Felicis partners about the VC landscape, what investors look for, and how to build fundable companies.',
      icon: '💼'
    },
    {
      title: 'Skild Speaker',
      description: 'Industry Insights',
      details: 'Gain valuable insights from Skild experts on innovation and building impactful technology.',
      icon: '🎯'
    },
    {
      title: 'Invitational Dinner',
      description: 'Meet VCs & Network',
      details: 'Exclusive opportunity to connect with venture capitalists in an intimate setting. Build relationships that can help grow your ideas into reality.',
      icon: '🍽️'
    }
  ]

  return (
    <section className="py-16 sm:py-20 bg-purple-50">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Speakers & Activities
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Learn from industry leaders and connect with venture capitalists
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {activities.map((activity, index) => (
            <Card key={index} className="hover:shadow-xl transition-all hover:-translate-y-2 duration-300">
              <div className="space-y-3 sm:space-y-4">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">
                  {activity.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {activity.title}
                </h3>
                <p className="text-base sm:text-lg font-semibold text-gradient-purple">
                  {activity.description}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  {activity.details}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <Card background="purple" className="max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Attend?
            </h3>
            <p className="text-base sm:text-lg text-gray-700">
              This hackathon isn't just about building - it's about connecting with the venture capital ecosystem, 
              learning what it takes to build impactful companies, and potentially finding your next co-founder or investor.
            </p>
          </Card>
        </div>
      </Container>
    </section>
  )
}
