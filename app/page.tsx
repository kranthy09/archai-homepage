'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Check, Code, FileText, Zap } from 'lucide-react'
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
          Blueprint once. Generate everywhere. Ship faster with AI that follows your architecture, not random patterns.
        </motion.p>
        <div className="flex justify-center gap-4 mt-8">
          <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-white">Launch Studio</Button>
          <Button
            size="lg"
            variant="outline"
            className="border-cyan-500 text-cyan-400 hover:bg-cyan-900"
            onClick={() => router.push('/docs')}
          >
            View Docs
          </Button>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="w-full bg-slate-900/30 border-y border-slate-800 py-16 mb-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-amber-300 text-transparent bg-clip-text">
            The Problem with AI Code Generation
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Every generation is different',
              'Copy-paste the same context repeatedly',
              'No control over structure or style'
            ].map((problem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="bg-red-500/5 border border-red-500/20 rounded-lg p-6"
              >
                <p className="text-slate-300">{problem}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Developers Who Value */}
      <section className="w-full bg-slate-900/30 border-y border-slate-800 py-16 mb-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-amber-300 text-transparent bg-clip-text">
            Built for Developers Who Value
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Control over code structure',
              'Consistency across projects',
              'Documentation in sync with code',
              'Reusable patterns and templates',
              'Faster project setup (minutes vs hours)',
              'Team alignment and standards'
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-slate-300">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-amber-300 text-transparent bg-clip-text">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FileText className="w-8 h-8" />,
              title: 'Chat to Create Blueprints',
              description: 'Describe your project. Our AI generates three documents: Architecture, Features, and Code Templates.'
            },
            {
              icon: <Code className="w-8 h-8" />,
              title: 'Generate with Any AI',
              description: 'Give blueprints to Claude, GPT, or local models. Get consistent code that matches your preferences every time.'
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: 'Iterate & Scale',
              description: 'Update blueprints, regenerate code. Reuse templates across projects. Onboard teams instantly.'
            }
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500 transition"
            >
              <div className="bg-cyan-500/10 rounded-lg w-14 h-14 flex items-center justify-center mb-4 text-cyan-400">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
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
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-500 transition"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-cyan-400">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Philosophy Section */}
      <section className="text-center max-w-3xl px-6 mb-24">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-amber-300 text-transparent bg-clip-text">
          Developer-Crafted, AI-Assisted
        </h2>
        <p className="text-slate-400 text-lg">
          Archai doesn't just generate code — it teaches how the code thinks. Every structure and feature comes with reasoning and mentorship built in.
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