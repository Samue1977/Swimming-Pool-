/**
 * Banner Analytics Edge Function - COMPLETAMENTE RISCRITTO DA ZERO
 * Fornisce dati analytics per dashboard con CORS perfetto
 */

Deno.serve(async (req) => {
  console.log(`[BANNER-ANALYTICS] ${req.method} request received at ${new Date().toISOString()}`);
  
  // CORS headers perfetti per evitare Failed to fetch
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('[BANNER-ANALYTICS] Handling OPTIONS preflight request');
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    console.error(`[BANNER-ANALYTICS] Method ${req.method} not allowed`);
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed. Use GET.',
      code: 'METHOD_NOT_ALLOWED'
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Get Supabase configuration from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing');
    }

    const url = new URL(req.url);
    const reportType = url.searchParams.get('type') || 'overview';
    const days = parseInt(url.searchParams.get('days') || '30');
    
    console.log(`[BANNER-ANALYTICS] Generating ${reportType} report for last ${days} days`);

    let analyticsData;

    switch (reportType) {
      case 'overview':
        analyticsData = await getOverviewAnalytics(supabaseUrl, supabaseAnonKey, days);
        break;
      case 'performance':
        analyticsData = await getPerformanceAnalytics(supabaseUrl, supabaseAnonKey, days);
        break;
      case 'timeline':
        analyticsData = await getTimelineAnalytics(supabaseUrl, supabaseAnonKey, days);
        break;
      case 'export':
        analyticsData = await getExportData(supabaseUrl, supabaseAnonKey, days);
        break;
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }

    return new Response(JSON.stringify({
      success: true,
      data: analyticsData,
      meta: {
        report_type: reportType,
        days_included: days,
        generated_at: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[BANNER-ANALYTICS] Error occurred:', error);
    
    const errorResponse = {
      success: false,
      error: error.message || 'Internal server error',
      code: 'BANNER_ANALYTICS_ERROR',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Get overview analytics with summary stats
async function getOverviewAnalytics(supabaseUrl: string, supabaseAnonKey: string, days: number) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);
  const sinceDateStr = sinceDate.toISOString();
  
  console.log(`[BANNER-ANALYTICS] Getting overview since ${sinceDateStr}`);

  // Get banner performance summary
  const performanceQuery = `${supabaseUrl}/rest/v1/banners?select=id,title,position,view_count,click_count,created_at&order=view_count.desc`;
  
  const performanceResponse = await fetch(performanceQuery, {
    method: 'GET',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!performanceResponse.ok) {
    throw new Error('Failed to fetch banner performance data');
  }
  
  const banners = await performanceResponse.json();
  
  // Calculate totals
  const totalViews = banners.reduce((sum: number, banner: any) => sum + (banner.view_count || 0), 0);
  const totalClicks = banners.reduce((sum: number, banner: any) => sum + (banner.click_count || 0), 0);
  const totalBanners = banners.length;
  const activeBanners = banners.filter((b: any) => b.is_active !== false).length;
  const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews * 100) : 0;
  
  // Get recent activity count
  const recentActivityQuery = `${supabaseUrl}/rest/v1/banner_analytics?timestamp=gte.${sinceDateStr}&select=event_type`;
  
  const activityResponse = await fetch(recentActivityQuery, {
    method: 'GET',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
  });
  
  let recentActivity = [];
  if (activityResponse.ok) {
    recentActivity = await activityResponse.json();
  }
  
  const recentViews = recentActivity.filter((a: any) => a.event_type === 'view').length;
  const recentClicks = recentActivity.filter((a: any) => a.event_type === 'click').length;
  
  return {
    summary: {
      total_banners: totalBanners,
      active_banners: activeBanners,
      total_views: totalViews,
      total_clicks: totalClicks,
      click_through_rate: parseFloat(clickThroughRate.toFixed(2)),
      recent_views: recentViews,
      recent_clicks: recentClicks
    },
    top_performers: banners.slice(0, 5),
    positions: getPositionBreakdown(banners)
  };
}

// Get detailed performance analytics
async function getPerformanceAnalytics(supabaseUrl: string, supabaseAnonKey: string, days: number) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);
  
  // Get detailed banner stats with recent activity
  const bannerQuery = `${supabaseUrl}/rest/v1/banners?select=*&order=view_count.desc`;
  
  const bannerResponse = await fetch(bannerQuery, {
    method: 'GET',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!bannerResponse.ok) {
    throw new Error('Failed to fetch performance data');
  }
  
  const banners = await bannerResponse.json();
  
  // Calculate performance metrics for each banner
  const performance = banners.map((banner: any) => {
    const ctr = banner.view_count > 0 ? (banner.click_count / banner.view_count * 100) : 0;
    
    return {
      id: banner.id,
      title: banner.title,
      position: banner.position,
      views: banner.view_count || 0,
      clicks: banner.click_count || 0,
      ctr: parseFloat(ctr.toFixed(2)),
      is_active: banner.is_active,
      created_at: banner.created_at,
      performance_score: calculatePerformanceScore(banner.view_count || 0, banner.click_count || 0)
    };
  });
  
  return {
    banners: performance,
    averages: {
      avg_views: performance.reduce((sum, b) => sum + b.views, 0) / performance.length,
      avg_clicks: performance.reduce((sum, b) => sum + b.clicks, 0) / performance.length,
      avg_ctr: performance.reduce((sum, b) => sum + b.ctr, 0) / performance.length
    }
  };
}

// Get timeline analytics for charts
async function getTimelineAnalytics(supabaseUrl: string, supabaseAnonKey: string, days: number) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);
  const sinceDateStr = sinceDate.toISOString();
  
  // Get daily activity data
  const timelineQuery = `${supabaseUrl}/rest/v1/banner_analytics?timestamp=gte.${sinceDateStr}&order=timestamp.desc`;
  
  const timelineResponse = await fetch(timelineQuery, {
    method: 'GET',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!timelineResponse.ok) {
    throw new Error('Failed to fetch timeline data');
  }
  
  const events = await timelineResponse.json();
  
  // Group by date
  const dailyStats: Record<string, { views: number; clicks: number }> = {};
  
  events.forEach((event: any) => {
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    
    if (!dailyStats[date]) {
      dailyStats[date] = { views: 0, clicks: 0 };
    }
    
    if (event.event_type === 'view') {
      dailyStats[date].views++;
    } else if (event.event_type === 'click') {
      dailyStats[date].clicks++;
    }
  });
  
  // Convert to array format for charts
  const timeline = Object.entries(dailyStats)
    .map(([date, stats]) => ({
      date,
      views: stats.views,
      clicks: stats.clicks,
      ctr: stats.views > 0 ? (stats.clicks / stats.views * 100) : 0
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  return {
    daily_timeline: timeline,
    total_events: events.length
  };
}

// Get data for CSV export
async function getExportData(supabaseUrl: string, supabaseAnonKey: string, days: number) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);
  const sinceDateStr = sinceDate.toISOString();
  
  // Get detailed event data for export
  const exportQuery = `${supabaseUrl}/rest/v1/banner_analytics?timestamp=gte.${sinceDateStr}&order=timestamp.desc`;
  
  const exportResponse = await fetch(exportQuery, {
    method: 'GET',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!exportResponse.ok) {
    throw new Error('Failed to fetch export data');
  }
  
  const events = await exportResponse.json();
  
  // Format for CSV export
  const csvData = events.map((event: any) => ({
    timestamp: event.timestamp,
    banner_id: event.banner_id,
    event_type: event.event_type,
    ip_address: event.ip_address,
    country: event.country || 'Unknown'
  }));
  
  return {
    events: csvData,
    total_count: csvData.length,
    date_range: {
      from: sinceDateStr,
      to: new Date().toISOString()
    }
  };
}

// Helper function to calculate performance score
function calculatePerformanceScore(views: number, clicks: number): number {
  if (views === 0) return 0;
  const ctr = (clicks / views) * 100;
  return parseFloat((views * 0.3 + clicks * 0.7 + ctr * 10).toFixed(1));
}

// Helper function to get position breakdown
function getPositionBreakdown(banners: any[]) {
  const positions: Record<string, { count: number; views: number; clicks: number }> = {};
  
  banners.forEach(banner => {
    const pos = banner.position || 'unknown';
    
    if (!positions[pos]) {
      positions[pos] = { count: 0, views: 0, clicks: 0 };
    }
    
    positions[pos].count++;
    positions[pos].views += banner.view_count || 0;
    positions[pos].clicks += banner.click_count || 0;
  });
  
  return Object.entries(positions).map(([position, stats]) => ({
    position,
    banner_count: stats.count,
    total_views: stats.views,
    total_clicks: stats.clicks,
    avg_ctr: stats.views > 0 ? (stats.clicks / stats.views * 100) : 0
  }));
}