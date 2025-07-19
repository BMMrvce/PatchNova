// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocxfecepcosqsiwevaoh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jeGZlY2VwY29zcXNpd2V2YW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMTQ3NTksImV4cCI6MjA2Nzc5MDc1OX0.LMADGy_W8XvbgBE1MkJp6HqHPGgLh7pt72b1MUoB2Mk' // Replace with your actual anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)