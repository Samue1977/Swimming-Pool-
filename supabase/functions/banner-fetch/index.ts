/**
 * Banner Fetch Edge Function - COMPLETAMENTE RISCRITTO DA ZERO
 * Recupera banner per posizione specifica con CORS perfetto
 */

Deno.serve(async (req) => {
  console.log(`[BANNER-FETCH] ${req.method} request received at ${new Date().toISOString()}`);
  
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
    console.log('[BANNER-FETCH] Handling OPTIONS preflight request');
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    console.error(`[BANNER-FETCH] Method ${req.method} not allowed`);
    return new Response(JSON.stringify({
      success: false,
      error: 'Method not allowed',
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

    // Parse query parameters
    const url = new URL(req.url);
    const position = url.searchParams.get('position') || 'homepage-hero';
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const active_only = url.searchParams.get('active_only') !== 'false';
    
    console.log(`[BANNER-FETCH] Fetching banners for position: ${position}, limit: ${limit}, active_only: ${active_only}`);

    // Build query with proper filters
    let queryUrl = `${supabaseUrl}/rest/v1/banners?position=eq.${encodeURIComponent(position)}`;
    
    if (active_only) {
      queryUrl += '&is_active=eq.true';
    }
    
    queryUrl += '&order=display_order.asc';
    
    if (limit > 0) {
      queryUrl += `&limit=${limit}`;
    }

    console.log(`[BANNER-FETCH] Query URL: ${queryUrl}`);

    // Execute database query
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[BANNER-FETCH] Database query failed: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Database query failed: ${response.statusText}`);
    }

    const banners = await response.json();
    console.log(`[BANNER-FETCH] Successfully fetched ${banners.length} banners for position ${position}`);

    // Return success response with proper structure
    const successResponse = {
      success: true,
      data: banners,
      meta: {
        position,
        count: banners.length,
        limit,
        active_only,
        timestamp: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[BANNER-FETCH] Error occurred:', error);
    
    const errorResponse = {
      success: false,
      error: error.message || 'Internal server error',
      code: 'BANNER_FETCH_ERROR',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});