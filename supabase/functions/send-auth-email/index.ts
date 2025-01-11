import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  name: string;
  confirmationUrl: string;
}

const createEmailTemplate = (name: string, confirmationUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to Founder's Diary</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      width: 120px;
      height: auto;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #0070f3;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Founder's Diary!</h1>
    </div>
    
    <p>Hi ${name},</p>
    
    <p>Thank you for signing up for Founder's Diary. We're excited to have you join our community of entrepreneurs documenting their journey.</p>
    
    <p>To get started, please verify your email address by clicking the button below. This link will expire in 24 hours.</p>
    
    <p style="text-align: center;">
      <a href="${confirmationUrl}" class="button">Verify Email Address</a>
    </p>
    
    <p>Or copy and paste this URL into your browser:</p>
    <p style="word-break: break-all; color: #666;">${confirmationUrl}</p>
    
    <p>For security reasons, this verification link will expire in 24 hours. If you need a new verification link, you can request one by returning to the sign-up page.</p>
    
    <p>If you didn't create an account with Founder's Diary, you can safely ignore this email.</p>
    
    <div class="footer">
      <p>Need help? Contact our support team at support@foundersdiary.com</p>
      <p>&copy; ${new Date().getFullYear()} Founder's Diary. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    const emailRequest: EmailRequest = await req.json();
    console.log("Received email request:", emailRequest);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Founder's Diary <no-reply@foundersdiary.com>",
        to: emailRequest.to,
        subject: "Welcome to Founder's Diary - Verify Your Email",
        html: createEmailTemplate(emailRequest.name, emailRequest.confirmationUrl),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Email sent successfully:", data);

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      console.error("Error sending email:", error);
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in send-auth-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);