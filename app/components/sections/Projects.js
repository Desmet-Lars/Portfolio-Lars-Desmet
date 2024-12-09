'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaGithub, FaStar, FaCodeBranch, FaClock } from 'react-icons/fa';

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get('https://api.github.com/users/Desmet-Lars/repos');
        // Sort repos by creation date (most recent first)
        const sortedRepos = response.data.sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );
        setRepos(sortedRepos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const visibleRepos = showAll ? repos : repos.slice(0, 6);

  return (
    <section id="projects" className="py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-black/40 via-black/20 to-black/40">
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
            Projects
          </span>
        </motion.h2>

        <motion.p
          className="text-blue-200/70 text-center mb-16 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          My GitHub Repositories
        </motion.p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-400/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {visibleRepos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-sm rounded-xl p-6 border border-blue-400/10 hover:border-blue-400/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-blue-200 group-hover:text-blue-100 transition-colors">
                        {repo.name}
                      </h3>
                      <motion.a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400/60 hover:text-blue-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaGithub className="w-5 h-5" />
                      </motion.a>
                    </div>

                    <p className="text-blue-200/70 mb-6 line-clamp-2 h-12">
                      {repo.description || "No description available"}
                    </p>

                    {repo.language && (
                      <span className="inline-block px-3 py-1 mb-4 text-sm bg-blue-500/10 text-blue-300 rounded-full border border-blue-400/20">
                        {repo.language}
                      </span>
                    )}

                    <div className="flex justify-between text-sm text-blue-300/60">
                      <span className="flex items-center gap-2">
                        <FaStar className="text-yellow-400/70" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaCodeBranch className="text-blue-400/70" />
                        {repo.forks_count}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaClock className="text-green-400/70" />
                        {new Date(repo.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {repos.length > 9 && (
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <motion.button
                  onClick={() => setShowAll(!showAll)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg text-blue-300
                           border border-blue-400/20 hover:border-blue-400/50 backdrop-blur-sm transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative">{showAll ? 'Show Less' : 'Show More'}</span>
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </section>
  );
}
