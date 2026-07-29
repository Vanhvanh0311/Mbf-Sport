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
import { Ionicons } from '@expo/vector-icons';
import { AuthInput } from '@/components/auth/AuthInput';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { authService } from '@/services/authService';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');
    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và Tên của bạn.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ Email.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      // Đăng ký tài khoản mới + truyền fullName cho Trigger SQL tự lưu vào bảng profiles!
      await authService.signUpWithEmail({ email, password, fullName });
      Alert.alert(
        'Đăng ký thành công 🎉',
        'Tài khoản của bạn đã được khởi tạo. Bạn có thể đăng nhập ngay!',
        [{ text: 'Đăng nhập', onPress: onNavigateToLogin }]
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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
          {/* Top Back Navigation Header */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={onNavigateToLogin}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#0265DC" />
            <Text style={styles.backButtonText}>Đăng nhập</Text>
          </TouchableOpacity>

          {/* Title Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Tham gia SportSync</Text>
            <Text style={styles.subtitle}>Kết nối đam mê thể thao nội bộ</Text>
          </View>

          {/* Display Error Box */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {/* Form Input Section */}
          <View style={styles.formContainer}>
            <AuthInput
              label="HỌ VÀ TÊN"
              iconName="person-outline"
              placeholder="Hoàng"
              value={fullName}
              onChangeText={setFullName}
            />

            <AuthInput
              label="EMAIL"
              iconName="mail-outline"
              placeholder="email@company.com"
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

            {/* Action Button: Đăng ký */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <AuthDivider text="Hoặc tiếp tục với" />

            {/* Google Login Button */}
            <GoogleButton onPress={handleGoogleLogin} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Nền kem sáng mượt chuẩn thiết kế mẫu
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0265DC',
    marginLeft: 6,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
