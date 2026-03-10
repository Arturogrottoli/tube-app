import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores con los de tu proyecto de Supabase
// Los encontrás en Settings -> API
const supabaseUrl = 'https://cqyyvnsagxkzxirpmimv.supabase.co';
const supabaseAnonKey = 'sb_publishable_zv1VKxb9TWFLyUwnWve4Lg_OUOnAOg6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
