import { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { motion } from "framer-motion";

type Wave = {
    id: number;
    username: string;
    avatar: string;
    content: string;
    timestamp: string;
    isEditing?: boolean;
};

const WavesDetails = () => {
    const [waves, setWaves] = useState<Wave[]>([]);
    const [content, setContent] = useState("");
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const handlePostWave = () => {
        if (!content.trim()) return;

        const newWave: Wave = {
            id: Date.now(),
            username: "JohnDoe", // à remplacer avec utilisateur réel
            avatar: "https://via.placeholder.com/50",
            content,
            timestamp: new Date().toLocaleString(),
            isEditing: false,
        };

        setWaves([newWave, ...waves]);
        setContent("");
    };

    const handleDeleteWave = (id: number) => {
        setWaves(waves.filter((wave) => wave.id !== id));
    };

    const handleEditWave = (id: number) => {
        setWaves(
            waves.map((wave) =>
                wave.id === id ? { ...wave, isEditing: true } : wave
            )
        );
        setOpenDropdown(null);
    };

    const handleUpdateWave = (id: number, newContent: string) => {
        setWaves(
            waves.map((wave) =>
                wave.id === id ? { ...wave, content: newContent, isEditing: false } : wave
            )
        );
    };

    const handleShareWave = (id: number) => {
        alert(`Wave ${id} partagé ! 🚀`);
        setOpenDropdown(null);
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
            <h2 className="text-2xl font-semibold text-primaryBlue mb-8 text-center">
                Waves
            </h2>

            <div className="flex flex-col md:flex-row gap-10 items-start justify-between">
                {/* Formulaire à gauche */}
                <div className="w-full md:w-1/2 bg-white p-8 rounded-xl shadow-lg border border-gray-300">
          <textarea
              className="w-full p-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue text-text-200"
              placeholder="Exprimez-vous..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
          />
                    <button
                        className="mt-5 w-full bg-primaryBlue text-white py-4 rounded-lg hover:bg-[#B0C7E6] transition font-semibold"
                        onClick={handlePostWave}
                    >
                        Publier
                    </button>
                </div>

                {/* Liste des Waves à droite */}
                <div className="w-full md:w-1/2 space-y-8">
                    {waves.map((wave) => (
                        <div
                            key={wave.id}
                            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex space-x-4 relative"
                        >
                            <img
                                src={wave.avatar}
                                alt="User Avatar"
                                className="w-14 h-14 rounded-full"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-primaryBlue text-lg">
                                    {wave.username}
                                </p>
                                <p className="text-gray-500 text-sm">{wave.timestamp}</p>

                                {wave.isEditing ? (
                                    <textarea
                                        className="w-full mt-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue text-text-200"
                                        value={wave.content}
                                        onChange={(e) =>
                                            setWaves(
                                                waves.map((w) =>
                                                    w.id === wave.id ? { ...w, content: e.target.value } : w
                                                )
                                            )
                                        }
                                    />
                                ) : (
                                    <p className="mt-3 text-text-200 text-base">{wave.content}</p>
                                )}

                                {wave.isEditing && (
                                    <button
                                        className="text-green-500 hover:underline font-medium mt-2"
                                        onClick={() => handleUpdateWave(wave.id, wave.content)}
                                    >
                                        Sauvegarder
                                    </button>
                                )}
                            </div>

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
                                            className="block w-full text-left px-4 py-2 text-primaryBlue hover:bg-gray-100"
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WavesDetails;
