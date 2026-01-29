import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lgnanqqwuvnmhiernohc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbmFucXF3dXZubWhpZXJub2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODQwMzIsImV4cCI6MjA3MjI2MDAzMn0.HescoIQFLGvzo53Zjbh8jLCJrxU8zNjzcsuY2DbGLgw";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;