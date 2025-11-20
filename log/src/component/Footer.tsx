import { Link } from "react-router-dom";

const Footer = () => { 
  return (
    <footer className="bg-black border-t border-gray-800 py-6 mt-12">
      <div className="container mx-auto text-center text-gray-400">
        <p className="mb-4">
          &copy; {new Date().getFullYear()} 돌려돌려LP판. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6">
          <Link to="#" className="hover:text-pink-500 transition-colors text-sm">
            Privacy Policy
          </Link>
          <Link to="#" className="hover:text-pink-500 transition-colors text-sm">
            Terms of Service
          </Link>
          <Link to="#" className="hover:text-pink-500 transition-colors text-sm">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;