import { Container } from './ui/Container'
import { Card } from './ui/Card'

export const Prizes = () => {
  const prizes = [
    {
      place: '1st Place',
      prize: '$2,500',
      description: 'Cash Prize',
      highlight: true
    },
    {
      place: '2nd Place',
      prize: 'Meta Ray Bans',
      description: 'Smart Glasses',
      highlight: false
    },
    {
      place: '3rd Place',
      prize: 'Nintendo Switches',
      description: 'Gaming Console',
      highlight: false
    }
  ]

  return (
    <section id="prizes" className="py-16 sm:py-20 bg-gray-50">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Compete & Win
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Top 3 teams meet Felicis partners and take home incredible prizes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <Card background="orange" className="md:col-span-2 text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Success & Impact
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-white/90">
              Meet Felicis Partners and get direct feedback on your projects
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {prizes.map((prize, index) => (
            <Card 
              key={index}
              className={`text-center transform transition-transform hover:scale-105 ${
                prize.highlight ? 'ring-4 ring-purple-500' : ''
              }`}
            >
              <div className="space-y-3 sm:space-y-4">
                <div className={`text-base sm:text-lg font-semibold ${
                  prize.highlight ? 'text-gradient-purple' : 'text-gray-600'
                }`}>
                  {prize.place}
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  {prize.prize}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {prize.description}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
