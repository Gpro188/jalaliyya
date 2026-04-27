import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zayjlnnemyoxpssnalmy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheWpsbm5lbXlveHBzc25hbG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNjMwNjIsImV4cCI6MjA5MjgzOTA2Mn0.arnFMVKQatRYZLLxSk3oSCXmd6LGknHO5IXfETOb7dI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
