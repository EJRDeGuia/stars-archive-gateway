
import { GraduationCap, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-dlsl-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Logo and Description */}
          <div className="md:col-span-5">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-8 w-8 mr-2" />
              <h3 className="text-2xl font-bold">STARS</h3>
            </div>
            <p className="text-white/90 mb-6 max-w-md">
              Smart Thesis Archival and Retrieval System (STARS) - A modern
              platform for thesis management at De La Salle Lipa. Enabling students, 
              faculty, and researchers to discover academic knowledge.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-dlsl-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-dlsl-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-dlsl-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white transition-colors hover:underline">
                  About STARS
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white transition-colors hover:underline">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/80 hover:text-white transition-colors hover:underline">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-white/80 hover:text-white transition-colors hover:underline">
                  User Guide
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white transition-colors hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white transition-colors hover:underline">
                  Research Format
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-white transition-colors hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white/90">
                  De La Salle Lipa<br />
                  Learning Resource Center<br />
                  Lipa City, Batangas
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <a 
                  href="tel:+6343123456" 
                  className="text-white/90 hover:text-white transition-colors hover:underline"
                >
                  (043) 123-4567
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <a 
                  href="mailto:lrc@dlsl.edu.ph" 
                  className="text-white/90 hover:text-white transition-colors hover:underline"
                >
                  lrc@dlsl.edu.ph
                </a>
              </li>
              <li className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <a 
                  href="https://www.dlsl.edu.ph" 
                  className="text-white/90 hover:text-white transition-colors hover:underline"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  www.dlsl.edu.ph
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
          <p>© 2025 De La Salle Lipa - Learning Resource Center. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
