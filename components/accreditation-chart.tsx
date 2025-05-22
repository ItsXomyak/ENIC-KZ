"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "@/components/ui/chart"

interface AccreditationChartProps {
  type: "pie" | "line" | "bar"
}

export default function AccreditationChart({ type }: AccreditationChartProps) {
  // Mock data for pie chart
  const pieData = [
    { name: "Universities", value: 45 },
    { name: "Colleges", value: 30 },
    { name: "Schools", value: 15 },
    { name: "Other", value: 10 },
  ]

  // Mock data for line chart
  const lineData = [
    { year: "2020", accredited: 65, pending: 15 },
    { year: "2021", accredited: 75, pending: 20 },
    { year: "2022", accredited: 85, pending: 25 },
    { year: "2023", accredited: 95, pending: 15 },
    { year: "2024", accredited: 110, pending: 10 },
    { year: "2025", accredited: 120, pending: 5 },
  ]

  // Mock data for bar chart
  const barData = [
    { name: "Jan", value: 12 },
    { name: "Feb", value: 19 },
    { name: "Mar", value: 15 },
    { name: "Apr", value: 8 },
    { name: "May", value: 22 },
    { name: "Jun", value: 16 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={lineData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="accredited" stroke="#0088FE" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="pending" stroke="#FF8042" />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={barData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#0088FE" />
      </BarChart>
    </ResponsiveContainer>
  )
}
