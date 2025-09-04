/**
 * AnalyticsDashboard Component - Dashboard completa per analytics banner
 * Con grafici recharts avanzati e esportazione CSV
 */

import React, { useState, useEffect } from 'react'
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
  AreaChart,
  Area
} from 'recharts'
import {
  TrendingUp,
  Download,
  RefreshCw,
  Eye,
  MousePointer,
  BarChart3,
  Calendar,
  Target,
  AlertCircle
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface AnalyticsOverview {
  summary: {
    total_banners: number
    active_banners: number
    total_views: number
    total_clicks: number
    click_through_rate: number
    recent_views: number
    recent_clicks: number
  }
  top_performers: any[]
  positions: any[]
}

interface Banner {
  id: string
  title: string
  views: number
  clicks: number
  ctr: number
  position: string
}

interface AnalyticsDashboardProps {
  className?: string
}

interface DashboardData {
  overview: AnalyticsOverview
  dailyTrends: Array<{
    date: string
    views: number
    clicks: number
    ctr: number
  }>
  topBanners: Array<{
    id: string
    title: string
    views: number
    clicks: number
    ctr: number
    position: string
  }>
  positionAnalysis: Array<{
    position: string
    banners: number
    views: number
    clicks: number
    avgCtr: number
  }>
}

const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  teal: '#14B8A6'
}

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.danger, COLORS.purple]

export function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [dateRange, setDateRange] = useState('30d')

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('📊 [ANALYTICS] Fetching dashboard data...')
      
      const { data: response, error } = await supabase.functions.invoke('get-analytics', {
        body: {
          action: 'overview',
          dateRange,
          includeTrends: true,
          includePositions: true
        }
      })

      if (error) {
        throw new Error(error.message || 'Errore nel recupero analytics')
      }

      const analyticsData = response?.data || response
      console.log('✅ [ANALYTICS] Data received:', analyticsData)

      if (!analyticsData || Object.keys(analyticsData).length === 0) {
        setData(null)
        setError('Nessun dato analytics disponibile')
        return
      }

      // Transform data for charts
      const dashboardData: DashboardData = {
        overview: analyticsData.overview,
        dailyTrends: analyticsData.dailyTrends || [],
        topBanners: analyticsData.topBanners || [],
        positionAnalysis: analyticsData.positionAnalysis || []
      }

      setData(dashboardData)
      setLastRefresh(new Date())
    } catch (err: any) {
      console.error('❌ [ANALYTICS] Error:', err)
      setError(err.message || 'Errore nel caricamento analytics')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    if (!data) return

    const csvData = [
      ['Data', 'Visualizzazioni', 'Click', 'CTR %'],
      ...data.dailyTrends.map(trend => [
        trend.date,
        trend.views,
        trend.clicks,
        trend.ctr
      ])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `analytics-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (loading && !data) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Caricamento analytics...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Analytics</h2>
            <p className="text-gray-600">Monitoraggio performance banner pubblicitari</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="7d">Ultimi 7 giorni</option>
              <option value="30d">Ultimi 30 giorni</option>
              <option value="90d">Ultimi 90 giorni</option>
            </select>
            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={fetchAnalyticsData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Aggiorna</span>
            </button>
          </div>
        </div>
        
        {lastRefresh && (
          <div className="mt-4 text-sm text-gray-500 flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Ultimo aggiornamento: {lastRefresh.toLocaleTimeString('it-IT')}</span>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Errore nel caricamento</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {data && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Visualizzazioni Totali</p>
                  <p className="text-3xl font-bold text-gray-900">{data.overview.summary.total_views.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">+{data.overview.summary.recent_views.toLocaleString()} recenti</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Click Totali</p>
                  <p className="text-3xl font-bold text-gray-900">{data.overview.summary.total_clicks.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">+{data.overview.summary.recent_clicks.toLocaleString()} recenti</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <MousePointer className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">CTR Medio</p>
                  <p className="text-3xl font-bold text-gray-900">{data.overview.summary.click_through_rate.toFixed(2)}%</p>
                  <p className="text-sm text-blue-600 mt-1">Click-through rate</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Banner Attivi</p>
                  <p className="text-3xl font-bold text-gray-900">{data.overview.summary.active_banners}</p>
                  <p className="text-sm text-gray-600 mt-1">su {data.overview.summary.total_banners} totali</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Daily Trends */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendenze Giornaliere</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data.dailyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('it-IT', { month: 'short', day: 'numeric' })}
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stackId="1" 
                    stroke={COLORS.primary} 
                    fill={COLORS.primary}
                    fillOpacity={0.6}
                    name="Visualizzazioni"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="clicks" 
                    stackId="2" 
                    stroke={COLORS.secondary} 
                    fill={COLORS.secondary}
                    fillOpacity={0.8}
                    name="Click"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Banners Performance */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Banner Performance</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.topBanners} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="title"
                    width={120}
                    tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                    stroke="#666"
                    fontSize={11}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="views" fill={COLORS.primary} name="Visualizzazioni" />
                  <Bar dataKey="clicks" fill={COLORS.secondary} name="Click" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Position Analysis Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuzione per Posizione</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.positionAnalysis}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ position, avgCtr }) => `${position}: ${avgCtr.toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="clicks"
                  >
                    {data.positionAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Click']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* CTR Trends */}
            <div className="bg-white rounded-lg shadow-sm border p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Andamento CTR</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.dailyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('it-IT', { month: 'short', day: 'numeric' })}
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    domain={['dataMin - 0.5', 'dataMax + 0.5']}
                    stroke="#666" 
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    formatter={(value: any) => [`${value}%`, 'CTR']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="ctr" 
                    stroke={COLORS.accent} 
                    strokeWidth={3}
                    dot={{ fill: COLORS.accent, strokeWidth: 2, r: 4 }}
                    name="CTR %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}