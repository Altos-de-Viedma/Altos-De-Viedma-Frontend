import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IPackage } from '../interfaces';
import { PackageInputs } from '../validators';
import { createPackage } from '../services/actions';




export const useAddPackage = () => {

  const queryClient = useQueryClient();

  const { mutate, isError, error } = useMutation<IPackage, Error, PackageInputs>( {

    mutationFn: createPackage,

    onSuccess: () => {

      queryClient.invalidateQueries( {
        queryKey: [ 'package' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'packages' ],
      } );

    },

    onError: ( err ) => {
      console.error( 'Error adding package:', err );
    },

  } );

  const addPackage = ( newPackage: PackageInputs ) => {
    mutate( newPackage, {
      onSuccess: ( data ) => {
        toast.success( `Paquete creado correctamente: ${ data.title }. ${ data.user.lastName }, ${ data.user.name }` );
      },
      onError: () => {
        toast.error( 'No se pudo guardar el nuevo paquete. Por favor, intente nuevamente.' );
      },
    } );
  };

  return {
    addPackage,
    isError,
    error,
  };
};
