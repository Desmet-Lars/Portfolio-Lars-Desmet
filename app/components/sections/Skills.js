'use client';
import { motion } from 'framer-motion';
import * as SiIcons from 'react-icons/si';
import { TbBrandReactNative } from "react-icons/tb";
import { DiJavascript } from "react-icons/di";

export default function Skills() {
  const skills = [
    { name: 'React', iconName: 'SiReact', color: 'text-cyan-400' },
    { name: 'React Native', icon: TbBrandReactNative, color: 'text-cyan-400' },
    { name: 'HTML', iconName: 'SiHtml5', color: 'text-orange-500' },
    { name: 'CSS', iconName: 'SiCss3', color: 'text-blue-500' },
    { name: 'JavaScript', icon: DiJavascript, color: 'text-yellow-400' },
    { name: 'JSX', iconName: 'SiReact', color: 'text-blue-400' },
    { name: 'Git', iconName: 'SiGit', color: 'text-red-400' },
    { name: 'Next.js', iconName: 'SiNextdotjs', color: 'text-white' },
    { name: 'Python', iconName: 'SiPython', color: 'text-blue-400' },
    { name: 'Tailwind CSS', iconName: 'SiTailwindcss', color: 'text-cyan-400' },
    { name: 'Firebase', iconName: 'SiFirebase', color: 'text-yellow-500' },
    { name: 'MongoDB', iconName: 'SiMongodb', color: 'text-green-500' }
  ];

  return (
    <section className="min-h-screen py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-black/40 via-black/20 to-black/40">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <motion.h2
          className="text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Skills & Expertise
          </span>
        </motion.h2>

        <motion.p
          className="text-blue-200/70 text-center mb-16 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Technologies I work with
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          {skills.map((skill, index) => {
            const Icon = skill.icon || SiIcons[skill.iconName];
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-sm rounded-xl p-6 border border-blue-400/10 hover:border-blue-400/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                <motion.div
                  className="relative flex flex-col items-center gap-4"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {Icon && <Icon className={`w-12 h-12 ${skill.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />}
                  <span className="text-blue-200/90 font-medium group-hover:text-blue-200 transition-colors duration-300">
                    {skill.name}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
