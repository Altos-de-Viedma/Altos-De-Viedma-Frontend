import { CustomFormsButtons } from './CustomFormsButtons';


interface Props {
  id?: string;
  title: string;
  onOpen: () => void;
}

export const CustomOpenForm = ( { id, title, onOpen }: Props ) => {
  return (
    <div>      {
      id == "" ?
        (
          <CustomFormsButtons
            onOpen={ onOpen }
            createText={ `Nuevo ${ title.toLowerCase() }` }
            editMode={ false }
          />
        )
        :
        (
          <CustomFormsButtons
            onOpen={ onOpen }
            editMode={ true }
          />
        )
    }</div>
  );
};
