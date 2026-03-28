  import { Icons, UI } from '../../';


  interface Props {
    handleConfirm: () => void;
    handleClose: () => void;
    isPending?: boolean;
  }

  export const CustomFormFooter = ( { handleConfirm, handleClose, isPending = false }: Props ) => {

    return (
      <div className='flex flex-col sm:flex-row justify-center sm:justify-end gap-3 sm:gap-4 w-full'>

        <UI.Button
          className="font-medium transition-all duration-200 hover:scale-105 w-full sm:w-auto min-h-[3rem] sm:min-h-[2.5rem] responsive-text-sm"
          color='danger'
          onClick={ handleClose }
          isDisabled={ isPending }
          startContent={ <Icons.IoArrowBackOutline size={18} /> }
          variant='bordered'
          size="lg"
        >
          Cancelar
        </UI.Button>

        <UI.Button
          className="font-medium transition-all duration-200 hover:scale-105 shadow-md bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto min-h-[3rem] sm:min-h-[2.5rem] responsive-text-sm"
          color='primary'
          variant='solid'
          onClick={ handleConfirm }
          isLoading={ isPending }
          startContent={ !isPending && <Icons.IoSaveOutline size={18} /> }
          type='button'
          size="lg"
        >
          Guardar
        </UI.Button>

      </div>
    );
  };