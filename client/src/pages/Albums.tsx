import React, { useEffect, useState } from "react";
import { fetchAlbums, searchAlbums } from "../services/spotifyService";
import AlbumCard from "../components/cards/AlbumCard";

interface Album {
    id: string;
    title: string;
    coverImage: string;
}

const Albums: React.FC = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const albumsPerPage = 12;

    const [albumName, setAlbumName] = useState('');
    const [releaseYear, setReleaseYear] = useState('');

    useEffect(() => {
        loadAlbums();
    }, []);

    const loadAlbums = async () => {
        setLoading(true);
        const data = await fetchAlbums();
        if (data?.albums) {
            setAlbums(data.albums);
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        setLoading(true);
        const result = await searchAlbums({
            name: albumName,
            year: releaseYear,
        });
        setAlbums(result.albums);
        setCurrentPage(1);
        setLoading(false);
    };

    const handleReset = async () => {
        setAlbumName('');
        setReleaseYear('');
        setCurrentPage(1);
        await loadAlbums();
    };

    const indexOfLastAlbum = currentPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const currentAlbums = albums.slice(indexOfFirstAlbum, indexOfLastAlbum);
    const totalPages = Math.ceil(albums.length / albumsPerPage);

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
            pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
        }

        return pageNumbers;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex w-full max-w-7xl p-10 bg-white shadow-lg rounded-lg">

                <div className="w-64 pr-6 border-r">
                    <h2 className="text-xl font-semibold text-primaryBlue mb-4">Filtres</h2>

                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Nom Album</label>
                        <input
                            type="text"
                            placeholder="Album..."
                            value={albumName}
                            onChange={(e) => setAlbumName(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-primaryBlue"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Année</label>
                        <input
                            type="number"
                            placeholder="Ex: 2023"
                            value={releaseYear}
                            onChange={(e) => setReleaseYear(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-primaryBlue"
                        />
                    </div>

                    <button
                        className="bg-primaryBlue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full"
                        onClick={handleSearch}
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
                    <h1 className="text-3xl font-bold text-center mb-8 text-primaryBlue">ALBUMS</h1>

                    {loading ? (
                        <p className="text-center">Chargement...</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                {currentAlbums.map((album) => (
                                    <AlbumCard key={album.id} id={album.id} title={album.title} coverImage={album.coverImage} />
                                ))}
                            </div>

                            <nav className="flex justify-center mt-8" aria-label="Pagination">
                                <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg shadow-md">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-200 transition disabled:opacity-50"
                                    >
                                        ←
                                    </button>

                                    {getPageNumbers().map((page, index) =>
                                        page === "..." ? (
                                            <span key={index} className="text-gray-500 px-3 text-lg">•••</span>
                                        ) : (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentPage(Number(page))}
                                                className={`px-4 py-2 rounded-md font-semibold ${
                                                    currentPage === page
                                                        ? "bg-primaryBlue text-white shadow-md"
                                                        : "bg-white text-gray-700 hover:bg-gray-200"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}

                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-200 transition disabled:opacity-50"
                                    >
                                        →
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

export default Albums;
