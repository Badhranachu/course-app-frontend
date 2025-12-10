// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { FaWhatsapp } from "react-icons/fa";
import { FiMoon, FiSun } from "react-icons/fi";
import { useInView } from "react-intersection-observer";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";



/**
 * Premium Home - Corporate / Clean layout
 * - Hero slider (keeps your chosen images)
 * - Mission slider (teamwork / collaboration images from Pexels — Option A2)
 * - Counters (CountUp animated when visible)
 * - Services (smooth scroll target)
 * - Partners marquee
 * - Grow With Us form (name, phone, email)
 * - Testimonials carousel
 * - Floating WhatsApp button
 *
 * Replace image URLs with your own Pexels / asset URLs when ready.
 */

function Home() {
    
const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [isDark, setIsDark] = useState(false);
  const { ref: counterRef, inView } = useInView({ triggerOnce: true, threshold: 0.25 });
  const [mounted, setMounted] = useState(false);


  

const { user } = useAuth();

const handleApply = () => {
  if (user) {
    navigate("/dashboard");
  } else {
    navigate("/auth/signup");
  }
};



  useEffect(() => {
    // defer any client-only logic
    setMounted(true);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send to backend API
    alert("Thanks — our team will contact you shortly.");
    setForm({ name: "", phone: "", email: "" });
  };

  const pageBg = isDark ? "bg-slate-900 text-gray-50" : "bg-white text-gray-900";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const mutedText = isDark ? "text-gray-300" : "text-gray-600";
  const borderColor = isDark ? "border-slate-700" : "border-slate-200";

  // Hero slides (kept as you had — high-quality Pexels images)
  const heroSlides = [
    {
      title: "Digital Core for Modern Enterprises",
      sub: "Enterprise-grade software, crafted for scale and security.",
      img: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg",
    },
    {
      title: "Business Meets Engineering",
      sub: "Bekola connects your business vision with clean, modern code.",
      img: "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg",
    },
    {
      title: "Strategy. Technology. Execution.",
      sub: "From idea to deployment, we partner across the full lifecycle.",
      img: "https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg",
    },
    {
      title: "AI & Automation at Enterprise Scale",
      sub: "Transforming business processes with intelligent automation.",
      img: "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg",
    },
    {
      title: "Future-Ready Engineering Workforce",
      sub: "Training and deploying the next generation of engineers.",
      img: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
    },
  ];

  // Mission slides — Option A2: Teamwork / Collaboration images (different from hero)
  const missionSlides = [
    {
      title: "Building an Industry-Ready Workforce",
      sub: "Bridging academia and real corporate engineering with hands-on projects.",
      img: "https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg", // teamwork image
    },
    {
      title: "Cross-functional Collaboration",
      sub: "We embed students into product teams and teach real-world collaboration.",
      img: "https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg", // teamwork image
    },
    {
      title: "Mentorship & Real Deliverables",
      sub: "Mentored internships, code reviews, and production-like delivery cycles.",
      img: "https://images.pexels.com/photos/3182826/pexels-photo-3182826.jpeg", // teamwork image
    },
  ];

  return (
    <div className={`${pageBg} min-h-screen font-sans`}>
      {/* Theme toggle */}
      <button
        onClick={() => setIsDark((s) => !s)}
        className="fixed z-40 bottom-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg bg-white/90 dark:bg-slate-800 dark:text-gray-100"
        aria-label="Toggle theme"
      >
        {isDark ? <FiSun /> : <FiMoon />}
        <span className="text-sm font-medium">{isDark ? "Light" : "Dark"}</span>
      </button>

      {/* HERO SLIDER */}
      <header className="relative w-full h-[78vh] md:h-[82vh] overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          autoplay={{ delay: 4200, disableOnInteraction: false }}
          effect="fade"
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-full w-full"
        >
          {heroSlides.map((s, i) => (
            <SwiperSlide key={i}>
              <div
                className="h-full w-full bg-cover bg-center flex items-center"
                style={{
                  backgroundImage: `url(${s.img})`,
                }}
                role="img"
                aria-label={s.title}
              >
                <div className="h-full w-full bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-center">
                  <div className="max-w-6xl mx-auto px-6 lg:px-12">
                    <div className="max-w-xl">
                      <p className="text-sm uppercase tracking-widest mb-3 text-indigo-300">
                        Bekola Technical Solutions
                      </p>
                      <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                        {s.title}
                      </h1>
                      <p className="text-lg text-gray-100 mb-6">{s.sub}</p>

                      <div className="flex flex-wrap gap-3">
                        <button
  onClick={handleApply}
  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-md font-semibold shadow"
>
  Apply for Internship
</button>
                        <a
                          href="#services"
                          className="inline-block border border-white/60 text-white px-5 py-3 rounded-md font-medium hover:bg-white/10"
                        >
                          Explore Services
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </header>

      {/* NEWS / MARQUEE */}
      <section className={`border-y ${borderColor} ${isDark ? "bg-slate-800" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Latest at Bekola</span>
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee whitespace-nowrap flex gap-10 text-sm text-gray-700">
              <span>🚀 Launch: AI-enabled internship projects — 2025 batch.</span>
              <span>🤝 Partnership: Dubai startups collaboration program.</span>
              <span>🔐 New Cyber Security track for colleges.</span>
              <span>📣 Corporate skilling seats open — enquire now.</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS / COUNTERS */}
      <section className={`${cardBg} py-16 md:py-20 text-center`} ref={counterRef}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          {[
            ["Enterprise Clients", 24],
            ["Students Trained", 950],
            ["Internships", 220],
            ["Delivered Projects", 85],
          ].map(([label, value], i) => (
            <div key={i} className="text-center">
              <h3 className="text-4xl md:text-5xl font-extrabold text-indigo-600">
                {mounted && inView ? <CountUp start={0} end={value} duration={2.4} /> : 0}
                <span className="text-xl">+</span>
              </h3>
              <p className={`${mutedText} mt-2 text-base md:text-lg`}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION SLIDER (Teamwork / Collaboration) */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Mission & Approach</h2>

        <div className="relative w-full h-[60vh] md:h-[56vh] rounded-xl overflow-hidden shadow-lg">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            autoplay={{ delay: 3800, disableOnInteraction: false }}
            effect="fade"
            pagination={{ clickable: true }}
            navigation
            loop
            className="h-full w-full"
          >
            {missionSlides.map((m, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className="h-full w-full bg-cover bg-center flex items-center"
                  style={{ backgroundImage: `url(${m.img})` }}
                >
                  <div className="h-full w-full bg-gradient-to-b from-black/45 to-black/25 flex items-center">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">{m.title}</h3>
                      <p className="text-lg text-gray-100">{m.sub}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* SERVICES (target) */}
      <section id="services" className={`${isDark ? "bg-slate-800" : "bg-gray-50"} py-16`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Digital Engineering",
                desc: "Cloud-native platforms, scalable SaaS apps, and automation for enterprise workflows.",
              },
              {
                title: "Cyber Security",
                desc: "Threat assessments, VAPT, secure SDLC guidance and awareness programs.",
              },
              {
                title: "AI & Data",
                desc: "Chatbots, ML pipelines and analytics that turn data into decisions.",
              },
            ].map((c, i) => (
              <div key={i} className={`${cardBg} p-6 rounded-2xl shadow-sm hover:shadow-lg transition`}>
                <h4 className="text-2xl font-semibold text-indigo-600 mb-3">{c.title}</h4>
                <p className={`${mutedText} leading-7`}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS MARQUEE */}
      <section className={`${cardBg} py-12`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold mb-6">Trusted Collaborations</h3>
          <div className="overflow-hidden">
            <div className="animate-marquee whitespace-nowrap flex gap-16 justify-center items-center text-lg font-medium">
              <span>Global Tech Academy</span>
              <span>Dubai Smart Systems</span>
              <span>Kerala Skills Hub</span>
              <span>AI Research Labs</span>
              <span>Future IT Solutions</span>
            </div>
          </div>
        </div>
      </section>

      {/* GROW WITH US FORM */}
      <section className={`${isDark ? "bg-slate-900" : "bg-white"} py-16`}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-3">Grow With Us</h3>
              <p className={`${mutedText} mb-6`}>
                Interested in internships, partnerships, or hiring our trained students? Leave your details and our corporate team will reach out.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• 12-week industry-driven internships</li>
                <li>• Live projects & mentorship</li>
                <li>• Placement assistance & portfolio reviews</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="bg-indigo-50 p-6 rounded-xl shadow-sm">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="w-full p-3 rounded-md mb-3 border"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                className="w-full p-3 rounded-md mb-3 border"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                type="email"
                required
                className="w-full p-3 rounded-md mb-4 border"
              />

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-md font-semibold">
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative w-full h-[70vh] overflow-hidden my-20 rounded-xl shadow-xl">
  <Swiper
    modules={[Autoplay, Pagination, EffectFade]}
    autoplay={{ delay: 4000, disableOnInteraction: false }}
    effect="fade"
    pagination={{ clickable: true }}
    loop
    className="h-full w-full"
  >

    {[
      {
        text: "We engaged Bekola to build our MVP. The team delivered with great quality and communication.",
        author: "Startup Founder — Dubai",
        img: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg"
      },
      {
        text: "The cyber security bootcamp included real attack simulations and hands-on labs — highly recommended for colleges.",
        author: "HOD — Computer Science",
        img: "https://images.pexels.com/photos/3183174/pexels-photo-3183174.jpeg"
      },
      {
        text: "Bekola’s internship simulated real corporate delivery — I shipped production features and learned code reviews.",
        author: "Rohan — Full-Stack Intern",
        img: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
      }
    ].map((slide, i) => (
      <SwiperSlide key={i}>
        <div
          className="h-full w-full bg-cover bg-center flex items-center"
          style={{ backgroundImage: `url(${slide.img})` }}
        >
          <div className="h-full w-full bg-black/50 flex items-center justify-center px-6">
            <div className="max-w-3xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Voices from Our Ecosystem
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed mb-6">
                “{slide.text}”
              </p>
              <p className="text-lg font-semibold text-indigo-300">
                {slide.author}
              </p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    ))}

  </Swiper>
</section>


      {/* INTERNSHIP CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Internship Program 2025</h3>
          <p className="mb-6">Hands-on projects, mentorship and placement guidance — join the next cohort.</p>
          <button
  onClick={handleApply}
  className="inline-block bg-white text-indigo-700 px-6 py-3 rounded-md font-semibold"
>
  Apply for Internship →
</button>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/918921271340"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl text-2xl z-40"
        aria-label="WhatsApp"
      >
        <FaWhatsapp />
      </a>

      {/* Footer */}
      <footer className="text-center py-6 bg-slate-900 text-gray-300">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
            <div>© {new Date().getFullYear()} Bekola Technical Solutions</div>
            <div className="text-sm text-gray-400">Designed for enterprise internships & skilling</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
