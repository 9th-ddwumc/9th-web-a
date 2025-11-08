import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="flex items-center justify-between px-4 py-2 bg-[#171717] text-white">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} jiwon. All rights reserved.
      </p>

      <div className="flex items-center gap-4 text-sm">
        <Link to="#" className="hover:text-gray-300 transition-colors">
          Privacy Policy
        </Link>
        <Link to="#" className="hover:text-gray-300 transition-colors">
          Terms of Service
        </Link>
        <Link to="#" className="hover:text-gray-300 transition-colors">
          Contact
        </Link>
      </div>
    </footer>
  );
};

export default Footer;