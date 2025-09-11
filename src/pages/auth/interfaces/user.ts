export interface LoginResponse {
  user:  User;
  token: string;
}

export interface User {
  id:             string;
  username:       string;
  isActive:       boolean;
  lastActivity:   Date;
  lastName:       string;
  name:           string;
  roles:          string[];
}


export interface AccountVerificationStatus {
  verificationStatus: boolean;
}

export interface ChangePasswordResponse {
  message: string;
}
