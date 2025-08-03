import React, { useEffect, useState } from "react";
import { fetchArtists, searchArtists } from "../services/spotifyService";
import ArtistCard from "../components/cards/ArtistCard";

interface Artist {
    id: string;
    name: string;
    image: string | null;
}

const Artists: React.FC = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const artistsPerPage = 12;

    const [artistNameFilter, setArtistNameFilter] = useState("");
    const [genreFilter, setGenreFilter] = useState("");

    useEffect(() => {
        loadArtists();
    }, []);

    const loadArtists = async () => {
        setLoading(true);
        const data = await fetchArtists();
        if (data && data.artists) {
            setArtists(data.artists);
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const { artists } = await searchArtists({
                name: artistNameFilter,
                genre: genreFilter,
            });

            const filteredArtists = artistNameFilter
                ? artists.filter((artist: Artist) =>
                    artist.name.toLowerCase().includes(artistNameFilter.toLowerCase())
                )
                : artists;

            setArtists(filteredArtists);
        } catch (error) {
            console.error("Erreur lors de la recherche d'artistes:", error);
            setArtists([]);
        }
        setCurrentPage(1);
        setLoading(false);
    };

    const handleReset = async () => {
        setArtistNameFilter("");
        setGenreFilter("");
        setCurrentPage(1);
        await loadArtists();
    };

    const indexOfLastArtist = currentPage * artistsPerPage;
    const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
    const currentArtists = artists.slice(indexOfFirstArtist, indexOfLastArtist);
    const totalPages = Math.ceil(artists.length / artistsPerPage);

    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        const pageNumbers: (number | string)[] = [];

        if (totalPages <= maxPagesToShow) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 3) {
            pageNumbers.push(1, 2, 3, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
            pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
        } else {
            pageNumbers.push(
                1,
                "...",
                currentPage - 1,
                currentPage,
                currentPage + 1,
                "...",
                totalPages
            );
        }

        return pageNumbers;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex w-full max-w-7xl p-10 bg-white shadow-lg rounded-lg">

                <div className="w-64 pr-6 border-r">
                    <h2 className="text-xl font-semibold text-primaryBlue mb-4">Filtres</h2>

                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Nom artiste
                        </label>
                        <input
                            type="text"
                            value={artistNameFilter}
                            onChange={(e) => setArtistNameFilter(e.target.value)}
                            placeholder="Artiste..."
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-primaryBlue"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Genre
                        </label>
                        <input
                            type="text"
                            value={genreFilter}
                            onChange={(e) => setGenreFilter(e.target.value)}
                            placeholder="Ex: pop, rock, jazz..."
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-primaryBlue"
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="bg-primaryBlue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full"
                    >
                        Rechercher
                    </button>

                    <button
                        onClick={handleReset}
                        className="mt-2 text-sm text-gray-600 underline hover:text-primaryBlue transition w-full"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>

                <div className="flex-1 pl-6">
                    <h1 className="text-3xl font-bold text-center mb-8 text-primaryBlue">ARTISTES</h1>

                    {loading ? (
                        <p className="text-center">Chargement...</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                {currentArtists.map((artist) => (
                                    <ArtistCard
                                        key={artist.id}
                                        id={artist.id}
                                        name={artist.name}
                                        image={artist.image || ""}
                                    />
                                ))}
                            </div>

                            <nav className="flex justify-center mt-8" aria-label="Pagination">
                                <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg shadow-md">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        aria-label="Previous"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    {getPageNumbers().map((page, index) =>
                                        page === "..." ? (
                                            <span key={index} className="text-gray-500 px-3 text-lg">•••</span>
                                        ) : (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentPage(Number(page))}
                                                className={`px-4 py-2 rounded-md transition font-semibold ${
                                                    currentPage === page
                                                        ? "bg-primaryBlue text-white shadow-md"
                                                        : "bg-white text-gray-700 hover:bg-gray-200"
                                                }`}
                                                aria-current={currentPage === page ? "page" : undefined}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}

                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        aria-label="Next"
                                    >
                                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </nav>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Artists;
