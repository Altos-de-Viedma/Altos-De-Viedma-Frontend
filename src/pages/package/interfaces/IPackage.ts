import { IProperty } from '../../property';
import { IUser } from '../../users';


export interface IPackage {
  id:          string;
  status:      boolean;
  received:    boolean;
  date:        Date;
  arrivalDate: string;
  title:       string;
  description: string;
  user:        IUser;
  property:    IProperty;
}
