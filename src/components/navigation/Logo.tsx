import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/b9245872-2c89-4c1b-91eb-8e2ea38da7fd.png" 
        alt="Technikaz" 
        className="h-6 w-auto sm:h-8 hover:opacity-80 transition-opacity"
      />
    </Link>
  );
}