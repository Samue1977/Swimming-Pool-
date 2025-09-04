/**
 * Banner Admin Edge Function - COMPLETAMENTE RISCRITTO DA ZERO
 * Gestisce operazioni CRUD per amministrazione banner con CORS perfetto
 */

Deno.serve(async (req) => {
  console.log(`[BANNER-ADMIN] ${req.method} request received at ${new Date().toISOString()}`);
  
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
    console.log('[BANNER-ADMIN] Handling OPTIONS preflight request');
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
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
    let response;

    switch (req.method) {
      case 'GET':
        response = await handleGetBanners(supabaseUrl, supabaseAnonKey, url);
        break;
      case 'POST':
        response = await handleCreateBanner(supabaseUrl, supabaseAnonKey, req);
        break;
      case 'PUT':
      case 'PATCH':
        response = await handleUpdateBanner(supabaseUrl, supabaseAnonKey, req, url);
        break;
      case 'DELETE':
        response = await handleDeleteBanner(supabaseUrl, supabaseAnonKey, url);
        break;
      default:
        throw new Error(`Method ${req.method} not supported`);
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[BANNER-ADMIN] Error occurred:', error);
    
    const errorResponse = {
      success: false,
      error: error.message || 'Internal server error',
      code: 'BANNER_ADMIN_ERROR',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Handle GET - List all banners or get specific banner
async function handleGetBanners(supabaseUrl: string, supabaseAnonKey: string, url: URL) {
  const id = url.searchParams.get('id');
  const position = url.searchParams.get('position');
  const limit = parseInt(url.searchParams.get('limit') || '0');
  
  let queryUrl = `${supabaseUrl}/rest/v1/banners?order=created_at.desc`;
  
  if (id) {
    queryUrl += `&id=eq.${id}`;
  }
  if (position) {
    queryUrl += `&position=eq.${encodeURIComponent(position)}`;
  }
  if (limit > 0) {
    queryUrl += `&limit=${limit}`;
  }
  
  console.log(`[BANNER-ADMIN] GET query: ${queryUrl}`);
  
  const response = await fetch(queryUrl, {
    method: 'GET',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`GET request failed: ${response.statusText}`);
  }
  
  const banners = await response.json();
  console.log(`[BANNER-ADMIN] Retrieved ${banners.length} banners`);
  
  return {
    success: true,
    data: banners,
    count: banners.length
  };
}

// Handle POST - Create new banner
async function handleCreateBanner(supabaseUrl: string, supabaseAnonKey: string, req: Request) {
  const bannerData = await req.json();
  console.log(`[BANNER-ADMIN] Creating banner:`, bannerData);
  
  // Add timestamps
  bannerData.created_at = new Date().toISOString();
  bannerData.updated_at = new Date().toISOString();
  
  const response = await fetch(`${supabaseUrl}/rest/v1/banners`, {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(bannerData)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CREATE failed: ${response.statusText} - ${errorText}`);
  }
  
  const createdBanner = await response.json();
  console.log(`[BANNER-ADMIN] Banner created successfully:`, createdBanner[0]?.id);
  
  return {
    success: true,
    data: createdBanner[0],
    message: 'Banner created successfully'
  };
}

// Handle PUT/PATCH - Update existing banner
async function handleUpdateBanner(supabaseUrl: string, supabaseAnonKey: string, req: Request, url: URL) {
  const id = url.searchParams.get('id');
  if (!id) {
    throw new Error('Banner ID is required for update');
  }
  
  const updateData = await req.json();
  updateData.updated_at = new Date().toISOString();
  
  console.log(`[BANNER-ADMIN] Updating banner ${id}:`, updateData);
  
  const response = await fetch(`${supabaseUrl}/rest/v1/banners?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(updateData)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`UPDATE failed: ${response.statusText} - ${errorText}`);
  }
  
  const updatedBanner = await response.json();
  console.log(`[BANNER-ADMIN] Banner updated successfully`);
  
  return {
    success: true,
    data: updatedBanner[0],
    message: 'Banner updated successfully'
  };
}

// Handle DELETE - Delete banner
async function handleDeleteBanner(supabaseUrl: string, supabaseAnonKey: string, url: URL) {
  const id = url.searchParams.get('id');
  if (!id) {
    throw new Error('Banner ID is required for delete');
  }
  
  console.log(`[BANNER-ADMIN] Deleting banner ${id}`);
  
  const response = await fetch(`${supabaseUrl}/rest/v1/banners?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DELETE failed: ${response.statusText} - ${errorText}`);
  }
  
  console.log(`[BANNER-ADMIN] Banner deleted successfully`);
  
  return {
    success: true,
    message: 'Banner deleted successfully',
    deleted_id: id
  };
}