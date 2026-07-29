import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/supabase';
import { LoginScreen } from '@/screens/LoginScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { session, profile, loading: isAuthLoadingGlobal, signOut } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [sports, setSports] = useState<any[]>([]);
  const [sportsLoading, setSportsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Tự động tải danh sách môn thể thao khi đăng nhập thành công
  useEffect(() => {
    if (session) {
      fetchSports();
    } else {
      setSports([]);
    }
  }, [session]);

  async function fetchSports() {
    setSportsLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase.from('sports').select('*');
      if (error) throw error;
      setSports(data || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi tải danh sách môn thể thao');
    } finally {
      setSportsLoading(false);
    }
  }

  // Đang khởi tạo Auth state
  if (isAuthLoadingGlobal) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0265DC" />
      </View>
    );
  }

  // 1. CHƯA ĐĂNG NHẬP: Hiển thị Màn hình Đăng nhập hoặc Đăng ký chuẩn UI mẫu
  if (!session) {
    if (authMode === 'register') {
      return <RegisterScreen onNavigateToLogin={() => setAuthMode('login')} />;
    }
    return <LoginScreen onNavigateToRegister={() => setAuthMode('register')} />;
  }

  // 2. ĐÃ ĐĂNG NHẬP: Hiển thị Giao diện trang chủ / thông tin tài khoản (Dashboard)
  const displayName = profile?.full_name || session.user?.email || 'Thành viên';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Dashboard */}
          <ThemedView style={styles.heroSection}>
            <ThemedText type="title" style={styles.title}>
              🏆 SportSync App
            </ThemedText>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Hệ thống quản lý giải đấu & kết nối đam mê
            </ThemedText>
          </ThemedView>

          {/* User Card */}
          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={28} color="#0265DC" />
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.userNameText}>
                  Xin chào, {displayName}!
                </ThemedText>
                <ThemedText style={styles.userEmailText}>
                  {session.user?.email}
                </ThemedText>
              </View>
            </View>

            <View style={styles.divider} />

            <ThemedText style={styles.sectionTitle}>🏀 Môn thể thao nổi bật:</ThemedText>

            {errorMessage ? (
              <ThemedText style={styles.errorText}>⚠️ {errorMessage}</ThemedText>
            ) : null}

            {sportsLoading ? (
              <ActivityIndicator size="small" color="#0265DC" style={{ marginVertical: Spacing.three }} />
            ) : (
              <View style={styles.sportsList}>
                {sports.length > 0 ? (
                  sports.map((sport) => (
                    <ThemedView key={sport.id} style={styles.sportItem}>
                      <ThemedText style={styles.sportIcon}>{sport.icon || '🏆'}</ThemedText>
                      <View style={{ flex: 1 }}>
                        <ThemedText style={styles.sportName}>{sport.name}</ThemedText>
                        <ThemedText type="small" style={styles.sportDesc}>
                          {sport.description || 'Giải đấu nội bộ'}
                        </ThemedText>
                      </View>
                    </ThemedView>
                  ))
                ) : (
                  <ThemedText style={styles.emptyText}>Chưa có môn thể thao nào trong DB.</ThemedText>
                )}
              </View>
            )}

            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={signOut}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <ThemedText style={styles.logoutButtonText}>ĐĂNG XUẤT</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  scrollContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.three,
    gap: Spacing.one,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    color: '#0265DC',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  card: {
    width: '100%',
    padding: Spacing.four,
    borderRadius: 16,
    gap: Spacing.three,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: '700',
  },
  userEmailText: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: Spacing.one,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
  sportsList: {
    gap: Spacing.two,
  },
  sportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.three,
  },
  sportIcon: {
    fontSize: 24,
  },
  sportName: {
    fontWeight: '700',
    fontSize: 16,
  },
  sportDesc: {
    opacity: 0.6,
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.three,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
