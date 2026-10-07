import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#2563eb', '#0f766e', '#b7791f', '#7c3aed', '#be123c', '#475569'];

export default function AnalyticsChart({
  title,
  data,
  type = 'bar',
  emptyMessage = 'Aucune donnée disponible pour le moment.',
  note,
}) {
  const sourceData = Array.isArray(data) ? data : [];
  const chartData = type === 'pie'
    ? sourceData.filter((item) => Number(item.value) > 0)
    : sourceData.filter((item) => Number(item.value) >= 0);
  const hasValues = chartData.some((item) => Number(item.value) > 0);

  return (
    <section className="k-card min-w-0 p-5" aria-label={title}>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {note && <p className="mt-1 text-xs leading-5 text-slate-500">{note}</p>}
      </div>
      {!hasValues ? (
        <div className="grid min-h-56 place-items-center rounded-lg bg-slate-50 px-5 text-center text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="h-64 w-full min-w-0" role="img" aria-label={title}>
          <ResponsiveContainer width="100%" height="100%">
            {type === 'pie' ? (
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={88} paddingAngle={3}>
                  {chartData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#eff6ff' }} />
                <Bar dataKey="value" name="Nombre" fill="#2563eb" radius={[5, 5, 0, 0]} maxBarSize={52} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
