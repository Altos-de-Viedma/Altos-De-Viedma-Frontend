import { UI } from '../../../shared';


interface RoleChipsProps {
  roles: string[];
}

export const RoleChips: React.FC<RoleChipsProps> = ( { roles } ) => {
  return (
    <div className="flex flex-wrap gap-2">
      { roles.map( ( role, index ) => (
        <UI.Chip key={ index } className="capitalize">
          { role }
        </UI.Chip>
      ) ) }
    </div>
  );
};
