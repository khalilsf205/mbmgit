'use client'

import React from 'react'
import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const images = [
  '/slide1.jpg',
  '/slide2.jpg',
  '/slide3.jpg',
  '/slide4.jpg',
]
export function ImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[600px]">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index} className="relative w-full h-[300px] md:h-[400px] lg:h-[600px]">
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0}
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}

