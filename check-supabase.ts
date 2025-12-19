import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking Supabase tables via PostgREST...');
  
  try {
    const { data, error } = await supabase.from('publications').select('id').limit(1);
    if (error) throw error;
    console.log('✅ select from publications successful');
    console.log('Data:', data);
  } catch (error: any) {
    console.error('❌ select from publications failed:', error.message);
  }

  try {
    const { data, error } = await supabase.from('posts').select('id').limit(1);
    if (error) throw error;
    console.log('✅ select from posts successful');
    console.log('Data:', data);
  } catch (error: any) {
    console.error('❌ select from posts failed:', error.message);
  }

  try {
    const { data, error } = await supabase.from('user_profiles').select('id').limit(1);
    if (error) throw error;
    console.log('✅ select from user_profiles successful');
    console.log('Data:', data);
  } catch (error: any) {
    console.error('❌ select from user_profiles failed:', error.message);
  }
}

check().catch(console.error);
