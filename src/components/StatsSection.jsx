import { useRef } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function StatsSection({ cardBg, mutedText }) {
  const hasAnimated = useRef(false);

  const { ref, inView } = useInView({
    threshold: 0.25,
    triggerOnce: true,
  });

  if (inView) hasAnimated.current = true;

  return (
    <section ref={ref} className={`${cardBg} py-16 md:py-20 text-center`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
        {[
          ["Enterprise Clients", 24],
          ["Students Trained", 950],
          ["Internships", 220],
          ["Delivered Projects", 85],
        ].map(([label, value], i) => (
          <div key={i}>
            <h3 className="text-4xl md:text-5xl font-extrabold stat-gradient">
              {hasAnimated.current ? (
                <CountUp start={0} end={value} duration={2.4} />
              ) : (
                0
              )}
              <span className="text-xl">+</span>
            </h3>
            <p className={`${mutedText} mt-2`}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
