import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Tự động phát hiện môi trường để chọn IP phù hợp:
// - Android Emulator: http://10.0.2.2:54321
// - Web / iOS Simulator: http://localhost:54321
// - Điện thoại thật (Expo Go): Vui lòng đổi thành IP máy tính của bạn (Ví dụ: 'http://192.168.1.15:54321')
const getSupabaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:54321';
  }
  // Cho trình duyệt Web hoặc iOS Simulator
  return 'http://localhost:54321';
};

const supabaseUrl = getSupabaseUrl();

// Lấy ANON_KEY chuẩn từ Supabase CLI status của bạn
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
