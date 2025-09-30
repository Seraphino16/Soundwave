import React from 'react';
import { UserProfileStats } from '../../services/userProfileService';
import { FiUsers } from 'react-icons/fi';

interface ProfileStatsProps {
    stats: UserProfileStats;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
    const statItems = [
        {
            icon: <span className="text-xl">🎵</span>,
            label: 'Waves',
            value: stats.totalWaves,
            color: 'text-blue-600'
        },
        {
            icon: <span className="text-xl">📝</span>,
            label: 'Reviews',
            value: stats.totalReviews,
            color: 'text-green-600'
        },
        {
            icon: <span className="text-xl">♥</span>,
            label: 'Likes reçus',
            value: stats.totalLikes,
            color: 'text-red-600'
        },
        {
            icon: <FiUsers className="h-6 w-6" />,
            label: 'Followers',
            value: stats.totalFollowers,
            color: 'text-purple-600'
        },
        {
            icon: <span className="text-xl">👥</span>,
            label: 'Following',
            value: stats.totalFollowing,
            color: 'text-indigo-600'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
            
            {/* Main stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {statItems.map((item, index) => (
                    <div key={index} className="text-center">
                        <div className={`flex justify-center items-center h-8 mb-2 ${item.color}`}>
                            {item.icon}
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {item.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 leading-tight">{item.label}</div>
                    </div>
                ))}
            </div>

            {/* Additional stats section removed to avoid duplication */}
        </div>
    );
};

export default React.memo(ProfileStats);
