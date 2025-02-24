/**
 * @description Pied de page du site SoundWave
 * @author SoundWave
 */

import NavItem from "../utils/NavItem";
import "../../assets/styles/Navbar.css";
import footerWaveLeft from "../../assets/images/footerWaveLeft.png";
import footerWaveRight from "../../assets/images/footerWaveRight.png";

const Footer = () => {
    return (
        <div className="fixed bottom-0 w-full flex justify-center">
            <footer className="w-full md:w-[95%] flex flex-col md:flex-row items-center justify-between bg-white font-inter py-6 md:py-12 md:rounded-t-xl">
                
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <img src={footerWaveLeft} alt="footerWaveLeft" className="hidden md:block" />
                    
                    <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2">
                        <NavItem text="À PROPOS" href="#" />
                        <NavItem text="CONTACT" href="#" />
                        <NavItem text="AIDE" href="#" />
                        <NavItem text="MENTIONS LÉGALES" href="#" />
                    </div>
                </div>

                <div className="hidden lg:flex space-x-6">
                    <p className="text-[#93D9D6] mt-8">© 2025 SoundWave - Tous droits réservés.</p>
                    <img src={footerWaveRight} alt="footerWaveRight" />
                </div>

                <div className="lg:hidden text-center mt-4 text-[#93D9D6]">
                    © 2025 SoundWave - Tous droits réservés.
                </div>
            </footer>
        </div>
    );
};

export default Footer;
