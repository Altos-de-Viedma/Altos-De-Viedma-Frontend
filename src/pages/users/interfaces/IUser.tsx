

export interface IUser {
  id:           string;
  creationDate: string;
  lastActivity: Date | null;
  isActive:     boolean;
  username:     string;
  name:         string;
  lastName:     string;
  phone:        string;
  address:      string;
  roles:        string[];
  token?:       string;
}
