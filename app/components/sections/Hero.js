'use client';
import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-black/20 via-black/10 to-black/30">
      <div className="text-center max-w-4xl mx-auto relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 blur-3xl -z-10 rounded-full transform scale-150"></div>

        <motion.h1
          className="text-7xl md:text-8xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
            Lars
          </span>{" "}
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400">
            Desmet
          </span>
        </motion.h1>

        <motion.p
          className="text-2xl md:text-3xl text-blue-200/80 font-light tracking-wide mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Full Stack Developer
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.button
            onClick={() => scrollToSection('projects')}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white font-medium
                     overflow-hidden shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative">View Projects</span>
          </motion.button>

          <motion.button
            onClick={() => scrollToSection('contact')}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg text-blue-300
                     border border-blue-400/20 hover:border-blue-400/50 backdrop-blur-sm transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative">Contact Me</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
