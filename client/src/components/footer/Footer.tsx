/**
 * @description Pied de page du site SoundWave
 */

import NavItem from "../utils/NavItem";
import "../../assets/styles/Navbar.css";
import footerWaveLeft from "../../assets/images/footerWaveLeft.png";
import footerWaveRight from "../../assets/images/footerWaveRight.png";

const Footer = () => {
    return (
        <div className="fixed bottom-0 w-full flex justify-center">
            <footer className="w-full md:w-[95%] flex items-center justify-between bg-white font-inter py-12 rounded-t-xl">
                <div className="flex items-center space-x-4">
                    <div>
                        <img src={footerWaveLeft} alt="footerWaveLeft" />
                    </div>
                    <div className="flex items-center mt-6 space-x-4">
                        <NavItem text="À PROPOS" href="#" />
                        <NavItem text="CONTACT" href="#" />
                        <NavItem text="AIDE" href="#" />
                        <NavItem text="MENTIONS LEGALES" href="#" />
                    </div>
                </div>
                <div className="hidden lg:flex space-x-6">
                    <div className="mt-6 flex items-center">
                        <p className="text-[#93D9D6]">
                            © 2025 SoundWave - Tous droits réservés.
                        </p>
                    </div>
                    <img src={footerWaveRight} alt="footerWaveRight" />
                </div>
            </footer>
        </div>
    );
};

export default Footer;
