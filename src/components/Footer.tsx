'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Globe, Github, Linkedin, Twitter, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from '@/contexts/AdminContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { siteConfig } = useAdmin();
  const footer = siteConfig.footer;

  return (
    <footer className="bg-slate-950 text-gray-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              {footer.companyName}
            </h3>
            <p className="text-gray-400 mb-4">{footer.description}</p>
            <div className="flex gap-4">
              <a
                href={footer.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={footer.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={footer.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-400 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              {footer.sections.products.title}
            </h4>
            <ul className="space-y-2">
              {footer.sections.products.links.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-purple-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/store"
                  className="flex items-center gap-1 text-purple-400 hover:text-pink-400 transition-colors font-semibold"
                >
                  <ShoppingBag className="w-4 h-4" />
                  View All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              {footer.sections.company.title}
            </h4>
            <ul className="space-y-2">
              {footer.sections.company.links.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-purple-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${footer.contact.email}`}
                  className="hover:text-purple-400 transition-colors"
                >
                  {footer.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{footer.contact.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>{footer.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} {footer.companyName}. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Globe className="w-4 h-4" />
              <span>{footer.bottomText}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
