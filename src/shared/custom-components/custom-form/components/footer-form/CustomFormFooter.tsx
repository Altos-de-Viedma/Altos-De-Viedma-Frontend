  import { Icons, UI } from '../../';


  interface Props {
    handleConfirm: () => void;
    handleClose: () => void;
    isPending?: boolean;
  }

  export const CustomFormFooter = ( { handleConfirm, handleClose, isPending = false }: Props ) => {

    return (
      <div className='flex justify-between w-full gap-3'>

        <UI.Button
          className="font-medium transition-all duration-200 hover:scale-105"
          color='danger'
          onClick={ handleClose }
          isDisabled={ isPending }
          startContent={ <Icons.IoArrowBackOutline size={18} /> }
          variant='bordered'
          size="md"
        >
          Cancelar
        </UI.Button>

        <UI.Button
          className="font-medium transition-all duration-200 hover:scale-105 shadow-md bg-blue-600 hover:bg-blue-700 text-white"
          color='primary'
          variant='solid'
          onClick={ handleConfirm }
          isLoading={ isPending }
          startContent={ !isPending && <Icons.IoSaveOutline size={18} /> }
          type='button'
          size="md"
        >
          Guardar
        </UI.Button>

      </div>
    );
  };