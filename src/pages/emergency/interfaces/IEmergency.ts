import { IUser } from '../../users';

export interface IEmergency {
  id:             string;
  status:         boolean;
  date:           Date;
  seen:           boolean;
  emergencyEnded: boolean;
  title:          string;
  description:    string;
  user:           IUser;
}