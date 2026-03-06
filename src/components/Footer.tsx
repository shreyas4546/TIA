import { Github, Twitter, Linkedin, Mail, ShieldCheck } from "lucide-react";

import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#0B0F19] border-t border-brand-border pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">Tia</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering individuals and businesses with AI-driven financial intelligence for smarter money decisions.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-accent-purple transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-blue transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-cyan transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link to="/#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</Link></li>
              <li><Link to="/#insights" className="text-gray-400 hover:text-white transition-colors text-sm">AI Insights</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">Dashboard</Link></li>
              <li><Link to="/dashboard#assistant" className="text-gray-400 hover:text-white transition-colors text-sm">Smart Assistant</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Tia Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" /> support@tia.example.com
          </div>
        </div>
      </div>
    </footer>
  );
}
