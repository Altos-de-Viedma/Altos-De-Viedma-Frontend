import { IProperty } from '../../property';

export interface IVisitor {
  id:                 string;
  dateAndTimeOfVisit: string;
  fullName:           string;
  dni:                string;
  phone:              string;
  description:        string;
  vehiclePlate:       string;
  profilePicture:     string;
  status:             boolean;
  visitCompleted:     boolean;
  date:               Date;
  property:           IProperty;
}
