'use client';
import { motion } from 'framer-motion';
import { FaTerminal } from 'react-icons/fa';

export default function TerminalButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-lg border border-blue-500/20
                 hover:bg-black/70 hover:border-blue-500/40 transition-all duration-300 z-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FaTerminal className="w-5 h-5 text-blue-400" />
    </motion.button>
  );
}
