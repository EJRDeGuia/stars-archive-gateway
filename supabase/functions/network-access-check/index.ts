import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configure authorized IP ranges for your institution
const AUTHORIZED_IP_RANGES = [
  // Example: School network IP ranges
  '192.168.1.0/24',    // Local network range
  '10.0.0.0/16',       // Private network range
  '172.16.0.0/12',     // Another private range
  '203.124.56.0/24',   // Example public IP range for school
  // Add your actual school/authorized network IP ranges here
];

// Specific authorized IPs
const AUTHORIZED_IPS = [
  '127.0.0.1',         // Localhost
  '::1',               // IPv6 localhost
  // Add specific IPs that should have access
];

interface NetworkCheckRequest {
  forceCheck?: boolean;
  userAgent?: string;
}

function isIPInRange(ip: string, cidr: string): boolean {
  if (!ip || !cidr) return false;
  
  const [range, bits] = cidr.split('/');
  if (!bits) return ip === range;
  
  const mask = (~0 << (32 - parseInt(bits))) >>> 0;
  const ipInt = ipToInt(ip);
  const rangeInt = ipToInt(range);
  
  if (ipInt === null || rangeInt === null) return false;
  
  return (ipInt & mask) === (rangeInt & mask);
}

function ipToInt(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  
  let result = 0;
  for (let i = 0; i < 4; i++) {
    const part = parseInt(parts[i]);
    if (isNaN(part) || part < 0 || part > 255) return null;
    result = (result << 8) + part;
  }
  return result >>> 0; // Convert to unsigned 32-bit
}

function checkAuthorizedNetwork(clientIP: string): {
  allowed: boolean;
  reason: string;
  networkType: 'authorized' | 'external' | 'localhost';
  detectedIP: string;
} {
  console.log('Checking network access for IP:', clientIP);
  
  // Clean and normalize IP
  const cleanIP = clientIP.replace(/^::ffff:/, ''); // Remove IPv4-mapped IPv6 prefix
  
  // Check if it's localhost
  if (AUTHORIZED_IPS.includes(cleanIP) || cleanIP === '127.0.0.1' || cleanIP === '::1') {
    return {
      allowed: true,
      reason: 'Localhost access granted',
      networkType: 'localhost',
      detectedIP: cleanIP
    };
  }
  
  // Check against authorized IP ranges
  for (const range of AUTHORIZED_IP_RANGES) {
    if (isIPInRange(cleanIP, range)) {
      return {
        allowed: true,
        reason: `Access granted from authorized network range: ${range}`,
        networkType: 'authorized',
        detectedIP: cleanIP
      };
    }
  }
  
  // Check against specific authorized IPs
  for (const authIP of AUTHORIZED_IPS) {
    if (cleanIP === authIP) {
      return {
        allowed: true,
        reason: `Access granted from authorized IP: ${authIP}`,
        networkType: 'authorized',
        detectedIP: cleanIP
      };
    }
  }
  
  return {
    allowed: false,
    reason: `Access denied from unauthorized network. Your IP: ${cleanIP}`,
    networkType: 'external',
    detectedIP: cleanIP
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Extract client IP from various possible headers
    const clientIP = 
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-client-ip') ||
      '127.0.0.1'; // Default to localhost if no IP detected

    console.log('Client IP detected:', clientIP);
    
    // Get request body for any additional parameters
    let body: NetworkCheckRequest = {};
    try {
      if (req.method === 'POST') {
        body = await req.json();
      }
    } catch (e) {
      // Body parsing failed, continue with empty body
      console.log('No JSON body provided or parsing failed');
    }

    // Perform network authorization check
    const networkCheck = checkAuthorizedNetwork(clientIP);
    
    // Log the access attempt for audit purposes
    const auditData = {
      client_ip: clientIP,
      user_agent: req.headers.get('user-agent') || body.userAgent || 'Unknown',
      access_allowed: networkCheck.allowed,
      network_type: networkCheck.networkType,
      reason: networkCheck.reason,
      timestamp: new Date().toISOString(),
      headers: {
        'x-forwarded-for': req.headers.get('x-forwarded-for'),
        'x-real-ip': req.headers.get('x-real-ip'),
        'cf-connecting-ip': req.headers.get('cf-connecting-ip')
      }
    };

    console.log('Network access check result:', auditData);

    // Optionally store audit log in database
    try {
      const { error: logError } = await supabase
        .from('audit_logs')
        .insert({
          action: 'network_access_check',
          resource_type: 'network_security',
          details: auditData,
          severity: networkCheck.allowed ? 'low' : 'medium',
          category: 'network_access'
        });
      
      if (logError) {
        console.error('Failed to store audit log:', logError);
      }
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    const response = {
      allowed: networkCheck.allowed,
      reason: networkCheck.reason,
      networkType: networkCheck.networkType,
      clientIP: networkCheck.detectedIP,
      timestamp: new Date().toISOString(),
      // Only include debug info in development
      debug: Deno.env.get('ENVIRONMENT') === 'development' ? auditData : undefined
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );

  } catch (error: unknown) {
    console.error('Network access check failed:', error);
    
    // In case of error, deny access for security
    const errorResponse = {
      allowed: false,
      reason: 'Network access verification failed',
      networkType: 'external' as const,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});