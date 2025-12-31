import { memo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HeroSlider = memo(({ slides }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative h-full w-full group">
      {/* CUSTOM ARROWS */}
      <button
        ref={prevRef}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20
                    hover:bg-black/60 text-white
                   p-3 rounded-full transition opacity-0 group-hover:opacity-100"
      >
        <FiChevronLeft size={26} />
      </button>

      <button
        ref={nextRef}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20
                    hover:bg-black/60 text-white
                   p-3 rounded-full transition opacity-0 group-hover:opacity-100"
      >
        <FiChevronRight size={26} />
      </button>

      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={1200}                     // 🔥 smooth fade speed
        autoplay={{
          delay: 4200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,       // ⏸ pause on hover
        }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="h-full w-full"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              {/* IMAGE */}
              <img
                src={s.img}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

              {/* TEXT */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-6xl mx-auto px-6 lg:px-12">
                  <div className="max-w-xl">
                    <p className="text-sm uppercase tracking-widest mb-3 text-white">
                      Nexston Corporations Pvt Ltd
                    </p>

                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                      {s.title}
                    </h1>

                    <p className="text-lg text-gray-100 mb-6">
                      {s.sub}
                    </p>

                    <a
                      href="#services"
                      className="inline-block px-5 py-3 rounded-md
                                 font-medium text-white
                                 stat-gradient-background
                                 hover:opacity-90 transition"
                    >
                      Explore Services
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});

export default HeroSlider;
