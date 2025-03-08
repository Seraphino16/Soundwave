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

const Waves = () => {
  const [waves, setWaves] = useState<Wave[]>([]);
  const [content, setContent] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const handlePostWave = () => {
    if (!content.trim()) return;

    const newWave: Wave = {
      id: Date.now(),
      username: "JohnDoe", // Replace with actual user data
      avatar: "https://via.placeholder.com/50", // Replace with actual user avatar
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
    <div className="max-w-6xl mx-auto p-12 space-y-8 flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-300 w-full">
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

      <div className="space-y-8 w-full">
        {waves.map((wave) => (
          <div key={wave.id} className="bg-white p-8 rounded-xl shadow-md border border-gray-200 flex space-x-8 relative w-full">
            <img src={wave.avatar} alt="User Avatar" className="w-16 h-16 rounded-full" />
            <div className="flex-1">
              <p className="font-semibold text-primaryBlue text-xl">{wave.username}</p>
              <p className="text-gray-500 text-sm">{wave.timestamp}</p>

              {wave.isEditing ? (
                <textarea
                  className="w-full mt-4 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue text-text-200"
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
                <p className="mt-4 text-text-200 text-lg">{wave.content}</p>
              )}

              {wave.isEditing ? (
                <button
                  className="text-green-500 hover:underline font-medium mt-4"
                  onClick={() => handleUpdateWave(wave.id, wave.content)}
                >
                  Sauvegarder
                </button>
              ) : null}
            </div>

            <div className="relative">
              <button
                className="text-gray-500 hover:text-primaryBlue"
                onClick={() =>
                  setOpenDropdown(openDropdown === wave.id ? null : wave.id)
                }
              >
                <FiMoreHorizontal size={28} />
              </button>

              {openDropdown === wave.id && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-10 right-0 bg-white border border-gray-200 shadow-md rounded-lg w-44"
                >
                  <button
                    className="block w-full text-left px-6 py-3 text-primaryBlue hover:bg-gray-100"
                    onClick={() => handleEditWave(wave.id)}
                  >
                    Modifier
                  </button>
                  <button
                    className="block w-full text-left px-6 py-3 text-red-500 hover:bg-gray-100"
                    onClick={() => handleDeleteWave(wave.id)}
                  >
                    Supprimer
                  </button>
                  <button
                    className="block w-full text-left px-6 py-3 text-green-500 hover:bg-gray-100"
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
  );
};

export default Waves;
