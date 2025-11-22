"use client"; // Required for useState and useEffect

import React, { useState, useEffect } from "react";
import Star from "./SVGs/Star";

const reviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    location: "South Delhi",
    rating: 5,
    text: "The villa was absolutely stunning. The host was incredibly responsive, and the amenities were exactly as described. Perfect weekend getaway for our family.",
    date: "October 2024",
  },
  {
    id: 2,
    name: "Priya Kapoor",
    location: "Gurgaon",
    rating: 5,
    text: "I've used many rental platforms, but the transparency here is unmatched. I loved the pre-booking chat feature—it made me feel so much more secure.",
    date: "November 2024",
  },
  {
    id: 3,
    name: "Rohan Mehta",
    location: "Noida",
    rating: 4,
    text: "Seamless check-in and the property was spotless. The liability protection gave me peace of mind. Highly recommend for short stays in NCR.",
    date: "September 2024",
  },
];

const ReviewCarousel = () => {
  const [current, setCurrent] = useState(0);

  // Auto-scroll logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 10000); // 10000ms = 10 seconds

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="w-full h-auto flex flex-col justify-center bg-slate-100 text-black rounded-2xl p-8 relative overflow-hidden">
      {/* Background Decoration (Optional) */}
      {/*<Quote className="absolute top-6 right-6 w-8 h-8 text-slate-800/10 rotate-180" />

      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {reviews.map((review) => (
            <div key={review.id} className="w-full shrink-0 px-1">
              <div className="flex flex-col gap-4">
                {/* Stars */}
                <div className="flex ">
                  {[...Array(review.rating)].map((_, i) => (
                    <div key={i} className="scale-80">
                      <Star />
                    </div>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-600">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* User Info */}
                <div className="mt-2">
                  <p className="font-bold text-slate-600">{review.name}</p>
                  <p className="text-sm text-slate-400">
                    {review.location} • {review.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex gap-2 mt-8">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index ? "w-8 bg-black" : "w-2 bg-slate-600"
            }`}
            aria-label={`Go to review ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewCarousel;
