import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucveknbkcmrqreyseymb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjdmVrbmJrY21ycXJleXNleW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTQ1OTMsImV4cCI6MjA5MjUzMDU5M30.zLYHwH5a0aKilGPs3sNqwymQ-VWJ1y8fKuFMIr8SJJE';

export const supabase = createClient(supabaseUrl, supabaseKey);