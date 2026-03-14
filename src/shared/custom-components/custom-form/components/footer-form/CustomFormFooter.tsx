  import { Icons, UI } from '../../';


  interface Props {
    handleConfirm: () => void;
    handleClose: () => void;
    isPending?: boolean;
  }

  export const CustomFormFooter = ( { handleConfirm, handleClose, isPending = false }: Props ) => {

    return (
      <div className='flex justify-between w-full'>

        <UI.Button
          className="text-md"
          color='danger'
          onClick={ handleClose }
          isDisabled={ isPending }
          startContent={ <Icons.IoArrowBackOutline /> }
          variant='bordered'
        >
          Cancelar
        </UI.Button>

        <UI.Button
          className="text-md"
          color='primary'
          onClick={ handleConfirm }
          isLoading={ isPending }
          startContent={ !isPending && <Icons.IoSaveOutline size={ 24 } /> }
          type='button'
        >
          Guardar
        </UI.Button>

      </div>
    );
  };