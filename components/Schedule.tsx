import { Container } from './ui/Container'

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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Event Schedule
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-light">
            Saturday, March 14 - Full Day of Building
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Centered timeline line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-12">
              {scheduleItems.map((item, index) => {
                const isLeft = index % 2 === 0
                return (
                  <div key={index} className={`relative flex items-center ${isLeft ? 'justify-end' : 'justify-start'}`}>
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-900 ring-4 ring-white z-10"></div>
                    
                    {/* Content */}
                    <div className={`glass-context w-[calc(40%-1rem)] p-4 sm:p-5 ${isLeft ? 'text-right pr-6' : 'text-left pl-6'}`}>
                      <div className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        {item.time}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
