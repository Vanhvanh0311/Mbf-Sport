import { createClient } from '@supabase/supabase-js'

// Thay thế bằng IP máy tính của bạn nếu chạy trên điện thoại thật (Expo Go)
// Hoặc dùng http://10.0.2.2:8000 nếu chạy máy ảo Android
const supabaseUrl = 'http://10.0.2.2:8000'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
