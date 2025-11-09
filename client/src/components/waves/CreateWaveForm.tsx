/**
 * @description Formulaire pour créer une nouvelle wave
 * @author SoundWave
 */

import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

interface CreateWaveFormProps {
    onSubmit: (content: string) => Promise<void>;
    placeholder?: string;
}

const CreateWaveForm: React.FC<CreateWaveFormProps> = ({ 
    onSubmit, 
    placeholder = "Qu'écoutez-vous en ce moment ? 🎵" 
}) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const maxLength = 500;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim() || content.length > maxLength) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(content.trim());
            setContent('');
            setShowEmojiPicker(false);
        } catch (error) {
            console.error('Error creating wave:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmojiClick = (emojiData: any) => {
        if (content.length < maxLength) {
            setContent(prev => prev + emojiData.emoji);
        }
    };

    const remainingChars = maxLength - content.length;
    const isOverLimit = remainingChars < 0;
    const isNearLimit = remainingChars <= 50 && remainingChars >= 0;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={placeholder}
                        className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 transition ${
                            isOverLimit 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 focus:ring-primaryBlue'
                        }`}
                        rows={4}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Emoji Picker Button */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition cursor-pointer"
                                title="Ajouter un emoji"
                                disabled={isSubmitting}
                            >
                                <span className="text-2xl">😊</span>
                            </button>
                            
                            {showEmojiPicker && (
                                <div className="absolute z-10 top-12 left-0">
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowEmojiPicker(false)}
                                            className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-900 z-20"
                                        >
                                            ✕
                                        </button>
                                        <EmojiPicker
                                            onEmojiClick={handleEmojiClick}
                                            width={350}
                                            height={400}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Character Counter */}
                        <span 
                            className={`text-sm font-medium ${
                                isOverLimit 
                                    ? 'text-red-500' 
                                    : isNearLimit 
                                        ? 'text-orange-500' 
                                        : 'text-gray-500'
                            }`}
                        >
                            {remainingChars} / {maxLength}
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!content.trim() || isOverLimit || isSubmitting}
                        className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                            !content.trim() || isOverLimit || isSubmitting
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primaryBlue text-white hover:bg-[#B0C7E6] shadow-md'
                        }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center space-x-2">
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                <span>Envoi...</span>
                            </span>
                        ) : (
                            'Envoyer'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateWaveForm;
