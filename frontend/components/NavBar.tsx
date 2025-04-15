import logoImage from "../assets/logo-nav.png";
import Image from "next/image";

export const NavBar = () => {
    return (
        <div className="bg-black">
    <div className="max-w-screen-xl mx-auto w-full px-4">
        <div className="py-4 flex items-center justify-between">
            <div className="relative">
                 <Image
                   src={logoImage}
                   alt="Logo"
                   className="w-45 mt-2"
                 />
                 </div>
        <nav className="flex gap-9 items-center">
            <a href="#" className="text-white/60 hover:text-white/100 transition">
                About
            </a>
            <a href="#" className="text-white/60 hover:text-white/100 transition">
                Features
            </a>
            <a href="#" className="text-white/60 hover:text-white/100 transition">
                Updates
            </a>
            <a href="#" className="text-white/60 hover:text-white/100 transition">
                Sheets
            </a>
           
            <button className="bg-white py-2 px-4 rounded-lg"> Sign In</button>
        </nav>
        
    </div>
    </div>
    </div>
)}

export default NavBar;