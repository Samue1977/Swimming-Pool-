/**
 * Sofia RSS Aggregator - SISTEMA PERFETTO PER SOFIA
 * Aggregatore RSS per feed immobiliari con filtri qualità
 */

Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        console.log('🔥 Sofia RSS Aggregator started');

        // Se è una richiesta GET, restituiamo i dati RSS filtrati per la homepage
        if (req.method === 'GET') {
            const url = new URL(req.url);
            const limit = parseInt(url.searchParams.get('limit') || '20');
            const category = url.searchParams.get('category') || 'all';
            
            // Recupera items RSS filtrati per qualità e attività
            let query = `${supabaseUrl}/rest/v1/sofia_items?status=eq.active&quality_score=gte.70&order=published_at.desc`;
            
            if (category !== 'all') {
                // Query per categoria se specifica
                const feedsResponse = await fetch(`${supabaseUrl}/rest/v1/sofia_feeds?category=eq.${category}&status=eq.active`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });
                
                if (feedsResponse.ok) {
                    const feeds = await feedsResponse.json();
                    const feedIds = feeds.map(f => f.id).join(',');
                    if (feedIds) {
                        query += `&feed_id=in.(${feedIds})`;
                    }
                }
            }
            
            query += `&limit=${limit}`;
            
            const itemsResponse = await fetch(query, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });

            if (!itemsResponse.ok) {
                throw new Error('Failed to fetch Sofia RSS items');
            }

            const items = await itemsResponse.json();
            
            // Arricchire dati con info feed
            const enrichedItems = await Promise.all(
                items.map(async (item) => {
                    const feedResponse = await fetch(`${supabaseUrl}/rest/v1/sofia_feeds?id=eq.${item.feed_id}`, {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey
                        }
                    });
                    
                    const feedData = feedResponse.ok ? await feedResponse.json() : [];
                    const feed = feedData[0] || {};
                    
                    return {
                        ...item,
                        feed_name: feed.name || 'Unknown',
                        feed_category: feed.category || 'general'
                    };
                })
            );

            return new Response(JSON.stringify({
                success: true,
                data: enrichedItems,
                meta: {
                    total: enrichedItems.length,
                    category: category,
                    limit: limit
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Logica aggregazione RSS per POST (cron job)
        const feedsResponse = await fetch(`${supabaseUrl}/rest/v1/sofia_feeds?status=eq.active`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!feedsResponse.ok) {
            throw new Error('Failed to fetch RSS feeds');
        }

        const feeds = await feedsResponse.json();
        const results = [];

        // Process each active feed
        for (const feed of feeds) {
            console.log(`Processing feed: ${feed.name}`);
            
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);
                
                const rssResponse = await fetch(feed.source_url, {
                    signal: controller.signal,
                    headers: {
                        'User-Agent': 'ItalyRE.pro Sofia RSS Aggregator 1.0',
                        'Accept': 'application/rss+xml, application/xml, text/xml'
                    }
                });
                
                clearTimeout(timeoutId);

                if (!rssResponse.ok) {
                    throw new Error(`HTTP ${rssResponse.status}: ${rssResponse.statusText}`);
                }

                const rssContent = await rssResponse.text();
                const items = parseRSSContent(rssContent);
                let processedItems = 0;

                for (const item of items.slice(0, 20)) {
                    try {
                        const externalId = await generateItemHash(item.url || item.title);
                        
                        const existingResponse = await fetch(
                            `${supabaseUrl}/rest/v1/sofia_items?feed_id=eq.${feed.id}&external_id=eq.${externalId}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${serviceRoleKey}`,
                                    'apikey': serviceRoleKey
                                }
                            }
                        );

                        const existing = await existingResponse.json();
                        if (existing.length > 0) {
                            continue;
                        }

                        const price = extractPrice(item.title + ' ' + item.description);
                        const propertyType = determinePropertyType(item.title + ' ' + item.description);
                        const qualityScore = calculateQualityScore(item);

                        const insertData = {
                            feed_id: feed.id,
                            external_id: externalId,
                            title: item.title?.substring(0, 500) || 'No title',
                            description: item.description?.substring(0, 1000) || '',
                            url: item.url || '',
                            image_url: item.image || null,
                            price: price,
                            location: extractLocation(item.title + ' ' + item.description),
                            property_type: propertyType,
                            published_at: item.pubDate || new Date().toISOString(),
                            quality_score: qualityScore,
                            status: qualityScore >= 70 ? 'active' : 'review'
                        };

                        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/sofia_items`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${serviceRoleKey}`,
                                'apikey': serviceRoleKey,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(insertData)
                        });

                        if (insertResponse.ok) {
                            processedItems++;
                        }
                    } catch (itemError) {
                        console.warn(`Error processing item: ${itemError.message}`);
                    }
                }

                results.push({
                    feed_id: feed.id,
                    feed_name: feed.name,
                    processed_items: processedItems,
                    status: 'success'
                });

                await fetch(`${supabaseUrl}/rest/v1/sofia_feeds?id=eq.${feed.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        last_success_fetch: new Date().toISOString(),
                        last_error: null
                    })
                });

            } catch (feedError) {
                console.error(`Feed ${feed.name} error: ${feedError.message}`);
                results.push({
                    feed_id: feed.id,
                    feed_name: feed.name,
                    processed_items: 0,
                    status: 'error',
                    error: feedError.message
                });

                await fetch(`${supabaseUrl}/rest/v1/sofia_feeds?id=eq.${feed.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        last_error: feedError.message
                    })
                });
            }
        }

        return new Response(JSON.stringify({
            success: true,
            processed_feeds: results.length,
            results: results
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Sofia RSS Aggregator error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

// Utility functions per parsing RSS
function parseRSSContent(rssContent: string) {
    const items = [];
    
    // Regex per estrarre items RSS
    const itemPattern = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let itemMatch;
    
    while ((itemMatch = itemPattern.exec(rssContent)) !== null) {
        const itemContent = itemMatch[1];
        
        const title = extractXMLTag(itemContent, 'title');
        const description = extractXMLTag(itemContent, 'description');
        const link = extractXMLTag(itemContent, 'link');
        const pubDate = extractXMLTag(itemContent, 'pubDate');
        
        // Cerca immagini in enclosure o media:content
        let image = null;
        const enclosureMatch = itemContent.match(/<enclosure[^>]+url="([^"]+)"[^>]*type="image/i);
        if (enclosureMatch) {
            image = enclosureMatch[1];
        } else {
            const mediaMatch = itemContent.match(/<media:content[^>]+url="([^"]+)"[^>]*type="image/i);
            if (mediaMatch) {
                image = mediaMatch[1];
            }
        }
        
        items.push({
            title: cleanHTML(title),
            description: cleanHTML(description),
            url: link,
            pubDate: pubDate,
            image: image
        });
    }
    
    return items;
}

function extractXMLTag(content: string, tagName: string): string {
    const pattern = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, 'i');
    const match = content.match(pattern);
    return match ? match[1].trim() : '';
}

function cleanHTML(text: string): string {
    if (!text) return '';
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}

async function generateItemHash(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

function extractPrice(text: string): number | null {
    if (!text) return null;
    
    const pricePatterns = [
        /€\s*([0-9]+(?:\.[0-9]{3})*(?:,[0-9]{2})?)/g,
        /([0-9]+(?:\.[0-9]{3})*(?:,[0-9]{2})?)\s*€/g,
        /\$\s*([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{2})?)/g,
        /([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{2})?)\s*\$/g
    ];
    
    for (const pattern of pricePatterns) {
        const match = pattern.exec(text);
        if (match) {
            const priceStr = match[1].replace(/[.,]/g, '');
            return parseInt(priceStr, 10);
        }
    }
    
    return null;
}

function determinePropertyType(text: string): string {
    const lowText = text.toLowerCase();
    
    if (lowText.includes('appartamento') || lowText.includes('apartment')) return 'Appartamento';
    if (lowText.includes('villa') || lowText.includes('house')) return 'Villa';
    if (lowText.includes('ufficio') || lowText.includes('office')) return 'Ufficio';
    if (lowText.includes('negozio') || lowText.includes('shop')) return 'Commerciale';
    if (lowText.includes('terreno') || lowText.includes('land')) return 'Terreno';
    
    return 'Immobile';
}

function extractLocation(text: string): string | null {
    const locationPatterns = [
        /(?:a|in|di)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
        /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*,/g
    ];
    
    for (const pattern of locationPatterns) {
        const match = pattern.exec(text);
        if (match && match[1].length > 2) {
            return match[1];
        }
    }
    
    return null;
}

function calculateQualityScore(item: any): number {
    let score = 50; // Base score
    
    if (item.title && item.title.length > 10) score += 20;
    if (item.description && item.description.length > 50) score += 15;
    if (item.image) score += 10;
    if (item.url && item.url.startsWith('http')) score += 5;
    
    return Math.min(score, 100);
}