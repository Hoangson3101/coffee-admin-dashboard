import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { revenueData, chartTypes, timePeriods } from '@/lib/data';
import { cn } from '@/lib/utils';

export function RevenueChart() {
  const [chartType, setChartType] = useState<string>("bar");
  const [timePeriod, setTimePeriod] = useState<string>("daily");
  const [isLoading, setIsLoading] = useState(true);
  
  const data = revenueData[timePeriod as keyof typeof revenueData];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [chartType, timePeriod]);
  
  const renderChart = () => {
    switch(chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
              />
              <YAxis 
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Revenue']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar 
                dataKey="revenue" 
                fill="url(#barGradient)" 
                radius={[6, 6, 0, 0]}
                animationDuration={1200}
                animationEasing="ease-in-out"
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary-foreground))" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
              />
              <YAxis 
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Revenue']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
                cursor={{ stroke: 'rgba(0, 0, 0, 0.1)', strokeWidth: 1 }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="url(#lineGradient)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 4, strokeWidth: 2, stroke: 'white' }}
                activeDot={{ 
                  r: 8, 
                  fill: 'hsl(var(--primary))', 
                  stroke: 'white', 
                  strokeWidth: 2,
                  filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.2))'
                }}
                animationDuration={1200}
                animationEasing="ease-out"
                fill="url(#areaGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        // Transform data for pie chart
        const pieData = data.map(item => ({
          name: item.name,
          value: item.revenue
        }));
        
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RechartsPieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient key={`gradient-${index}`} id={`pieGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={{ stroke: '#555', strokeWidth: 1, strokeDasharray: '3 3' }}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={130}
                innerRadius={70}
                paddingAngle={2}
                dataKey="value"
                animationDuration={1500}
                animationEasing="ease-in-out"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#pieGradient${index % COLORS.length})`} 
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Revenue']}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <motion.h2 
          className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          Revenue Overview
        </motion.h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <ToggleGroup 
            type="single" 
            value={timePeriod} 
            onValueChange={(value) => value && setTimePeriod(value)} 
            className="border rounded-md shadow-sm"
          >
            {timePeriods.map((period, index) => (
              <ToggleGroupItem 
                key={period.id} 
                value={period.id} 
                aria-label={period.name} 
                className={cn(
                  "text-xs px-3 transition-all duration-200",
                  timePeriod === period.id ? "font-medium" : ""
                )}
                asChild
              >
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  {period.name}
                </motion.div>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          
          <ToggleGroup 
            type="single" 
            value={chartType} 
            onValueChange={(value) => value && setChartType(value)} 
            className="border rounded-md shadow-sm"
          >
            {chartTypes.map((type, index) => (
              <ToggleGroupItem 
                key={type.id} 
                value={type.id} 
                aria-label={type.name}
                className={cn(
                  "transition-all duration-200",
                  chartType === type.id ? "bg-primary/10" : ""
                )}
                asChild
              >
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * (index + 3), duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <type.icon className="h-4 w-4" />
                </motion.div>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={`${chartType}-${timePeriod}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : renderChart()}
        </motion.div>
      </AnimatePresence>
      
      <motion.div 
        className="mt-4 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <p className="italic">* Revenue data shown is for demonstration purposes only.</p>
      </motion.div>
    </motion.div>
  );
}

export default RevenueChart;
