import { Container } from './ui/Container'

const scheduleItems = [
  { time: '11:00 AM', title: 'Launch',               description: 'Kickoff & welcome' },
  { time: '11:30 AM', title: 'Hacking Starts',       description: '7 hours to build' },
  { time: '1:30 PM',  title: 'Lunch',               description: 'Catered meal' },
  { time: '6:30 PM',  title: 'Hacking Ends',        description: 'Finalize your pitch' },
  { time: '6:30–7:30 PM', title: 'Judging',          description: 'Teams present; dinner for participants' },
  { time: '7:30–8:00 PM', title: 'Awards',           description: 'Top teams invited to dinner' },
]

export const Schedule = () => {
  return (
    <section id="schedule" className="py-16 sm:py-20 border-t border-stone-200">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#ED843D' }}>
            03 — Schedule
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-sans text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Event Schedule
          </h2>
          <p className="text-base sm:text-lg text-stone-500 font-light">
            Saturday, March 28
          </p>
        </div>

        <div className="max-w-2xl mx-auto glass-shot-card rounded-2xl overflow-hidden">
          <div className="glass-shimmer" />
          <div className="relative z-10 divide-y divide-stone-200/60">
            {scheduleItems.map((item, index) => (
              <div
                key={index}
                className="flex gap-6 sm:gap-10 pl-5 sm:pl-7 pr-6 sm:pr-8 py-4 sm:py-5 border-l-2 border-stone-200"
              >
                <div className="w-20 sm:w-24 shrink-0 text-sm text-stone-400 pt-0.5 font-light tabular-nums">
                  {item.time}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {item.title}
                  </div>
                  <div className="text-xs sm:text-sm text-stone-500 mt-0.5 font-light">
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
