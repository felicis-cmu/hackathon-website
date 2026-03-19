import Image from 'next/image'

export const Footer = () => {
  return (
    <footer className="relative pt-16 pb-16 overflow-hidden border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-3">
            <Image src="/logos/felicis.png" alt="Felicis" width={48} height={48} className="h-12 w-12" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Felicis</p>
              <p className="text-xs text-gray-600">© 2026 VentureHacks. All rights reserved.</p>
            </div>
          </div>

          {/* Right: Contact Section */}
          <div className="flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
            <p className="text-sm text-gray-600 mb-3">Reach out to the Felicis Fellows at CMU</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/in/david-chung-00b04a199/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border-2 border-gray-200 hover:border-felicis-orange text-gray-800 hover:text-felicis-orange font-medium transition-all text-sm"
              >
                David Chung
              </a>
              <a
                href="https://www.linkedin.com/in/aarush-agarwal-2751a61b1/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border-2 border-gray-200 hover:border-felicis-orange text-gray-800 hover:text-felicis-orange font-medium transition-all text-sm"
              >
                Aarush Agarwal
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
