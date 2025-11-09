import React from 'react';

interface LineChartData {
    labels: string[];
    data: number[];
    color?: string;
}

interface SimpleLineChartProps {
    data: LineChartData;
    title?: string;
    height?: number;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ 
    data, 
    title, 
    height = 200 
}) => {
    const maxValue = Math.max(...data.data);
    const minValue = Math.min(...data.data);
    const range = maxValue - minValue || 1;
    const color = data.color || '#3B82F6';

    const maxLabelsToShow = Math.min(data.labels.length, 8);
    const showEveryNth = Math.ceil(data.labels.length / maxLabelsToShow);
    
    const displayLabels = data.labels.map((label, index) => ({
        label: label.length > 8 ? label.substring(0, 6) + '...' : label,
        show: index % showEveryNth === 0 || index === data.labels.length - 1
    }));

    const points = data.data.map((value, index) => {
        const x = (index / (data.data.length - 1)) * 100;
        const y = 100 - ((value - minValue) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            )}
            <div className="relative pb-8" style={{ height }}>
                <svg
                    className="w-full"
                    style={{ height: height - 32 }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    {/* Grid lines */}
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                        </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                    
                    {/* Line */}
                    <polyline
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        points={points}
                        vectorEffect="non-scaling-stroke"
                    />
                    
                    {/* Points */}
                    {data.data.map((value, index) => {
                        const x = (index / (data.data.length - 1)) * 100;
                        const y = 100 - ((value - minValue) / range) * 100;
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="2"
                                fill={color}
                                vectorEffect="non-scaling-stroke"
                            />
                        );
                    })}
                </svg>
                
                {/* Labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                    {displayLabels.map(({ label, show }, index) => (
                        <span 
                            key={index} 
                            className={`text-xs text-gray-600 text-center transition-opacity ${
                                show ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                                transform: 'rotate(-45deg)',
                                transformOrigin: 'bottom left',
                                whiteSpace: 'nowrap',
                                fontSize: '10px',
                                lineHeight: '1'
                            }}
                        >
                            {show ? label : ''}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(SimpleLineChart);
