import { Container } from './ui/Container'

const prizes = [
  {
    place: '1st',
    amount: '$2,500',
    desc: 'Cash prize per team',
    perk: 'Coffee chat with Felicis partners',
    accent: 'bg-amber-50/70 border-amber-200/60',
  },
  {
    place: '2nd',
    amount: 'Meta Ray-Bans',
    desc: 'Smart glasses per team member',
    perk: 'Coffee chat with Felicis partners',
    accent: 'bg-violet-50/70 border-violet-200/60',
  },
  {
    place: '3rd',
    amount: 'Nintendo Switch',
    desc: 'Or Apple Watch SE per team member',
    perk: 'Coffee chat with Felicis partners',
    accent: '',
  },
]

export const Prizes = () => {
  return (
    <section id="prizes" className="py-16 sm:py-20">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Compete & Win
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-light">
            Top 3 teams meet Felicis partners and take home incredible prizes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {prizes.map((prize) => (
            <div
              key={prize.place}
              className={`glass-shot-card rounded-2xl overflow-hidden ${prize.accent}`}
            >
              <div className="glass-shimmer" />
              <div className="relative z-10 p-6 sm:p-7 flex flex-col h-full">
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                  {prize.place} Place
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                  {prize.amount}
                </div>
                <div className="text-sm text-gray-600 flex-1">
                  {prize.desc}
                </div>
                <div className="mt-5 pt-4 border-t border-gray-200/60 text-xs text-gray-500">
                  {prize.perk}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
