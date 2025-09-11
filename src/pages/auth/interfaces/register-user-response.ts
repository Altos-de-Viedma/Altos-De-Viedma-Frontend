export interface RegisterUserResponse {
  username:          string;
  name:              string;
  lastName:          string;
  lastActivity:      null;
  id:                string;
  creationDate:      string;
  isActive:          boolean;
  roles:             string[];
  token:             string;
}
