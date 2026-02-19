import Image from 'next/image'

export const Footer = () => {
  return (
    <footer className="relative pt-2 pb-16 sm:pt-4 sm:pb-20 overflow-hidden min-h-[200px]">
      {/* Logo + Copyright - bottom left */}
      <div className="absolute left-0 z-10 flex items-end gap-3 pl-4 sm:pl-6" style={{ bottom: '2.0rem' }}>
        <Image src="/logos/felicis.png" alt="Felicis" width={48} height={48} className="h-10 w-10 sm:h-12 sm:w-12" />
        <p className="text-sm text-gray-800">
          © 2026 VentureHacks. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
