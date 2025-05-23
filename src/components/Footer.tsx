
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dlsl-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center mb-4">
              <GraduationCap className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-bold">STARS</h3>
            </div>
            <p className="text-sm text-white/80 mb-4">
              Smart Thesis Archival and Retrieval System (STARS) - A modern
              platform for thesis management at De La Salle Lipa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-white/80 hover:text-white transition-colors">
                  About STARS
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-white/80 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-white/80 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-white/80">
                De La Salle Lipa
              </li>
              <li className="text-sm text-white/80">
                Learning Resource Center
              </li>
              <li className="text-sm text-white/80">
                Lipa City, Batangas
              </li>
              <li>
                <a 
                  href="mailto:lrc@dlsl.edu.ph" 
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Email: lrc@dlsl.edu.ph
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
          © 2025 De La Salle Lipa - Learning Resource Center. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
