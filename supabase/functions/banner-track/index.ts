/**
 * Banner Track Edge Function - COMPLETAMENTE RISCRITTO DA ZERO
 * Traccia eventi view/click per analytics con CORS perfetto
 */

Deno.serve(async (req) => {
  console.log(`[BANNER-TRACK] ${req.method} request received at ${new Date().toISOString()}`);
  
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
    console.log('[BANNER-TRACK] Handling OPTIONS preflight request');
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.error(`[BANNER-TRACK] Method ${req.method} not allowed`);
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed. Use POST.',
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

    // Parse request body
    const eventData = await req.json();
    const { banner_id, event_type } = eventData;
    
    console.log(`[BANNER-TRACK] Tracking event:`, { banner_id, event_type });

    // Validate required fields
    if (!banner_id || !event_type) {
      throw new Error('banner_id and event_type are required');
    }

    if (!['view', 'click'].includes(event_type)) {
      throw new Error('event_type must be either "view" or "click"');
    }

    // Extract client information from request
    const clientIP = req.headers.get('cf-connecting-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') ||
                    'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    console.log(`[BANNER-TRACK] Client info - IP: ${clientIP}, UA: ${userAgent?.substring(0, 50)}...`);

    // Insert analytics record
    const analyticsData = {
      banner_id,
      event_type,
      ip_address: clientIP,
      user_agent: userAgent,
      timestamp: new Date().toISOString()
    };

    const analyticsResponse = await fetch(`${supabaseUrl}/rest/v1/banner_analytics`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(analyticsData)
    });

    if (!analyticsResponse.ok) {
      const errorText = await analyticsResponse.text();
      console.error(`[BANNER-TRACK] Analytics insert failed: ${analyticsResponse.status} - ${errorText}`);
      throw new Error(`Analytics tracking failed: ${analyticsResponse.statusText}`);
    }

    console.log(`[BANNER-TRACK] Analytics event recorded successfully`);

    // Update banner counters
    const counterField = event_type === 'click' ? 'click_count' : 'view_count';
    
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/banners?id=eq.${banner_id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        [counterField]: `${counterField}+1`,
        updated_at: new Date().toISOString()
      })
    });

    if (!updateResponse.ok) {
      console.warn(`[BANNER-TRACK] Counter update failed but analytics recorded: ${updateResponse.status}`);
      // Non bloccare per errore di counter update
    } else {
      console.log(`[BANNER-TRACK] Banner ${counterField} updated successfully`);
    }

    // Return success response
    const successResponse = {
      success: true,
      data: {
        banner_id,
        event_type,
        tracked_at: analyticsData.timestamp
      },
      message: `${event_type} event tracked successfully`
    };

    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[BANNER-TRACK] Error occurred:', error);
    
    const errorResponse = {
      success: false,
      error: error.message || 'Internal server error',
      code: 'BANNER_TRACK_ERROR',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});