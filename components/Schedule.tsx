import { Container } from './ui/Container'

const scheduleItems = [
  { time: '12:45 PM', title: 'Doors Open',           description: 'Check in & find your team' },
  { time: '1:00 PM',  title: 'Opening + Guest Speaker', description: 'Welcome from Felicis fellows' },
  { time: '1:30 PM',  title: 'Hacking Starts',       description: '3.5 hours to build' },
  { time: '3:00 PM',  title: 'Food',                 description: 'Catered lunch' },
  { time: '5:00 PM',  title: 'Hacking Ends',         description: 'Finalize your pitch' },
  { time: '5:15 PM',  title: 'Presentations',        description: 'All teams present' },
  { time: '6:30 PM',  title: 'Awards & Closing',     description: 'Top teams invited to dinner' },
]

export const Schedule = () => {
  return (
    <section id="schedule" className="py-16 sm:py-20">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Event Schedule
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-light">
            Saturday, March 14
          </p>
        </div>

        <div className="max-w-2xl mx-auto glass-shot-card rounded-2xl overflow-hidden">
          <div className="glass-shimmer" />
          <div className="relative z-10 divide-y divide-gray-200/60">
            {scheduleItems.map((item, index) => (
              <div key={index} className="flex gap-6 sm:gap-10 px-6 sm:px-8 py-4 sm:py-5">
                <div className="w-20 sm:w-24 shrink-0 text-sm text-gray-400 pt-0.5 font-light tabular-nums">
                  {item.time}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {item.title}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-0.5 font-light">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
