import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import { motion } from "framer-motion";
import {
    getReviewsByTarget,
    getMyReview,
    createReview,
    updateReview,
    deleteReview,
    LocalReview,
    ReviewTargetType,
} from "../../services/reviewService";

interface ReviewsDetailsProps {
    targetType: ReviewTargetType; // 'artist' | 'album'
}

const ReviewsDetails: React.FC<ReviewsDetailsProps> = ({ targetType }) => {
    const { id: targetId } = useParams<{ id: string }>();

    const [reviews, setReviews] = useState<LocalReview[]>([]);
    const [message, setMessage] = useState("");
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [hasReviewed, setHasReviewed] = useState<boolean>(false);
    const [myReview, setMyReview] = useState<LocalReview | null>(null);

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
        if (!targetId) return;

        const fetchData = async () => {
            try {
                const reviewsData = await getReviewsByTarget(targetType, targetId);
                setReviews(reviewsData.map((r) => ({ ...r, isEditing: false })));

                if (currentUser) {
                    const userReview = await getMyReview(targetType, targetId);
                    if (userReview) {
                        setMyReview({ ...userReview, isEditing: false });
                        setHasReviewed(true);
                    } else {
                        setMyReview(null);
                        setHasReviewed(false);
                    }
                }
            } catch (error) {
                console.error("Erreur lors du chargement des reviews :", error);
            }
        };

        fetchData();
    }, [targetId, currentUser, targetType]);

    const handlePostReview = async () => {
        if (!message.trim() || !currentUser || hasReviewed || !targetId) return;

        try {
            const newReview = await createReview(targetType, targetId, message);
            setReviews([{ ...newReview, isEditing: false }, ...reviews]);
            setMessage("");
            setMyReview({ ...newReview, isEditing: false });
            setHasReviewed(true);
        } catch (error) {
            console.error("Erreur lors de la création de la review :", error);
        }
    };

    const handleDeleteReview = async (id: string) => {
        try {
            await deleteReview(id);
            setReviews(reviews.filter((review) => review.id !== id));
            setHasReviewed(false);
            setMyReview(null);
        } catch (error) {
            console.error("Erreur lors de la suppression de la review :", error);
        }
    };

    const handleEditReview = (id: string) => {
        if (myReview && myReview.id === id) {
            setMyReview({ ...myReview, isEditing: true });
        } else {
            setReviews(
                reviews.map((review) =>
                    review.id === id ? { ...review, isEditing: true } : review
                )
            );
        }
        setOpenDropdown(null);
    };

    const handleUpdateReview = async (id: string, newMessage: string) => {
        try {
            const updated = await updateReview(id, newMessage);

            if (myReview && myReview.id === id) {
                setMyReview({ ...updated, isEditing: false });
            }

            setReviews(
                reviews.map((review) =>
                    review.id === id ? { ...updated, isEditing: false } : review
                )
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la review :", error);
        }
    };

    const handleShareReview = (id: string) => {
        alert(`Review ${id} partagée !`);
        setOpenDropdown(null);
    };

    const displayedReviews = [
        ...(myReview ? [myReview] : []),
        ...reviews.filter((r) => !myReview || r.id !== myReview.id),
    ];

    return (
        <div className="max-w-6xl mx-auto pt-4 pb-10 px-4 md:px-8">
            <div className="flex flex-col items-center gap-10 px-4">
                {!hasReviewed && (
                    <div className="w-full sm:max-w-md md:max-w-xl lg:max-w-2xl bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-300">
            <textarea
                className="w-full p-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue text-text-200 resize-none overflow-hidden"
                placeholder="Laissez une review..."
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
                            onClick={handlePostReview}
                        >
                            Publier
                        </button>
                    </div>
                )}

                <div className="w-full sm:max-w-md md:max-w-xl lg:max-w-2xl space-y-8">
                    {displayedReviews.map((review) => (
                        <div
                            key={review.id}
                            className={`p-6 rounded-xl shadow-md border border-gray-200 relative grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 ${
                                myReview && review.id === myReview.id ? "bg-gray-100" : "bg-white"
                            }`}
                        >
                            <img
                                src={review.profile_picture || "https://via.placeholder.com/50"}
                                alt="User Avatar"
                                className="w-14 h-14 rounded-full row-span-2"
                            />

                            <div>
                                <p className="font-semibold text-primaryBlue text-lg">
                                    {review.username}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {new Date(review.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div className="col-span-2">
                                {review.isEditing ? (
                                    <textarea
                                        className="w-full mt-3 p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primaryBlue text-text-200 resize-none overflow-hidden"
                                        value={review.message}
                                        onChange={(e) => {
                                            const updatedMessage = e.target.value;
                                            const textarea = e.target as HTMLTextAreaElement;
                                            textarea.style.height = "auto";
                                            textarea.style.height = `${textarea.scrollHeight}px`;

                                            if (myReview && myReview.id === review.id) {
                                                setMyReview({ ...myReview, message: updatedMessage });
                                            } else {
                                                setReviews(
                                                    reviews.map((r) =>
                                                        r.id === review.id
                                                            ? { ...r, message: updatedMessage }
                                                            : r
                                                    )
                                                );
                                            }
                                        }}
                                    />
                                ) : (
                                    <p className="mt-3 text-text-200 text-base whitespace-pre-line">
                                        {review.message}
                                    </p>
                                )}

                                {review.isEditing && (
                                    <button
                                        className="text-green-500 hover:underline font-medium mt-2"
                                        onClick={() => handleUpdateReview(review.id, review.message)}
                                    >
                                        Sauvegarder
                                    </button>
                                )}
                            </div>

                            {currentUser === review.username && (
                                <div className="absolute top-4 right-4">
                                    <button
                                        className="text-gray-500 hover:text-primaryBlue"
                                        onClick={() =>
                                            setOpenDropdown(
                                                openDropdown === review.id ? null : review.id
                                            )
                                        }
                                    >
                                        <FiMoreHorizontal size={24} />
                                    </button>

                                    {openDropdown === review.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="absolute top-10 right-0 bg-white border border-gray-200 shadow-md rounded-lg w-40 z-10"
                                        >
                                            <button
                                                className="block w-full text-left px-4 py-2 text-yellow-500 hover:bg-gray-100"
                                                onClick={() => handleEditReview(review.id)}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                                                onClick={() => handleDeleteReview(review.id)}
                                            >
                                                Supprimer
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-green-500 hover:bg-gray-100"
                                                onClick={() => handleShareReview(review.id)}
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

export default ReviewsDetails;
