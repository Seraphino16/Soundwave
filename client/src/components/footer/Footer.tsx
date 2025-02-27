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
        <div className="bottom-0 w-full flex justify-center">
            <div className="w-full md:w-[95%] flex flex-col md:flex-row items-center justify-between">
                <footer className="w-full bg-white font-inter py-6 md:py-12 md:rounded-t-xl flex flex-col md:flex-row items-center justify-between">
                    <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                        <img
                            src={footerWaveLeft}
                            alt="footerWaveLeft"
                            className="hidden md:block"
                        />
                        <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                            <NavItem text="À PROPOS" href="#" />
                            <NavItem text="CONTACT" href="#" />
                            <NavItem text="AIDE" href="#" />
                            <NavItem text="MENTIONS LÉGALES" href="#" />
                        </div>
                    </div>
                    <div className="hidden lg:flex space-x-6">
                        <p className="text-[#93D9D6] mt-8">
                            © 2025 SoundWave - Tous droits réservés.
                        </p>
                        <img src={footerWaveRight} alt="footerWaveRight" />
                    </div>
                    <div className="lg:hidden text-center mt-4">
                        <p className="text-[#93D9D6]">
                            © 2025 SoundWave - Tous droits réservés.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Footer;
