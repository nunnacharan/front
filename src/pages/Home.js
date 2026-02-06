import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Navbar */}
      <nav className="px-10 py-6 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">
          Cloud Drive
        </h1>
      </nav>

      {/* Split Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* LEFT – Content */}
        <div>
          <h2 className="text-5xl font-bold leading-tight mb-6">
            A smarter way to
            <span className="text-blue-600"> manage files</span>
          </h2>

          <p className="text-gray-600 text-lg mb-10 max-w-lg">
            Cloud Drive is a secure cloud storage platform inspired by Google Drive,
            designed to store, upload, and manage files with simplicity and security.
          </p>

          <div className="flex gap-5">
            <button
              onClick={() => nav("/login")}
              className="bg-blue-600 text-white px-10 py-3 rounded-xl font-semibold
                         hover:bg-blue-700 transition"
            >
              Get Started
            </button>

            <button
              onClick={() => nav("/register")}
              className="border border-gray-300 px-10 py-3 rounded-xl
                         hover:bg-gray-100 transition"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* RIGHT – Visual Grid */}
        <div className="grid grid-cols-2 gap-6">

          <FeatureCard
            title="Cloud Storage"
            desc="Securely store files in the cloud"
          />

          <FeatureCard
            title="Fast Uploads"
            desc="Upload files with minimal latency"
          />

          <FeatureCard
            title="Access Anywhere"
            desc="Use from any device, anytime"
          />

          <FeatureCard
            title="AWS Powered"
            desc="Reliable & scalable infrastructure"
          />
        </div>
      </section>

      {/* Secondary Section */}
      <section className="bg-white border-t py-20">
        <div className="max-w-6xl mx-auto px-6">

          <h3 className="text-3xl font-bold text-center mb-14">
            Built for reliability and simplicity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <MiniFeature title="Secure Authentication">
              Protects user data and files
            </MiniFeature>

            <MiniFeature title="Clean Interface">
              Google Drive–inspired design
            </MiniFeature>

            <MiniFeature title="Scalable Backend">
              Built using AWS & Node.js
            </MiniFeature>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        © 2026 Cloud Drive. Enterprise-ready cloud storage solution.
      </footer>
    </div>
  );
}

/* Feature Card */
function FeatureCard({ title, desc }) {
  return (
    <div
      className="
        group bg-white border border-gray-200 rounded-xl p-6 
        shadow-sm transition-all duration-300
        hover:shadow-md hover:border-blue-500 hover:-translate-y-1
      "
    >
      <h4 className="text-lg font-semibold mb-2 text-blue-600">
        {title}
      </h4>

      <p className="text-sm text-gray-600 mb-3">
        {desc}
      </p>

      {/* Hover-only content */}
      <div
        className="
          opacity-0 max-h-0 overflow-hidden
          group-hover:opacity-100 group-hover:max-h-40
          transition-all duration-300
        "
      >
        <p className="text-sm text-gray-500 mb-2">
          Designed to provide a seamless and reliable experience similar to
          enterprise cloud storage platforms.
        </p>

        <span className="text-sm text-blue-600 font-medium">
          Learn more →
        </span>
      </div>
    </div>
  );
}

/* Mini Feature */
function MiniFeature({ title, children }) {
  return (
    <div
      className="
        group text-center p-6 rounded-xl
        hover:bg-gray-50 transition
      "
    >
      <h4 className="text-xl font-semibold mb-2 text-blue-600">
        {title}
      </h4>

      <p className="text-gray-600 text-sm">
        {children}
      </p>

      <p
        className="
          mt-2 text-xs text-gray-500 opacity-0
          group-hover:opacity-100 transition
        "
      >
        Optimized for scalability and performance
      </p>
    </div>
  );
}

