import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthInput } from '@/components/auth/AuthInput';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { authService } from '@/services/authService';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onForgotPassword?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ Email.');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      await authService.signInWithEmail({ email, password });
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Đăng nhập Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.logoText}>SportSync</Text>
            <Text style={styles.title}>Chào mừng</Text>
            <Text style={styles.subtitle}>
              Vui lòng đăng nhập để tiếp tục trải nghiệm
            </Text>
          </View>

          {/* Error Message display */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {/* Form Input Section */}
          <View style={styles.formContainer}>
            <AuthInput
              label="EMAIL"
              iconName="mail-outline"
              placeholder="example@sportsync.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <AuthInput
              label="MẬT KHẨU"
              iconName="lock-closed-outline"
              placeholder="••••••••"
              isPassword
              value={password}
              onChangeText={setPassword}
            />

            {/* Quên mật khẩu link */}
            <TouchableOpacity
              style={styles.forgotContainer}
              onPress={onForgotPassword || (() => Alert.alert('Thông báo', 'Tính năng quên mật khẩu đã được gửi đến email'))}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Action Button: Đăng nhập */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <AuthDivider text="Hoặc tiếp tục với" />

            {/* Google Login Button */}
            <GoogleButton onPress={handleGoogleLogin} loading={loading} />

            {/* Footer Navigation Link */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.7}>
                <Text style={styles.footerLink}>Đăng ký tài khoản mới</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Nền kem sáng cao cấp chuẩn ảnh thiết kế
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0265DC',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  formContainer: {
    width: '100%',
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0265DC',
  },
  primaryButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0265DC',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0265DC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    color: '#4B5563',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0265DC',
  },
});
