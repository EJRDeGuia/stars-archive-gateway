// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cylsbcjqemluouxblywl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bHNiY2pxZW1sdW91eGJseXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzU2NTUsImV4cCI6MjA2NTE1MTY1NX0.C1zOrPY4D1A2470NlLM6NKIM4I0Bj1YW5b_VY5CrfKQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);