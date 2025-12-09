import { Link } from "react-router-dom";
import { useState } from "react";
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

function Home() {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [isDark, setIsDark] = useState(false);
  const { ref: counterRef, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Our corporate team will contact you shortly.");
    setForm({ name: "", phone: "", email: "" });
  };

  const pageBg = isDark ? "bg-slate-950 text-gray-50" : "bg-white text-gray-900";
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const mutedText = isDark ? "text-gray-300" : "text-gray-600";
  const borderColor = isDark ? "border-slate-800" : "border-slate-200";

  return (
    <div className={`${pageBg} min-h-screen font-sans`}>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed z-40 bottom-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full shadow-xl bg-white/90 text-slate-900 hover:bg-slate-100"
      >
        {isDark ? <FiSun /> : <FiMoon />}
        <span className="text-sm font-medium">{isDark ? "Light mode" : "Dark mode"}</span>
      </button>

      {/* HERO SLIDER */}
      <div className="relative w-full h-[85vh] overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          effect="fade"
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-full w-full"
        >
          {[
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
              title: "AI and Automation at Enterprise Scale",
              sub: "Transforming business processes with intelligent automation.",
              img: "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg",
            },
            {
              title: "Future-Ready Engineering Workforce",
              sub: "Training and deploying the next generation of engineers.",
              img: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
            },
          ].map((slide, i) => (
            <SwiperSlide key={i}>
              <div
                className="h-full w-full bg-cover bg-center flex items-center"
                style={{ backgroundImage: `url(${slide.img})` }}
              >
                <div className="h-full w-full bg-black/45 flex items-center">
                  <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="max-w-xl">
                      <p className="text-sm uppercase tracking-[0.25em] text-blue-300 mb-3">
                        Bekola Technical Solutions
                      </p>
                      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-lg text-gray-100 mb-8">{slide.sub}</p>
                      <div className="flex flex-wrap gap-4">
                        <Link
                          to="/auth/signup"
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold text-sm shadow"
                        >
                          Get Internship Access
                        </Link>
                        <a
                          href="#services"
                          className="border border-white/70 hover:bg-white/10 text-white px-6 py-3 rounded-md font-semibold text-sm"
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
      </div>

      {/* NEWS BAR */}
      <section
        className={`border-y ${borderColor} ${
          isDark ? "bg-slate-900" : "bg-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-500">
            Latest at Bekola
          </span>
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee flex gap-10 text-sm">
              <span>🚀 Bekola launches AI-enabled internship projects for 2025 batch.</span>
              <span>🤝 Partnering with Dubai startups for enterprise products.</span>
              <span>🔐 New Cyber Security research & training division launched.</span>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTERS */}
      <section className={`${cardBg} py-16 md:py-20 text-center`} ref={counterRef}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {[
            ["Enterprise Clients", 24],
            ["Students Trained", 950],
            ["Internships", 220],
            ["Delivered Projects", 85],
          ].map(([label, value], i) => (
            <div key={i} className="text-center">
              <h3 className="text-4xl md:text-5xl font-extrabold text-blue-500">
                {inView ? <CountUp start={0} end={value} duration={2.4} /> : 0}+
              </h3>
              <p className={`${mutedText} mt-2 text-base md:text-lg`}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
        <p className={`${mutedText} text-lg md:text-xl leading-9 max-w-4xl mx-auto`}>
          Bekola exists to build a{" "}
          <span className="text-blue-500 font-semibold">digital-first, industry-ready workforce</span>.
          We combine enterprise engineering, research innovation and structured corporate-grade training
          to power global careers and business outcomes.
        </p>
      </section>

      {/* SERVICES */}
      <section id="services" className={`${isDark ? "bg-slate-900" : "bg-gray-100"} py-20`}>
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Core Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
          {[
            {
              title: "Digital Engineering",
              body: "Cloud-native platforms, automation, dashboards and SaaS deployments.",
            },
            {
              title: "Cyber Security",
              body: "Threat analysis, VAPT, ethical hacking and institutional awareness programs.",
            },
            {
              title: "AI & Data Innovation",
              body: "Chatbots, analytics engines and machine learning decision systems.",
            },
          ].map((card, i) => (
            <div key={i} className={`${cardBg} p-8 rounded-2xl shadow hover:shadow-xl transition`}>
              <h3 className="text-2xl font-semibold text-blue-500 mb-3">{card.title}</h3>
              <p className={`${mutedText} leading-7`}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERS */}
      <section className={`${cardBg} py-14 overflow-hidden`}>
        <h2 className="text-3xl font-bold mb-8 text-center">Trusted Collaborations</h2>
        <div className="flex items-center gap-16 animate-marquee whitespace-nowrap text-lg md:text-2xl font-semibold opacity-80">
          <span>Global Tech Academy</span>
          <span>Dubai Smart Systems</span>
          <span>Kerala Skills Hub</span>
          <span>AI Research Labs</span>
          <span>Future IT Solutions</span>
        </div>
      </section>

      {/* ---- NEW SECTION ADDED HERE ---- */}
      {/* GROW WITH US */}
      <section className={`${isDark ? "bg-slate-950" : "bg-blue-50"} py-20`}>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Grow With Us</h2>
        <p className={`${mutedText} text-center mb-10 max-w-2xl mx-auto text-lg`}>
          Whether you're a student, corporate professional or institution, Bekola welcomes
          collaborations that create value and innovation.
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-10 rounded-2xl shadow-xl bg-white/80 backdrop-blur border border-slate-200 space-y-6"
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full p-3 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Submit
          </button>
        </form>
      </section>
      {/* ---- END OF NEW SECTION ---- */}

      {/* TESTIMONIALS */}
      <section className={`${cardBg} py-20`}>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Voices from Our Ecosystem
        </h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500 }}
          pagination={{ clickable: true }}
          loop
          className="max-w-4xl mx-auto"
        >
          {[
            [
              "Bekola’s internship felt like real corporate work — standups, deployments and mentorship.",
              "— Rohan, Full-Stack Intern",
            ],
            [
              "We partnered with Bekola to build an MVP. They delivered weeks ahead of schedule.",
              "— Startup Founder, Dubai",
            ],
            [
              "Cyber Security bootcamp helped our students understand live attack simulations.",
              "— HOD, Computer Science Dept.",
            ],
          ].map(([text, name], i) => (
            <SwiperSlide key={i}>
              <div
                className={`p-10 rounded-2xl shadow-md text-center text-lg leading-relaxed ${
                  isDark ? "bg-slate-900" : "bg-gray-50"
                }`}
              >
                <p className={mutedText}>{text}</p>
                <p className="mt-4 font-semibold text-blue-500">{name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* INTERNSHIP CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-5">Internship Program 2025</h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed text-blue-100">
          Work on live products, AI systems and secure platforms — guided directly by Bekola engineers.
        </p>
        <Link
          to="/auth/signup"
          className="bg-white text-blue-700 font-semibold px-10 py-4 rounded-lg text-lg shadow hover:shadow-xl transition"
        >
          Apply for Internship →
        </Link>
      </section>

      {/* WHATSAPP */}
      <a
        href="https://wa.me/918921271340"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl text-3xl hover:bg-green-600 transition z-40"
      >
        <FaWhatsapp />
      </a>

      {/* FOOTER */}
      <footer className="text-center py-6 bg-slate-900 text-gray-300 text-sm tracking-wide">
        © {new Date().getFullYear()} Bekola Technical Solutions • All Rights Reserved
      </footer>
    </div>
  );
}

export default Home;
