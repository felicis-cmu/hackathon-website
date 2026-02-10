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
    <section id="prizes" className="py-16 sm:py-20 bg-gray-50">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Compete & Win
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 font-light">
            Top 3 teams meet Felicis partners and take home incredible prizes
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Left side - Vertical place selector */}
            <div className="flex md:flex-col gap-4 justify-center md:justify-start">
              {prizes.map((prize, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPrize(index)}
                  className={`flex-1 md:flex-none px-6 py-4 md:px-8 md:py-6 rounded-2xl font-bold text-left transition-all ease-liquid duration-300 ${
                    selectedPrize === index
                      ? 'bg-gray-900 text-white shadow-lg scale-105'
                      : 'glass-context text-gray-700 hover:scale-105'
                  }`}
                >
                  <div className="text-4xl md:text-5xl mb-1">
                    {prize.place}
                  </div>
                  <div className="text-sm md:text-base opacity-90">
                    {prize.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Right side - Prize display card */}
            <div className="flex-1">
              <div className="glass-shot-card rounded-3xl overflow-hidden transform transition-all ease-liquid duration-300 hover:scale-[1.02]">
                {/* Shimmer effect on hover */}
                <div className="glass-shimmer"></div>
                
                <div className="relative aspect-[4/3] w-full bg-gray-100">
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
                      <div className="glass-context px-8 py-4 rounded-2xl">
                        <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900">
                          $2500
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6 md:p-8">
                  <div className="text-sm text-gray-500 mb-2">
                    {currentPrize.place} Place Prize
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {currentPrize.prize}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="liquid-panel rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto relative overflow-hidden">
            {/* Neutral background overlay */}
            <div className="absolute inset-0 bg-gray-100 opacity-90 z-0"></div>
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Success & Impact
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-gray-700">
                Top 3 teams meet Felicis Partners and get direct feedback on your projects
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
