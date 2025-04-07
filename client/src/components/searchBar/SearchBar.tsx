/**
 * @description Barre de recherche du site
 * @author SoundWave
 * */

import { SearchIcon, BurgerMenuIcon } from "../utils/Icons";

const SearchBar = () => {
    return (
        <div className="flex items-center justify-center w-[90%] bg-white rounded-full py-4 px-4 border border-gray-300">
            <div className="flex w-full mx-2 items-center">
                <BurgerMenuIcon />
                <input
                    type="text"
                    placeholder="Recherche"
                    className="w-full bg-transparent outline-none ml-4"
                />
            </div>
            <SearchIcon />
        </div>
    );
};

export default SearchBar;
