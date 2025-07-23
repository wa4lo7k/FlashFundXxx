// Supabase Edge Function: Debug webhook calls from NowPayments

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  try {
    console.log('=== WEBHOOK DEBUG ===')
    console.log('Method:', req.method)
    console.log('URL:', req.url)
    console.log('Headers:', Object.fromEntries(req.headers.entries()))
    
    if (req.method === 'POST') {
      const body = await req.text()
      console.log('Body:', body)
      
      try {
        const jsonBody = JSON.parse(body)
        console.log('Parsed JSON:', jsonBody)
      } catch (e) {
        console.log('Body is not valid JSON')
      }
    }
    
    console.log('=== END DEBUG ===')
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook debug received',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Debug webhook error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
