import { memo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MissionSlider = memo(({ slides }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative h-full w-full group">
      {/* ARROWS */}
      <button
        ref={prevRef}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20
                    hover:bg-black/60 text-white
                   p-2 rounded-full transition opacity-0 group-hover:opacity-100"
      >
        <FiChevronLeft size={22} />
      </button>

      <button
        ref={nextRef}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20
                    hover:bg-black/60 text-white
                   p-2 rounded-full transition opacity-0 group-hover:opacity-100"
      >
        <FiChevronRight size={22} />
      </button>

      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={1000}
        autoplay={{
          delay: 2600,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
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
        {slides.map((m, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              <img
                src={m.img}
                alt={m.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />

              <div className="relative z-10 h-full flex items-center justify-center text-center">
                <div className="max-w-3xl px-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {m.title}
                  </h3>
                  <p className="text-lg text-gray-100">
                    {m.sub}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});

export default MissionSlider;
