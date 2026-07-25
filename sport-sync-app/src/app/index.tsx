import * as Device from 'expo-device';
import { Platform, StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabase';
import { useAuth } from '@/contexts/AuthContext';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const { session, loading: isAuthLoadingGlobal, signOut } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [sportsLoading, setSportsLoading] = useState(false);
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // App State
  const [sports, setSports] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 1. Tự động lấy danh sách môn thể thao khi đăng nhập thành công
  useEffect(() => {
    if (session) {
      fetchSports();
    } else {
      setSports([]);
    }
    setErrorMessage('');
    setStatusMessage('');
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
      console.error(err);
    } finally {
      setSportsLoading(false);
    }
  }

  // 2. Xử lý Đăng nhập / Đăng ký
  async function handleAuth() {
    if (!email || !password) {
      setErrorMessage('Vui lòng điền đầy đủ Email và Mật khẩu.');
      return;
    }
    setAuthLoading(true);
    setErrorMessage('');
    setStatusMessage('');

    try {
      if (isSignUp) {
        // Đăng ký tài khoản mới
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        setStatusMessage('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
        setIsSignUp(false);
        setPassword('');
      } else {
        // Đăng nhập
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Thao tác thất bại');
    } finally {
      setAuthLoading(false);
    }
  }

  // 3. Xử lý Đăng xuất
  async function handleLogout() {
    setAuthLoading(true);
    try {
      await signOut();
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng xuất thất bại');
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.heroSection}>
            <ThemedText type="title" style={styles.title}>
              🏆 Sport Sync App
            </ThemedText>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Hệ thống quản lý giải đấu & tính điểm
            </ThemedText>
          </ThemedView>

          {/* HIỂN THỊ THÔNG BÁO LỖI / THÀNH CÔNG */}
          {errorMessage ? (
            <ThemedView style={[styles.messageBox, styles.errorBox]}>
              <ThemedText style={styles.errorText}>⚠️ {errorMessage}</ThemedText>
            </ThemedView>
          ) : null}

          {statusMessage ? (
            <ThemedView style={[styles.messageBox, styles.successBox]}>
              <ThemedText style={styles.successText}>✅ {statusMessage}</ThemedText>
            </ThemedView>
          ) : null}

          {/* GIAO DIỆN CHƯA ĐĂNG NHẬP (AUTH FORM) */}
          {!session ? (
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText style={styles.cardTitle}>
                {isSignUp ? 'Đăng ký tài khoản' : 'Đăng nhập hệ thống'}
              </ThemedText>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Địa chỉ Email"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleAuth}
                disabled={authLoading}
              >
                {authLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.buttonText}>
                    {isSignUp ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}
                  </ThemedText>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMessage('');
                  setStatusMessage('');
                }}
                style={styles.switchButton}
              >
                <ThemedText style={styles.switchText}>
                  {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ) : (
            /* GIAO DIỆN ĐÃ ĐĂNG NHẬP THÀNH CÔNG */
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText style={styles.cardTitle}>🎉 Đăng nhập thành công!</ThemedText>
              <ThemedText style={styles.emailText}>Tài khoản: {session.user?.email}</ThemedText>

              <View style={styles.divider} />

              <ThemedText style={styles.sectionTitle}>🏀 Danh mục môn thể thao:</ThemedText>

              {sportsLoading ? (
                <ActivityIndicator size="small" color="#3B82F6" style={{ marginVertical: Spacing.three }} />
              ) : (
                <View style={styles.sportsList}>
                  {sports.length > 0 ? (
                    sports.map((sport) => (
                      <ThemedView key={sport.id} style={styles.sportItem}>
                        <ThemedText style={styles.sportIcon}>{sport.icon || '❔'}</ThemedText>
                        <View style={{ flex: 1 }}>
                          <ThemedText style={styles.sportName}>{sport.name}</ThemedText>
                          <ThemedText type="small" style={styles.sportDesc}>
                            {sport.description || 'Chưa có mô tả'}
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
                style={[styles.button, styles.logoutButton]} 
                onPress={handleLogout}
                disabled={authLoading}
              >
                <ThemedText style={styles.buttonText}>ĐĂNG XUẤT</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
    marginVertical: Spacing.four,
    gap: Spacing.one,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  card: {
    width: '100%',
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.three,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  inputContainer: {
    gap: Spacing.two,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#fff',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    marginTop: Spacing.four,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  switchText: {
    color: '#3B82F6',
    fontSize: 14,
  },
  emailText: {
    textAlign: 'center',
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: Spacing.two,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
    borderRadius: Spacing.two,
    gap: Spacing.three,
  },
  sportIcon: {
    fontSize: 24,
  },
  sportName: {
    fontWeight: 'bold',
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
  messageBox: {
    width: '100%',
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  successBox: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E',
    borderWidth: 1,
  },
  errorText: {
    color: '#FCA5A5',
    fontWeight: 'bold',
  },
  successText: {
    color: '#86EFAC',
    fontWeight: 'bold',
  },
});
