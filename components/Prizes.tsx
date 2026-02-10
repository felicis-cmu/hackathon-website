'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Container } from './ui/Container'

export const Prizes = () => {
  const [selectedPrize, setSelectedPrize] = useState(0)

  const prizes = [
    {
      place: '1st',
      label: 'First',
      prize: '$2,500 Cash Prize',
      image: '/images/money.jpg',
      showText: true,
      isGif: false
    },
    {
      place: '2nd',
      label: 'Second',
      prize: 'Meta Ray Bans',
      image: '/images/ray-bans.png',
      showText: false,
      isGif: false
    },
    {
      place: '3rd',
      label: 'Third',
      prize: 'Nintendo Switch',
      image: '/images/nintendo-swtich.gif',
      showText: false,
      isGif: true
    }
  ]

  const currentPrize = prizes[selectedPrize]

  return (
    <section id="prizes" className="py-16 sm:py-20">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Compete & Win
          </h2>
          <div className="glass-context max-w-2xl mx-auto px-4 sm:px-6 py-3 sm:py-4 rounded-2xl">
            <p className="text-base sm:text-lg text-gray-700 font-light">
              Top 3 teams meet Felicis partners and take home incredible prizes
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            {/* Vertical place selector with liquid glass buttons */}
            <div className="flex flex-col gap-3 justify-center items-center md:items-start">
              {prizes.map((prize, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPrize(index)}
                  className={`liquid-glass-pill inline-flex items-center min-w-24 justify-center px-7 py-3 text-lg sm:text-xl leading-none transition-all duration-300 focus:outline-none select-none ${
                    selectedPrize === index
                      ? 'liquid-glass-pill-active scale-105 text-gray-900'
                      : 'text-gray-800'
                  }`}
                >
                  {prize.place}
                </button>
              ))}
            </div>

            {/* Prize display card - smaller */}
            <div className="flex-1">
              <div className="glass-shot-card rounded-2xl overflow-hidden transform transition-all ease-liquid duration-300 hover:scale-[1.02]">
                {/* Shimmer effect on hover */}
                <div className="glass-shimmer"></div>
                
                <div className="relative aspect-[16/9] w-full bg-gray-100">
                  {currentPrize.isGif ? (
                    <img
                      src={currentPrize.image}
                      alt={currentPrize.prize}
                      className="w-full h-full object-cover"
                      key={currentPrize.image}
                    />
                  ) : (
                    <Image
                      src={currentPrize.image}
                      alt={currentPrize.prize}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      key={currentPrize.image}
                    />
                  )}
                  
                  {/* Overlay text for 1st place */}
                  {currentPrize.showText && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="glass-context px-6 py-3 rounded-xl">
                        <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
                          $2500
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">
                    {currentPrize.place} Place Prize
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {currentPrize.prize}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

      </Container>
    </section>
  )
}
