export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
}

export interface LoginFormProps {
  onLoginSuccess: () => void;
}

export interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
}
