import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import { motion } from "framer-motion";
import {
    getWavesByArtist,
    getMyWave,
    createWave,
    updateWave,
    deleteWave,
    LocalWave,
} from "../../services/waveService";

const WavesDetails = () => {
    const { id: artistId } = useParams<{ id: string }>();
    const [waves, setWaves] = useState<LocalWave[]>([]);
    const [message, setMessage] = useState("");
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [hasPosted, setHasPosted] = useState<boolean>(false);
    const [myWave, setMyWave] = useState<LocalWave | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch("http://localhost:5001/users/me", {
                    credentials: "include",
                });
                if (!res.ok) return;
                const user = await res.json();
                setCurrentUser(user.username);
            } catch (error) {
                console.error("Impossible de récupérer l'utilisateur :", error);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (!artistId) return;

        const fetchData = async () => {
            try {
                const wavesData = await getWavesByArtist(artistId);
                setWaves(wavesData.map((w) => ({ ...w, isEditing: false })));

                if (currentUser) {
                    const userWave = await getMyWave(artistId);
                    if (userWave) {
                        setMyWave(userWave);
                        setHasPosted(true);
                    } else {
                        setMyWave(null);
                        setHasPosted(false);
                    }
                }
            } catch (error) {
                console.error("Erreur lors du chargement des waves :", error);
            }
        };

        fetchData();
    }, [artistId, currentUser]);

    const handlePostWave = async () => {
        if (!message.trim() || !currentUser || hasPosted || !artistId) return;

        try {
            const newWave = await createWave(artistId, message);
            setWaves([{ ...newWave, isEditing: false }, ...waves]);
            setMessage("");
            setMyWave(newWave);
            setHasPosted(true);
        } catch (error) {
            console.error("Erreur lors de la création de la wave :", error);
        }
    };

    const handleDeleteWave = async (id: string) => {
        try {
            await deleteWave(id);
            setWaves(waves.filter((wave) => wave.id !== id));
            setHasPosted(false);
            setMyWave(null);
        } catch (error) {
            console.error("Erreur lors de la suppression de la wave :", error);
        }
    };

    const handleEditWave = (id: string) => {
        setWaves(
            waves.map((wave) =>
                wave.id === id ? { ...wave, isEditing: true } : wave
            )
        );
        setOpenDropdown(null);
    };

    const handleUpdateWave = async (id: string, newMessage: string) => {
        try {
            const updated = await updateWave(id, newMessage);
            setWaves(
                waves.map((wave) =>
                    wave.id === id ? { ...updated, isEditing: false } : wave
                )
            );
            if (myWave && myWave.id === id) {
                setMyWave(updated);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la wave :", error);
        }
    };

    const handleShareWave = (id: string) => {
        alert(`Wave ${id} partagé !`);
        setOpenDropdown(null);
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
            <h2 className="text-2xl font-semibold text-primaryBlue mb-8 text-center">Waves</h2>

            <div className="flex flex-col md:flex-row gap-10 items-start justify-between">
                <div className="w-full md:w-1/2 bg-white p-8 rounded-xl shadow-lg border border-gray-300">
                    {hasPosted ? (
                        <p className="text-gray-600">
                            ✅ Vous avez déjà publié une Wave.
                        </p>
                    ) : (
                        <>
                      <textarea
                          className="w-full p-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue text-text-200"
                          placeholder="Exprimez-vous..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                      />
                            <button
                                className="mt-5 w-full bg-primaryBlue text-white py-4 rounded-lg hover:bg-[#B0C7E6] transition font-semibold"
                                onClick={handlePostWave}
                            >
                                Publier
                            </button>
                        </>
                    )}
                </div>


                <div className="w-full md:w-1/2 space-y-8">
                    {waves.map((wave) => (
                        <div
                            key={wave.id}
                            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex space-x-4 relative"
                        >
                            <img
                                src={wave.profile_picture || "https://via.placeholder.com/50"}
                                alt="User Avatar"
                                className="w-14 h-14 rounded-full"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-primaryBlue text-lg">
                                    {wave.username}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {new Date(wave.createdAt).toLocaleString()}
                                </p>

                                {wave.isEditing ? (
                                    <textarea
                                        className="w-full mt-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue text-text-200"
                                        value={wave.message}
                                        onChange={(e) =>
                                            setWaves(
                                                waves.map((w) =>
                                                    w.id === wave.id
                                                        ? { ...w, message: e.target.value }
                                                        : w
                                                )
                                            )
                                        }
                                    />
                                ) : (
                                    <p className="mt-3 text-text-200 text-base">{wave.message}</p>
                                )}

                                {wave.isEditing && (
                                    <button
                                        className="text-green-500 hover:underline font-medium mt-2"
                                        onClick={() => handleUpdateWave(wave.id, wave.message)}
                                    >
                                        Sauvegarder
                                    </button>
                                )}
                            </div>

                            {currentUser === wave.username && (
                                <div className="relative">
                                    <button
                                        className="text-gray-500 hover:text-primaryBlue"
                                        onClick={() =>
                                            setOpenDropdown(openDropdown === wave.id ? null : wave.id)
                                        }
                                    >
                                        <FiMoreHorizontal size={24} />
                                    </button>

                                    {openDropdown === wave.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="absolute top-10 right-0 bg-white border border-gray-200 shadow-md rounded-lg w-40"
                                        >
                                            <button
                                                className="block w-full text-left px-4 py-2 text-yellow-500 hover:bg-gray-100"
                                                onClick={() => handleEditWave(wave.id)}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                                onClick={() => handleDeleteWave(wave.id)}
                                            >
                                                Supprimer
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-green-500 hover:bg-gray-100"
                                                onClick={() => handleShareWave(wave.id)}
                                            >
                                                Partager
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default WavesDetails;
