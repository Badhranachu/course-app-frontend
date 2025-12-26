// src/pages/Home.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { FaWhatsapp } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Home.css";   // 👈 THIS links the CSS


import { useAuth } from "../contexts/AuthContext";
import loadingImg from "../assets/loading.png";

/* ----------------------------------
   Image preloader (NECESSARY)
---------------------------------- */
const preloadImages = (urls = []) =>
  Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        })
    )
  );

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  const { ref: counterRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.25,
  });

  /* ----------------------------------
     SLIDES DATA (unchanged)
  ---------------------------------- */
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

  const missionSlides = [
    {
      title: "Building an Industry-Ready Workforce",
      sub: "Bridging academia and real corporate engineering with hands-on projects.",
      img: "https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg",
    },
    {
      title: "Cross-functional Collaboration",
      sub: "We embed students into product teams and teach real-world collaboration.",
      img: "https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg",
    },
    {
      title: "Mentorship & Real Deliverables",
      sub: "Mentored internships, code reviews, and production-like delivery cycles.",
      img: "https://images.pexels.com/photos/3182826/pexels-photo-3182826.jpeg",
    },
  ];

  const testimonialImages = [
    "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg",
    "https://images.pexels.com/photos/3183174/pexels-photo-3183174.jpeg",
    "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
  ];
  const [showText, setShowText] = useState(false);

  const handleApply = () =>
    user ? navigate("/dashboard") : navigate("/auth/signup");


  const pageBg = isDark ? "bg-slate-900 text-gray-50" : "bg-white text-gray-900";
  const cardBg = isDark ? "bg-slate-800" : "bg-white";
  const mutedText = isDark ? "text-gray-300" : "text-gray-600";
  const borderColor = isDark ? "border-slate-700" : "border-slate-200";

const [form, setForm] = useState({
  full_name: "",
  phone: "",
  email: "",
});

const [message, setMessage] = useState("");

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setMessage("");

  try {
    const res = await fetch("/api/grow-with-us/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setForm({ full_name: "", phone: "", email: "" });
    }
  } catch {
    setMessage("Something went wrong. Please try again.");
  } finally {
    setSubmitting(false);
  }
};


  /* ----------------------------------
     LOAD EVERYTHING FIRST
  ---------------------------------- */
  useEffect(() => {
  const loadAll = async () => {
    const allImages = [
      ...heroSlides.map((s) => s.img),
      ...missionSlides.map((m) => m.img),
      ...testimonialImages,
    ];

    // 1st second → logo only
    setTimeout(() => setShowText(true), 1000);

    // Minimum 2 seconds loader + image preload
    await Promise.all([
      preloadImages(allImages),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);

    setMounted(true);
    setLoading(false);
  };

  loadAll();
}, []);





  /* ----------------------------------
     LOADING SCREEN
  ---------------------------------- */
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <img
          src={loadingImg}
          alt="Loading"
          className="w-40 md:w-56 animate-pulse"
        />
        <p className="mt-6 text-gray-500 text-sm tracking-wide">
          {/* Loading experience... */}
        </p>
      </div>
    );
  }

  /* ----------------------------------
     HANDLERS
  ---------------------------------- */
  


  return (
    <div className={`${pageBg} min-h-screen font-sans`}>
      {/* Theme toggle
      <button
        onClick={() => setIsDark((s) => !s)}
        className="fixed z-40 bottom-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg bg-white/90 dark:bg-slate-800 dark:text-gray-100"
        aria-label="Toggle theme"
      >
        {isDark ? <FiSun /> : <FiMoon />}
        <span className="text-sm font-medium">{isDark ? "Light" : "Dark"}</span>
      </button> */}

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
                      <p className="text-sm uppercase tracking-widest mb-3 text-white-300" style={{color:"grey"}}>
                        Nexston Corporations Pvt Ltd
                      </p>
                      <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                        {s.title}
                      </h1>
                      <p className="text-lg text-gray-100 mb-6">{s.sub}</p>

                      <div className="flex flex-wrap gap-3">
                        {/* <button
  onClick={handleApply}
  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-md font-semibold shadow"
>
  Apply for Internship
</button> */}
                        <a
  href="#services"
  className="inline-block px-5 py-3 rounded-md font-medium text-white"
  style={{ backgroundColor: "rgb(67 56 202)" }}
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
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Latest at Nexston</span>
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
        <h2 className="mission text-3xl md:text-4xl font-bold mb-6 text-center">Our Mission & Approach</h2>
        {/* <h2 className="hai">hai</h2> */}

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
              <span>Kerala Startup Mission</span>
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

            <form
  onSubmit={handleSubmit}
  className="bg-indigo-50 p-6 rounded-xl shadow-sm"
>
  <input
    name="full_name"
    value={form.full_name}
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

  <button
  type="submit"
  disabled={submitting}
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-md font-semibold disabled:opacity-50"
>
  {submitting ? "Submitting..." : "Submit"}
</button>

  {message && (
    <p className="mt-3 text-sm text-center text-indigo-700">
      {message}
    </p>
  )}
</form>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {/* <section className="relative w-full h-[70vh] overflow-hidden my-20 rounded-xl shadow-xl">
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
        text: "We engaged Nexston to build our MVP. The team delivered with great quality and communication.",
        author: "Startup Founder — Dubai",
        img: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg"
      },
      {
        text: "The cyber security bootcamp included real attack simulations and hands-on labs — highly recommended for colleges.",
        author: "HOD — Computer Science",
        img: "https://images.pexels.com/photos/3183174/pexels-photo-3183174.jpeg"
      },
      {
        text: "Nexston’s internship simulated real corporate delivery — I shipped production features and learned code reviews.",
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
</section> */}


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
  href="https://wa.me/8547182997?text=Hi%20%0AI%20am%20interested%20in%20your%20course%20/%20internship.%0ACould%20you%20please%20share%20more%20details?"
  target="_blank"
  rel="noreferrer"
  className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl text-2xl z-40"
  aria-label="WhatsApp"
>
  <FaWhatsapp />
</a>
      {/* Footer */}
<footer className="bg-slate-900 text-gray-300">
  <div className="max-w-7xl mx-auto px-6 py-10">
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

      {/* Company Info */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">
          Nexston Corporations Pvt Ltd
        </h4>
        <p className="text-sm text-gray-400 leading-relaxed">
          Enterprise technology solutions, digital engineering, and
          industry-ready skilling programs.
        </p>
      </div>

      {/* Address */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">
          Corporate Office
        </h4>
        <p className="text-sm text-gray-400 leading-relaxed">
          Kochi, Kerala, India <br />
          Email: <a href="mailto:info@nexston.in" className="hover:text-white">info@nexston.in</a> <br />
          Phone: <a href="tel:+918921271340" className="hover:text-white">+91 89212 71340</a>
        </p>
      </div>

      {/* Social Links */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">
          Connect With Us
        </h4>

        <div className="flex items-center gap-5 text-xl">

          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-pink-500 transition"
            aria-label="Instagram"
          >
<i className="fa-brands fa-instagram"></i>
          </a>

          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-500 transition"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f" />
          </a>

          <a
            href="https://x.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition"
            aria-label="X"
          >
            <i className="fab fa-x-twitter" />
          </a>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-400 transition"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
      </div>

    </div>

    {/* Bottom Bar */}
    <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-gray-400">
      © {new Date().getFullYear()} Nexston Corporations Pvt Ltd. All rights reserved.
    </div>

  </div>
</footer>
    </div>
  );
}

export default Home;
