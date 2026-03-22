import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IPackage } from '../interfaces';
import { PackageInputs } from '../validators';
import { updatePackage } from '../services';

export const usePackageUpdate = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation<IPackage, Error, { packageData: PackageInputs; id: string; }>( {

    mutationFn: ( { packageData, id } ) => updatePackage( packageData, id ),

    onSuccess: ( data ) => {

      queryClient.invalidateQueries( {
        queryKey: [ 'package' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'packages' ]
      } );

      toast.success( `Paquete actualizado correctamente: ${ data.title }, ${ data.user.lastName }, ${ data.user.name }` );
      return data;
    },

    onError: ( error ) => {
      toast.error( 'No se pudo actualizar el paquete. Por favor, intente nuevamente.' );
      console.error( 'Error updating package:', error );
    }

  } );

  const packageUpdate = async ( packageData: PackageInputs, id: string ): Promise<IPackage> => {
    const result = await mutation.mutateAsync( { packageData, id } );
    return result;
  };

  return {
    packageUpdate,
    isPending: mutation.isPending,
    isError:   mutation.isError,
    error:     mutation.error
  };
};
