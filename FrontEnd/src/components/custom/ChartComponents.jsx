import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Progress Bar Component
export const ProgressBar = ({ value, max, color = "from-cyan-400 to-purple-400", showLabel = true, size = "md" }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: "h-1",
    md: "h-2", 
    lg: "h-3",
    xl: "h-4"
  };
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-white/60 text-sm mb-2">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className="w-full bg-white/10 rounded-full">
        <motion.div 
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Bar Chart Component using Charts.js
export const BarChart = ({ data, height = 200, color = "from-blue-400 to-cyan-400", target, colors = ["rgba(59, 130, 246, 0.8)", "rgba(6, 182, 212, 0.8)"] }) => {
  if (!data || data.length === 0) {
    return <div className="text-white/60 text-center py-4">No data available</div>;
  }
  
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Consumed',
        data: data.map(item => item.value),
        backgroundColor: colors[0],
        borderColor: colors[0].replace('0.8', '1'),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      ...(target ? [{
        label: 'Target',
        data: data.map(() => target),
        backgroundColor: colors[1],
        borderColor: colors[1].replace('0.8', '1'),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        type: 'bar'
      }] : [])
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        titleFont: {
          size: 12
        },
        bodyFont: {
          size: 11
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 10
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            size: 10
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };
  
  return (
    <div style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

// Line Chart Component using Charts.js
export const LineChart = ({ data, height = 200, color = "from-green-400 to-emerald-400" }) => {
  try {
    // Handle both array format and Chart.js format
    let chartData;
    
    if (data && data.labels && data.datasets) {
      // Chart.js format (labels and datasets)
      chartData = data;
    } else if (data && Array.isArray(data) && data.length > 0) {
      // Array format (array of objects with label and value)
      chartData = {
        labels: data.map(item => item.label),
        datasets: [
          {
            label: 'Value',
            data: data.map(item => item.value),
            borderColor: 'rgba(34, 197, 94, 1)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(34, 197, 94, 1)',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    } else {
      return <div className="text-white/60 text-center py-4">No data available</div>;
    }

    // Validate chart data
    if (!chartData.labels || !chartData.datasets || !Array.isArray(chartData.labels) || !Array.isArray(chartData.datasets)) {
      return <div className="text-white/60 text-center py-4">Invalid chart data</div>;
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(34, 197, 94, 0.5)',
          borderWidth: 1,
          titleFont: {
            size: 12
          },
          bodyFont: {
            size: 11
          }
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.6)',
            font: {
              size: 10
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        y: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.6)',
            font: {
              size: 10
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    };

    return (
      <div style={{ height }}>
        <Line data={chartData} options={options} />
      </div>
    );
  } catch (error) {
    console.error('Error rendering LineChart:', error);
    return <div className="text-white/60 text-center py-4">Unable to display chart</div>;
  }
};

// Doughnut Chart Component using Charts.js
export const DoughnutChart = ({ data, height = 200 }) => {
  if (!data || data.length === 0) {
    return <div className="text-white/60 text-center py-4">No data available</div>;
  }

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 20,
          usePointStyle: true,
          font: {
            size: 10
          }
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        titleFont: {
          size: 12
        },
        bodyFont: {
          size: 11
        }
      },
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

// Area Chart Component using Charts.js
export const AreaChart = ({ data, height = 200, color = "from-emerald-400 to-teal-400" }) => {
  try {
    if (!data || data.length === 0) {
      return <div className="text-white/60 text-center py-4">No data available</div>;
    }
    
    const chartData = {
      labels: data.map(item => item.label),
      datasets: [
        {
          label: 'Value',
          data: data.map(item => item.value),
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(16, 185, 129, 1)',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(16, 185, 129, 0.5)',
          borderWidth: 1,
          titleFont: {
            size: 12
          },
          bodyFont: {
            size: 11
          }
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.6)',
            font: {
              size: 10
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        y: {
          ticks: {
            color: 'rgba(255, 255, 255, 0.6)',
            font: {
              size: 10
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    };

    return (
      <div style={{ height }}>
        <Line data={chartData} options={options} />
      </div>
    );
  } catch (error) {
    console.error('Error rendering AreaChart:', error);
    return <div className="text-white/60 text-center py-4">Unable to display chart</div>;
  }
};

// Metric Card Component
export const MetricCard = ({ title, value, change, icon: Icon, color = "from-cyan-400 to-purple-400" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      className="chart-component bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
          <Icon className="text-white text-lg" />
        </div>
        {change && (
          <div className={`text-sm font-medium ${
            change > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-white/60 text-sm">{title}</div>
    </motion.div>
  );
};

// Mini Metric Card Component
export const MiniMetricCard = ({ title, value, change, icon: Icon, color = "from-cyan-400 to-purple-400", size = "default" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeClasses = {
    small: "p-3",
    default: "p-4",
    large: "p-6"
  };
  
  const iconSizes = {
    small: "text-sm",
    default: "text-lg",
    large: "text-xl"
  };
  
  const textSizes = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg"
  };
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      className={`chart-component bg-white/5 rounded-xl ${sizeClasses[size]} border border-white/10 hover:border-cyan-400/30 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
          <Icon className={`text-white ${iconSizes[size]}`} />
        </div>
        {change && (
          <div className={`text-sm font-medium ${
            change > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div className={`font-bold text-white mb-1 ${textSizes[size]}`}>{value}</div>
      <div className={`text-white/60 ${textSizes[size]}`}>{title}</div>
    </motion.div>
  );
};

// Trend Indicator Component
export const TrendIndicator = ({ value, previousValue, label }) => {
  const change = value - previousValue;
  const percentageChange = previousValue !== 0 ? (change / previousValue) * 100 : 0;
  const isPositive = change >= 0;
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-white text-2xl font-bold">{value}</div>
        <div className="text-white/60 text-sm">{label}</div>
      </div>
      <div className={`flex items-center gap-1 ${
        isPositive ? 'text-green-400' : 'text-red-400'
      }`}>
        {isPositive ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        )}
        <span className="text-sm font-medium">
          {Math.abs(percentageChange).toFixed(1)}%
        </span>
      </div>
    </div>
  );
};