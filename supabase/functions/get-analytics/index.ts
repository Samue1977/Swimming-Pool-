/**
 * Get Analytics Edge Function - SISTEMA ANALYTICS ADMIN PANEL
 * Fornisce statistiche complete per admin dashboard
 */

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase configuration missing');
    }

    console.log('📊 Get Analytics - Starting data collection');

    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    
    // Calcola data di inizio
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateString = startDate.toISOString();

    // Parallelize tutte le query per performance
    const [
      bannersResponse,
      analyticsResponse,
      sofiaStatsResponse,
      topBannersResponse,
      dailyStatsResponse
    ] = await Promise.all([
      // 1. Totale banner attivi
      fetch(`${supabaseUrl}/rest/v1/banners?is_active=eq.true`, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }),
      
      // 2. Analytics banner ultimi X giorni
      fetch(`${supabaseUrl}/rest/v1/banner_analytics?timestamp=gte.${startDateString}`, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }),
      
      // 3. Statistiche Sofia RSS
      fetch(`${supabaseUrl}/rest/v1/sofia_items?status=eq.active`, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }),
      
      // 4. Top performing banners
      fetch(`${supabaseUrl}/rest/v1/banner_analytics?timestamp=gte.${startDateString}&event_type=eq.click&order=timestamp.desc&limit=100`, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }),
      
      // 5. Statistiche giornaliere
      fetch(`${supabaseUrl}/rest/v1/banner_analytics?timestamp=gte.${startDateString}&order=timestamp.desc`, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      })
    ]);

    // Verifica risposte
    if (!bannersResponse.ok || !analyticsResponse.ok || !sofiaStatsResponse.ok) {
      throw new Error('Failed to fetch analytics data');
    }

    const [banners, analytics, sofiaItems, topBanners, dailyEvents] = await Promise.all([
      bannersResponse.json(),
      analyticsResponse.json(),
      sofiaStatsResponse.json(),
      topBannersResponse.json(),
      dailyStatsResponse.json()
    ]);

    // Elaborazione dati analytics
    const totalViews = analytics.filter(a => a.event_type === 'view').length;
    const totalClicks = analytics.filter(a => a.event_type === 'click').length;
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';

    // Top performing banners
    const clicksByBanner = topBanners.reduce((acc, click) => {
      acc[click.banner_id] = (acc[click.banner_id] || 0) + 1;
      return acc;
    }, {});

    const topPerformers = Object.entries(clicksByBanner)
      .map(([bannerId, clicks]) => {
        const banner = banners.find(b => b.id === bannerId);
        return {
          banner_id: bannerId,
          title: banner?.title || 'Unknown Banner',
          clicks: clicks,
          position: banner?.position || 'unknown'
        };
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    // Statistiche giornaliere per grafico
    const dailyStats = {};
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailyStats[dateKey] = { views: 0, clicks: 0 };
    }

    dailyEvents.forEach(event => {
      const dateKey = event.timestamp.split('T')[0];
      if (dailyStats[dateKey]) {
        if (event.event_type === 'view') {
          dailyStats[dateKey].views++;
        } else if (event.event_type === 'click') {
          dailyStats[dateKey].clicks++;
        }
      }
    });

    const chartData = Object.entries(dailyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]) => ({
        date: date,
        views: stats.views,
        clicks: stats.clicks
      }));

    // Distribuzione geografica
    const countryStats = analytics.reduce((acc, event) => {
      if (event.country) {
        acc[event.country] = (acc[event.country] || 0) + 1;
      }
      return acc;
    }, {});

    const topCountries = Object.entries(countryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({ country, events: count }));

    // Sofia RSS Statistics
    const sofiaActiveItems = sofiaItems.length;
    const sofiaByType = sofiaItems.reduce((acc, item) => {
      acc[item.property_type] = (acc[item.property_type] || 0) + 1;
      return acc;
    }, {});

    // Feed Sofia performance
    const sofiaFeedsResponse = await fetch(`${supabaseUrl}/rest/v1/sofia_feeds`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    });

    const sofiaFeeds = sofiaFeedsResponse.ok ? await sofiaFeedsResponse.json() : [];
    
    const feedPerformance = sofiaFeeds.map(feed => {
      const feedItems = sofiaItems.filter(item => item.feed_id === feed.id);
      return {
        name: feed.name,
        status: feed.status,
        items_count: feedItems.length,
        last_success: feed.last_success_fetch,
        category: feed.category
      };
    });

    // Risposta finale
    const analyticsData = {
      success: true,
      period_days: days,
      banners: {
        total_active: banners.length,
        total_views: totalViews,
        total_clicks: totalClicks,
        ctr_percentage: parseFloat(ctr),
        top_performers: topPerformers
      },
      sofia: {
        active_items: sofiaActiveItems,
        property_types: sofiaByType,
        feeds_performance: feedPerformance
      },
      charts: {
        daily_performance: chartData,
        geographic_distribution: topCountries
      },
      insights: {
        best_performing_day: chartData.length > 0 ? 
          chartData.reduce((best, day) => 
            (day.clicks + day.views) > (best.clicks + best.views) ? day : best
          ) : null,
        avg_daily_views: chartData.length > 0 ? 
          Math.round(chartData.reduce((sum, day) => sum + day.views, 0) / chartData.length) : 0,
        avg_daily_clicks: chartData.length > 0 ?
          Math.round(chartData.reduce((sum, day) => sum + day.clicks, 0) / chartData.length) : 0
      }
    };

    console.log('📊 Analytics data compiled successfully');
    
    return new Response(JSON.stringify(analyticsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Analytics error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      code: 'ANALYTICS_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});