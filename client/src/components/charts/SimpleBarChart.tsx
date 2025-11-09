import React from 'react';

interface BarChartData {
    labels: string[];
    data: number[];
    colors?: string[];
}

interface SimpleBarChartProps {
    data: BarChartData;
    height?: number;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
    data, 
    height = 200 
}) => {
    const maxValue = Math.max(...data.data);
    const defaultColors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];

    const truncateLabel = (label: string, maxLength: number = 6) => {
        if (label.length <= maxLength) return label;
        return label.substring(0, maxLength - 1) + '.';
    };

    const shouldShowLabel = (index: number) => {
        if (data.labels.length <= 10) return true;
        if (data.labels.length <= 20) return index % 2 === 0;
        return index % 3 === 0;
    };

    return (
        <div className="w-full">
            <div className="flex items-end justify-between px-1" style={{ height, gap: data.labels.length > 15 ? '1px' : '4px' }}>
                {data.labels.map((label, index) => {
                    const barHeight = (data.data[index] / maxValue) * (height - 80);
                    const color = data.colors?.[index] || defaultColors[index % defaultColors.length];
                    const truncatedLabel = truncateLabel(label);
                    const showLabel = shouldShowLabel(index);
                    
                    return (
                        <div key={index} className="flex flex-col items-center flex-1 min-w-0">
                            <div className="mb-2 text-xs text-gray-600 font-medium">
                                {data.data[index]}
                            </div>
                            <div
                                className="rounded-t transition-all duration-300 hover:opacity-80"
                                style={{
                                    height: `${barHeight}px`,
                                    backgroundColor: color,
                                    minHeight: '4px',
                                    width: data.labels.length > 20 ? '100%' : Math.min(32, Math.max(12, 300 / data.labels.length)) + 'px',
                                    margin: '0 auto'
                                }}
                            />
                            <div 
                                className="mt-3 text-xs text-gray-700 text-center leading-tight"
                                style={{ 
                                    fontSize: data.labels.length > 15 ? '9px' : '10px',
                                    opacity: showLabel ? 1 : 0,
                                    height: '24px',
                                    overflow: 'hidden'
                                }}
                                title={label}
                            >
                                {showLabel ? truncatedLabel : ''}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(SimpleBarChart);
