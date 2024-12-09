'use client';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const socialLinks = [
    { href: "https://github.com/Desmet-Lars", icon: FaGithub, label: "GitHub" }
  ];

  return (
    <footer className="py-12 text-center bg-gradient-to-t from-black/40 via-black/20 to-transparent">
      <motion.div
        className="flex justify-center gap-8 mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {socialLinks.map((social, index) => (
          <motion.a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300/70 hover:text-blue-300 transition-all duration-300"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <social.icon className="w-6 h-6" />
            <span className="sr-only">{social.label}</span>
          </motion.a>
        ))}
      </motion.div>
      <motion.p
        className="text-blue-300/50 text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        © 2024 Lars Desmet. All rights reserved.
      </motion.p>
    </footer>
  );
}
