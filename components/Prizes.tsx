import Image from 'next/image'
import { Container } from './ui/Container'

export const Prizes = () => {
  const prizes = [
    {
      place: '1st',
      prize: '$2,500 Cash Prize',
      image: '/images/money.jpg',
      showText: true,
      isGif: false
    },
    {
      place: '2nd',
      prize: 'Meta Ray Bans',
      image: '/images/ray-bans.png',
      showText: false,
      isGif: false
    },
    {
      place: '3rd',
      prize: 'Nintendo Switch',
      image: '/images/nintendo-swtich.gif',
      showText: false,
      isGif: true
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

        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          {prizes.map((prize, index) => (
            <div 
              key={index}
              className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 md:gap-12"
            >
              {/* Left side - Place indicator */}
              <div className="flex-shrink-0 w-full sm:w-32 text-center sm:text-left">
                <div className="inline-block sm:block">
                  <div className={`text-6xl sm:text-7xl md:text-8xl font-bold ${
                    index === 0 ? 'text-gradient-purple' : 'text-gray-800'
                  }`}>
                    {prize.place}
                  </div>
                  <div className="text-lg sm:text-xl text-gray-600 font-semibold mt-2">
                    Place
                  </div>
                </div>
              </div>

              {/* Right side - Prize card with image */}
              <div className="flex-1 w-full">
                <div className={`bg-white rounded-3xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  index === 0 ? 'ring-4 ring-purple-500' : ''
                }`}>
                  <div className="relative aspect-[4/3] w-full bg-gray-100">
                    {prize.isGif ? (
                      // Use regular img tag for GIFs to preserve animation
                      <img
                        src={prize.image}
                        alt={prize.prize}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={prize.image}
                        alt={prize.prize}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    
                    {/* Overlay text for 1st place */}
                    {prize.showText && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 backdrop-blur-sm px-8 py-4 rounded-2xl">
                          <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
                            $2500
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {prize.prize}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-orange rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Success & Impact
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-white/90">
              Top 3 teams meet Felicis Partners and get direct feedback on your projects
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
