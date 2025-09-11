import { UI, Icons } from '../../';


interface Props {
  createText?: string;
  editMode: boolean;

  onOpen: () => void;
}

export const CustomFormsButtons = ( { onOpen, createText, editMode = false }: Props ) => {

  return (
    <div>
      {
        editMode ? (
          <Icons.IoPencilOutline
            size={ 24 }
            className='cursor-pointer'
            onClick={ onOpen }
          />
        )
          : (
            <UI.Button
              onPress={ onOpen }
              color='primary'
              startContent={ <Icons.IoAddOutline size={ 24 } /> }
              className="text-xl"
            >
              { createText }
            </UI.Button>
          )
      }
    </div>
  );
};
