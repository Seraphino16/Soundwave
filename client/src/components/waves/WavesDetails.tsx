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
                        setMyWave({ ...userWave, isEditing: false });
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
            setMyWave({ ...newWave, isEditing: false });
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
        if (myWave && myWave.id === id) {
            setMyWave({ ...myWave, isEditing: true });
        } else {
            setWaves(
                waves.map((wave) =>
                    wave.id === id ? { ...wave, isEditing: true } : wave
                )
            );
        }
        setOpenDropdown(null);
    };

    const handleUpdateWave = async (id: string, newMessage: string) => {
        try {
            const updated = await updateWave(id, newMessage);

            if (myWave && myWave.id === id) {
                setMyWave({ ...updated, isEditing: false });
            }

            setWaves(
                waves.map((wave) =>
                    wave.id === id ? { ...updated, isEditing: false } : wave
                )
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la wave :", error);
        }
    };

    const handleShareWave = (id: string) => {
        alert(`Wave ${id} partagé !`);
        setOpenDropdown(null);
    };

    const displayedWaves = [
        ...(myWave ? [myWave] : []),
        ...waves.filter((w) => !myWave || w.id !== myWave.id),
    ];

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
            <h2 className="text-2xl font-semibold text-primaryBlue mb-8 text-center">
                Waves
            </h2>

            <div className="flex flex-col items-center gap-10 px-4">
                {!hasPosted && (
                    <div className="w-full sm:max-w-md md:max-w-xl lg:max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-300">
                        <textarea
                            className="w-full p-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue text-text-200 resize-none overflow-hidden"
                            placeholder="Exprimez-vous..."
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                const textarea = e.target as HTMLTextAreaElement;
                                textarea.style.height = "auto";
                                textarea.style.height = `${textarea.scrollHeight}px`;
                            }}
                        />
                        <button
                            className="mt-5 w-full bg-primaryBlue text-white py-4 rounded-lg hover:bg-[#B0C7E6] transition font-semibold"
                            onClick={handlePostWave}
                        >
                            Publier
                        </button>
                    </div>
                )}

                <div className="w-full sm:max-w-md md:max-w-xl lg:max-w-2xl space-y-8">
                    {displayedWaves.map((wave) => (
                        <div
                            key={wave.id}
                            className={`p-6 rounded-xl shadow-md border border-gray-200 relative grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 ${
                                myWave && wave.id === myWave.id ? "bg-gray-100" : "bg-white"
                            }`}
                        >
                            <img
                                src={wave.profile_picture || "https://via.placeholder.com/50"}
                                alt="User Avatar"
                                className="w-14 h-14 rounded-full row-span-2"
                            />

                            <div>
                                <p className="font-semibold text-primaryBlue text-lg">
                                    {wave.username}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {new Date(wave.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div className="col-span-2">
                                {wave.isEditing ? (
                                    <textarea
                                        className="w-full mt-3 p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primaryBlue text-text-200 resize-none overflow-hidden"
                                        value={wave.message}
                                        onChange={(e) => {
                                            const updatedMessage = e.target.value;

                                            const textarea = e.target as HTMLTextAreaElement;
                                            textarea.style.height = "auto";
                                            textarea.style.height = `${textarea.scrollHeight}px`;

                                            if (myWave && myWave.id === wave.id) {
                                                setMyWave({ ...myWave, message: updatedMessage });
                                            } else {
                                                setWaves(
                                                    waves.map((w) =>
                                                        w.id === wave.id
                                                            ? { ...w, message: updatedMessage }
                                                            : w
                                                    )
                                                );
                                            }
                                        }}
                                    />
                                ) : (
                                    <p className="mt-3 text-text-200 text-base">
                                        {wave.message}
                                    </p>
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
                                <div className="absolute top-4 right-4">
                                    <button
                                        className="text-gray-500 hover:text-primaryBlue"
                                        onClick={() =>
                                            setOpenDropdown(
                                                openDropdown === wave.id ? null : wave.id
                                            )
                                        }
                                    >
                                        <FiMoreHorizontal size={24} />
                                    </button>

                                    {openDropdown === wave.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="absolute top-10 right-0 bg-white border border-gray-200 shadow-md rounded-lg w-40 z-10"
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
