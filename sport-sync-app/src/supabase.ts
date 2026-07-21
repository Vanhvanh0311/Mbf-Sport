import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Tự động phát hiện môi trường để chọn IP phù hợp:
// - Android Emulator: http://10.0.2.2:8000
// - Web / iOS Simulator: http://localhost:8000
// - Điện thoại thật (Expo Go): Vui lòng đổi thành IP máy tính của bạn (Ví dụ: 'http://192.168.1.15:8000')
const getSupabaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }
  // Cho trình duyệt Web hoặc iOS Simulator
  return 'http://localhost:8000';
};

const supabaseUrl = getSupabaseUrl();

// Lấy ANON_KEY chuẩn từ file .env của Supabase Docker local của bạn
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
