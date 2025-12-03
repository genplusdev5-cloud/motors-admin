'use client'

import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { useEffect } from 'react'

export default function SwiperLoop() {
  const [ref, slider] = useKeenSlider({
    loop: true,
    drag: true, // ⭐ Touch swipe enabled
    rubberband: true,
    renderMode: 'precision',
    slides: {
      perView: 1
    },
    animation: {
      duration: 1900,
      easing: t => 1 - Math.pow(1 - t, 3) // ⭐ Super smooth easing
    }
  })

  // ⭐ AUTOPLAY + TOUCH FRIENDLY
  useEffect(() => {
    if (!slider) return

    let timeout
    let mouseOver = false

    const clearNextTimeout = () => clearTimeout(timeout)

    const nextTimeout = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (!mouseOver) slider.current?.next()
      }, 2600)
    }

    slider.current?.on('created', () => {
      slider.current?.container.addEventListener('mouseover', () => (mouseOver = true))
      slider.current?.container.addEventListener('mouseout', () => (mouseOver = false))
      nextTimeout()
    })

    slider.current?.on('dragStarted', clearNextTimeout)
    slider.current?.on('animationEnded', nextTimeout)
    slider.current?.on('updated', nextTimeout)

    return () => clearTimeout(timeout)
  }, [slider])

  return (
    <div ref={ref} className='keen-slider w-full h-full'>
      <div className='keen-slider__slide'>
        <img src='/images/img/login1.png' className='w-full h-full object-cover' alt='Slide 1' />
      </div>

      <div className='keen-slider__slide'>
        <img src='/images/img/login2.png' className='w-full h-full object-cover' alt='Slide 2' />
      </div>

      <div className='keen-slider__slide'>
        <img src='/images/img/login3.png' className='w-full h-full object-cover' alt='Slide 3' />
      </div>
    </div>
  )
}
