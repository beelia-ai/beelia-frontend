'use client'

import Image from 'next/image'

export function AboutProduct() {
  return (
    <div className="relative min-h-screen w-full bg-transparent">
      {/* Section content */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-32">
        {/* OneStop Image - positioned at top where globe stops */}
        <div className="w-full flex justify-center mb-12">
          <Image
            src="/images/Onestop.png"
            alt="OneStop"
            width={800}
            height={200}
            className="w-auto h-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}

