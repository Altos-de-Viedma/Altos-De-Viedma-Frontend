  import { Icons, UI } from '../../';

  
  interface Props {
    handleConfirm: () => void;
    handleClose: () => void;
  }

  export const CustomFormFooter = ( { handleConfirm, handleClose }: Props ) => {

    return (
      <div className='flex justify-between w-full'>

        <UI.Button
          className="text-md"
          color='danger'
          onClick={ handleClose }
          startContent={ <Icons.IoArrowBackOutline /> }
          variant='bordered'
        >
          Cancelar
        </UI.Button>

        <UI.Button
          className="text-md"
          color='primary'
          onClick={ handleConfirm }
          startContent={ <Icons.IoSaveOutline size={ 24 } /> }
          type='button'
        >
          Guardar
        </UI.Button>

      </div>
    );
  };