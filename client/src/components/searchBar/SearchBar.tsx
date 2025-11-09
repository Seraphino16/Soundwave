import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SearchIcon, BurgerMenuIcon } from "../utils/Icons";
import { userSearchService, SearchUser } from "../../services/userSearchService";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [popularUsers, setPopularUsers] = useState<SearchUser[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadPopularUsers = async () => {
            const users = await userSearchService.getPopularUsers(5);
            setPopularUsers(users);
        };
        loadPopularUsers();
    }, []);

    useEffect(() => {
        const searchUsers = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            const searchResult = await userSearchService.searchUsers(query);
            setResults(searchResult.users);
            setIsLoading(false);
        };

        const timeoutId = setTimeout(searchUsers, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setShowResults(true);
    };

    const handleResultClick = () => {
        setShowResults(false);
        setQuery("");
    };

    const displayResults = query.length < 2 ? popularUsers : results;

    return (
        <div ref={searchRef} className="relative w-[90%]">
            <div className="flex items-center justify-center bg-white rounded-full py-4 px-4 border border-gray-300">
                <div className="flex w-full mx-2 items-center">
                    <BurgerMenuIcon />
                    <input
                        type="text"
                        placeholder="Rechercher des utilisateurs..."
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => setShowResults(true)}
                        className="w-full bg-transparent outline-none ml-4"
                    />
                </div>
                <SearchIcon />
            </div>
            {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primaryBlue mx-auto"></div>
                            <p className="mt-2">Recherche en cours...</p>
                        </div>
                    ) : (
                        <>
                            {query.length < 2 && popularUsers.length > 0 && (
                                <div className="p-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-600 mb-2">Utilisateurs populaires</p>
                                </div>
                            )}
                            
                            {displayResults.length > 0 ? (
                                displayResults.map((user) => (
                                    <Link
                                        key={user.id}
                                        to={`/profile/${user.id}`}
                                        onClick={handleResultClick}
                                        className="flex items-center p-3 hover:bg-gray-50 transition"
                                    >
                                        <img
                                            src={user.profile_picture || '/user-icon.png'}
                                            alt={user.pseudo}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center">
                                                <span className="font-medium text-gray-900">{user.pseudo}</span>
                                                {user.is_verified && (
                                                    <span className="ml-1 text-blue-500 text-sm">✓</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">@{user.username}</p>
                                            {user.bio && (
                                                <p className="text-sm text-gray-500 truncate mt-1">{user.bio}</p>
                                            )}
                                        </div>
                                        {user.followers !== undefined && (
                                            <div className="text-right text-sm text-gray-500">
                                                <span>{user.followers} followers</span>
                                            </div>
                                        )}
                                    </Link>
                                ))
                            ) : query.length >= 2 ? (
                                <div className="p-4 text-center text-gray-500">
                                    <p>Aucun utilisateur trouvé pour "{query}"</p>
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
