import { IUser } from '../../users';

export interface IProperty {
  id:          string;
  status:      boolean;
  date:        Date;
  address:     string;
  description: string;
  isMain:      boolean;
  users:       IUser[];
}
