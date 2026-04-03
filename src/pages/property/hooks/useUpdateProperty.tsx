import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IProperty } from '../interfaces';
import { PropertyInputs } from '../validators';
import { updateProperty } from '../services';



export const usePropertyUpdate = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation<IProperty, Error, { property: PropertyInputs; id: string; }>( {

    mutationFn: ( { property, id } ) => updateProperty( property, id ),

    onSuccess: ( data ) => {

      queryClient.invalidateQueries( {
        queryKey: [ 'property' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'properties' ]
      } );

      const ownerNames = data.users?.map(user => `${user.lastName}, ${user.name}`).join(' • ') || 'Sin propietarios';
      toast.success( `Propiedad actualizada correctamente: ${ data.address }. Propietarios: ${ ownerNames }` );
      return data;
    },

    onError: ( error ) => {
      toast.error( 'No se pudo actualizar la propiedad. Por favor, intente nuevamente.' );
      console.error( 'Error updating property:', error );
    }

  } );

  const propertyUpdate = async ( property: PropertyInputs, id: string ): Promise<IProperty> => {
    const result = await mutation.mutateAsync( { property, id } );
    return result;
  };

  return {
    propertyUpdate,
    isPending: mutation.isPending,
    isError:   mutation.isError,
    error:     mutation.error
  };
};