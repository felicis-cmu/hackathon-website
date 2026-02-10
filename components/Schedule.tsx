import { Container } from './ui/Container'
import { Card } from './ui/Card'

export const Schedule = () => {
  const scheduleItems = [
    {
      time: '10:00 AM',
      title: 'Launch',
      description: 'Welcome and kickoff'
    },
    {
      time: '10:45 AM',
      title: 'Building Starts',
      description: 'Hacking begins'
    },
    {
      time: '12:30 PM',
      title: 'Lunch',
      description: 'Food and networking'
    },
    {
      time: '5:45 PM',
      title: 'Building Ends',
      description: 'Submit your projects'
    },
    {
      time: '5:45 PM - 7:15 PM',
      title: 'Presentations',
      description: 'Teams showcase their work'
    },
    {
      time: '7:15 PM',
      title: 'Results Announced',
      description: 'Winners revealed'
    }
  ]

  return (
    <section id="schedule" className="py-16 sm:py-20">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Event Schedule
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Saturday, March 14 - Full Day of Building
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 sm:left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-6 sm:space-y-8">
              {scheduleItems.map((item, index) => (
                <div key={index} className="relative pl-16 sm:pl-20 md:pl-28">
                  {/* Timeline dot */}
                  <div className="absolute left-3 sm:left-5 md:left-8 top-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-900 ring-4 ring-gray-200"></div>
                  
                  <Card variant="glass-card" className="hover:shadow-xl hover:scale-[1.02] transition-all ease-liquid">
                    <div className="glass-shimmer"></div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 md:text-right whitespace-nowrap">
                        {item.time}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
