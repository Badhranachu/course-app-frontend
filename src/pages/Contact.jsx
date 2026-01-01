import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-6 py-16">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Contact Nexston
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We help businesses and institutions with reliable, scalable, and
            modern IT solutions. Reach out to discuss your requirements.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl p-10">

          {/* LEFT – CONTACT INFO */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Get in Touch
            </h2>

            <p className="text-slate-600 mb-8">
              Whether you need software development, IT consulting, automation,
              cloud solutions, or internship programs, our team is ready to
              assist you.
            </p>

            <div className="space-y-6 text-slate-700">

              <div className="flex items-start gap-4">
                <FiMail className="text-indigo-600 text-xl mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p>info@nexston.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiPhone className="text-indigo-600 text-xl mt-1" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p>+91 9XXXXXXXXX</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FiMapPin className="text-indigo-600 text-xl mt-1" />
                <div>
                  <p className="font-semibold">Office</p>
                  <p>
                    Nexston Technologies<br />
                    Kerala, India
                  </p>
                </div>
              </div>
            </div>

            {/* SERVICES LIST */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Our IT Services
              </h3>
              <ul className="grid grid-cols-2 gap-y-2 text-slate-600 text-sm">
                <li>• Web Development</li>
                <li>• Backend & APIs</li>
                <li>• Cloud & DevOps</li>
                <li>• Automation & Bots</li>
                <li>• AI Solutions</li>
                <li>• Internship Programs</li>
              </ul>
            </div>
          </div>

          {/* RIGHT – CONTACT FORM */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Send Us a Message
            </h2>

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Project / Service / Inquiry"
                  className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  rows="5"
                  placeholder="Tell us about your requirement..."
                  className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;
