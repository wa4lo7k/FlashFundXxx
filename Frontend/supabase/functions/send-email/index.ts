import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface EmailRequest {
  to: string
  subject: string
  html: string
  text?: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html, text }: EmailRequest = await req.json()

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // If no API key is configured, log the email instead of sending
    if (!RESEND_API_KEY) {
      console.log('📧 EMAIL WOULD BE SENT (No API key configured):')
      console.log('To:', to)
      console.log('Subject:', subject)
      console.log('HTML:', html)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email logged (development mode)',
          id: `dev-${Date.now()}`
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send email using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FlashFundX <noreply@flashfundx.com>',
        to: [to],
        subject: subject,
        html: html,
        text: text,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error('Resend API error:', errorData)
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: errorData 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const result = await emailResponse.json()
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        id: result.id,
        message: 'Email sent successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Email function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

/* 
To deploy this function:

1. Install Supabase CLI: npm install -g supabase
2. Login: supabase login
3. Link your project: supabase link --project-ref YOUR_PROJECT_REF
4. Deploy: supabase functions deploy send-email

To set up Resend API key:
1. Go to your Supabase dashboard
2. Navigate to Settings > Edge Functions
3. Add environment variable: RESEND_API_KEY=your_resend_api_key

Alternative email providers you can use:
- SendGrid
- Mailgun
- AWS SES
- Postmark

Just replace the Resend API call with your preferred provider's API.
*/
