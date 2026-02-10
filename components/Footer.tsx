import { Container } from './ui/Container'

export const Footer = () => {
  return (
    <footer className="py-10 sm:py-12">
      <Container>
        <div className="liquid-panel rounded-3xl p-8 sm:p-10 relative overflow-hidden">
          <div className="glass-shimmer"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                VentureHack
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Building iconic companies together
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg text-gray-900">Event Details</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                <li>Date: March 14</li>
                <li>Time: 10:00 AM - 7:15 PM</li>
                <li>Format: In-Person</li>
              </ul>
            </div>

            <div className="sm:col-span-2 md:col-span-1">
              <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg text-gray-900">Contact</h4>
              <p className="text-sm sm:text-base text-gray-600">
                For questions and inquiries, reach out to the Felicis team
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
