'use client';

import { Mail, Github, Linkedin, Twitter, Brain } from 'lucide-react';

export function Footer() {
  return (
    <footer id="about" className="relative overflow-hidden bg-transparent border-t-4 border-primary py-16 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 shadow-[8px_8px_0_0_#da100c] relative">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-black dark:text-white" />
              </div>
              <span className="font-black text-xl text-black dark:text-white uppercase tracking-widest">ResearchMap</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
              Command center for research raids. Scout gaps, map opportunities, and stack insights faster.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-black text-black dark:text-white mb-6 uppercase tracking-wider text-lg">System</h4>
            <ul className="space-y-4">
              <li>
                <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary transition font-bold uppercase tracking-wide text-sm flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-4" />
                  Features
                </a>
              </li>
              <li>
                <a href="#hero-search" className="text-gray-600 dark:text-gray-400 hover:text-primary transition font-bold uppercase tracking-wide text-sm flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-4" />
                  Explore
                </a>
              </li>
              <li>
                <a href="/api/semantic-scholar?topic=machine%20learning" className="text-gray-600 dark:text-gray-400 hover:text-primary transition font-bold uppercase tracking-wide text-sm flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-4" />
                  API
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-primary transition font-bold uppercase tracking-wide text-sm flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-4" />
                  Mission Flow
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-black text-black dark:text-white mb-6 uppercase tracking-wider text-lg">Network</h4>
            <ul className="space-y-4">
              <li>
                <a href="#about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition font-bold uppercase tracking-wide text-sm flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-4" />
                  About
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary transition font-bold uppercase tracking-wide text-sm flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-4" />
                  Solutions
                </a>
              </li>
              <li>
                <a href="mailto:hello@researchmap.ai" className="text-gray-600 dark:text-gray-400 hover:text-primary transition font-bold uppercase tracking-wide text-sm flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-4" />
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-black text-black dark:text-white mb-6 uppercase tracking-wider text-lg">Legal</h4>
            <ul className="space-y-4">
              <li>
                <a href="#about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition font-bold uppercase tracking-wide text-sm flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-4" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition font-bold uppercase tracking-wide text-sm flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-primary transition-all group-hover:w-4" />
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-8 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-primary rotate-45" />
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Credit */}
          <p className="text-gray-500 dark:text-gray-500 text-sm font-medium text-center sm:text-left">
            Powered by <span className="text-secondary font-bold">Semantic Scholar</span> •{' '}
            <span className="text-black dark:text-white">© 2026 Research Tracker</span>
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a href="#" className="w-10 h-10 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex items-center justify-center hover:border-primary hover:text-primary text-gray-600 dark:text-gray-400 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex items-center justify-center hover:border-primary hover:text-primary text-gray-600 dark:text-gray-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex items-center justify-center hover:border-primary hover:text-primary text-gray-600 dark:text-gray-400 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black flex items-center justify-center hover:border-primary hover:text-primary text-gray-600 dark:text-gray-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
