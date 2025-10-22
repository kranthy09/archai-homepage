'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center mt-24 mb-20 px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-amber-300 text-transparent bg-clip-text"
        >
          AI Architect for Full-Stack Development
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-lg text-slate-300"
        >
          Archai thinks structurally, writes features intelligently, and mentors developers to build software the right way.
        </motion.p>
        <div className="flex justify-center gap-4 mt-8">
          <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-white">Launch Studio</Button>
          <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-900" onClick={() => router.push('/docs')}>View Docs</Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-10 max-w-6xl mb-24">
        {[
          { icon: '🏗️', title: 'Structure Agent', desc: 'Generates STRUCTURE.md — your intelligent system blueprint.' },
          { icon: '🧠', title: 'Feature Agent', desc: 'Writes FEATURES.md with clear, reasoned functionality flow.' },
          { icon: '💻', title: 'Template Agent', desc: 'Scaffolds code templates for frontend and backend instantly.' },
          { icon: '🔍', title: 'Review Agent', desc: 'Analyzes and validates architectural consistency automatically.' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500 transition">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-cyan-400">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Philosophy Section */}
      <section className="text-center max-w-3xl px-6 mb-24">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-amber-300 text-transparent bg-clip-text">
          Built by Developers, Mentored by AI
        </h2>
        <p className="text-slate-400 text-lg">
          Archai doesn’t just generate code — it teaches how the code thinks. Every structure and feature comes with reasoning and mentorship built in.
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 py-6 text-center text-slate-500">
        Archai.in © 2025 — Think. Structure. Build.<br />
        Made with 🧠 and ❤️ by Kranthi Kumar.
      </footer>
    </main>
  )
}
