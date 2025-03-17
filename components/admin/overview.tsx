"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Jan 1", clients: 4, employers: 2 },
  { name: "Jan 2", clients: 3, employers: 1 },
  { name: "Jan 3", clients: 5, employers: 3 },
  { name: "Jan 4", clients: 7, employers: 2 },
  { name: "Jan 5", clients: 4, employers: 4 },
  { name: "Jan 6", clients: 6, employers: 2 },
  { name: "Jan 7", clients: 8, employers: 3 },
  { name: "Jan 8", clients: 9, employers: 2 },
  { name: "Jan 9", clients: 6, employers: 4 },
  { name: "Jan 10", clients: 8, employers: 1 },
  { name: "Jan 11", clients: 7, employers: 3 },
  { name: "Jan 12", clients: 9, employers: 2 },
  { name: "Jan 13", clients: 8, employers: 3 },
  { name: "Jan 14", clients: 10, employers: 4 },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="clients" fill="#adfa1d" radius={[4, 4, 0, 0]} name="Clients" />
        <Bar dataKey="employers" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Employers" />
      </BarChart>
    </ResponsiveContainer>
  )
}

