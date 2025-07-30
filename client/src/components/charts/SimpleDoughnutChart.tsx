import React from 'react';

interface DoughnutChartData {
    labels: string[];
    data: number[];
    colors?: string[];
}

interface SimpleDoughnutChartProps {
    data: DoughnutChartData;
    title?: string;
    size?: number;
}

const SimpleDoughnutChart: React.FC<SimpleDoughnutChartProps> = ({ 
    data, 
    title, 
    size = 200 
}) => {
    const total = data.data.reduce((sum, value) => sum + value, 0);
    const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    
    let cumulativePercentage = 0;
    const radius = 80;
    const innerRadius = 50;
    const center = 100;

    const createArcPath = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
        const start = polarToCartesian(center, center, outerR, endAngle);
        const end = polarToCartesian(center, center, outerR, startAngle);
        const innerStart = polarToCartesian(center, center, innerR, endAngle);
        const innerEnd = polarToCartesian(center, center, innerR, startAngle);
        
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        
        return [
            "M", start.x, start.y, 
            "A", outerR, outerR, 0, largeArcFlag, 0, end.x, end.y,
            "L", innerEnd.x, innerEnd.y,
            "A", innerR, innerR, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
            "Z"
        ].join(" ");
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    return (
        <div className="w-full flex flex-col items-center">
            {title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            )}
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 200 200"
                    className="transform -rotate-90"
                >
                    {data.data.map((value, index) => {
                        const percentage = (value / total) * 100;
                        const startAngle = cumulativePercentage * 3.6;
                        const endAngle = (cumulativePercentage + percentage) * 3.6;
                        const color = data.colors?.[index] || defaultColors[index % defaultColors.length];
                        
                        cumulativePercentage += percentage;
                        
                        if (percentage === 0) return null;
                        
                        return (
                            <path
                                key={index}
                                d={createArcPath(startAngle, endAngle, radius, innerRadius)}
                                fill={color}
                                className="hover:opacity-80 transition-opacity duration-200"
                            />
                        );
                    })}
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{total}</div>
                        <div className="text-sm text-gray-600">Total</div>
                    </div>
                </div>
            </div>
            
            {/* Legend */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                {data.labels.map((label, index) => {
                    const color = data.colors?.[index] || defaultColors[index % defaultColors.length];
                    const percentage = ((data.data[index] / total) * 100).toFixed(1);
                    
                    return (
                        <div key={index} className="flex items-center space-x-3">
                            <div
                                className="w-4 h-4 rounded-sm flex-shrink-0"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-sm text-gray-700 truncate">
                                {label} ({percentage}%)
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(SimpleDoughnutChart);
