"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { formatPrice } from "@/lib/format"

const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

// Formato manual en UTC para que servidor y cliente rendericen igual.
function shortDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number)
  return `${d} ${months[m - 1]}`
}

function compactMoney(v: number) {
  return v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `$${v}`
}

const revenueConfig = {
  revenue: { label: "Ingresos", color: "var(--chart-1)" },
} satisfies ChartConfig

export function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  return (
    <>
      <ChartContainer config={revenueConfig} className="aspect-auto h-64 w-full">
        <AreaChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
          <defs>
            <linearGradient id="fill-revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="0" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={28}
            tickFormatter={shortDate}
          />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={compactMoney} />
          <ChartTooltip
            cursor={{ strokeWidth: 1 }}
            content={
              <ChartTooltipContent
                indicator="line"
                labelFormatter={(_, payload) => shortDate(String(payload?.[0]?.payload?.date ?? ""))}
                formatter={(value) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-muted-foreground">Ingresos</span>
                    <span className="font-semibold tabular-nums text-foreground">{formatPrice(Number(value))}</span>
                  </div>
                )}
              />
            }
          />
          <Area
            dataKey="revenue"
            type="monotone"
            stroke="var(--color-revenue)"
            strokeWidth={2}
            fill="url(#fill-revenue)"
            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
          />
        </AreaChart>
      </ChartContainer>
      {/* Vista de tabla para lectores de pantalla */}
      <table className="sr-only">
        <caption>Ingresos diarios</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}>
              <th scope="row">{shortDate(d.date)}</th>
              <td>{formatPrice(d.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

const categoryConfig = {
  revenue: { label: "Ingresos", color: "var(--chart-1)" },
} satisfies ChartConfig

export function CategoryChart({ data }: { data: { label: string; revenue: number }[] }) {
  return (
    <ChartContainer config={categoryConfig} className="aspect-auto h-72 w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 48 }} barCategoryGap={6}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={92} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideIndicator
              formatter={(value) => (
                <span className="font-semibold tabular-nums text-foreground">{formatPrice(Number(value))}</span>
              )}
            />
          }
        />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} maxBarSize={20}>
          <LabelList
            dataKey="revenue"
            position="right"
            offset={8}
            className="fill-muted-foreground"
            fontSize={11}
            formatter={(v) => compactMoney(Number(v))}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
