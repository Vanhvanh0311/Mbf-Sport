export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  updated_at?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
