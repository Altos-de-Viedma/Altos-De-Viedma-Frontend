import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icons, UI, useDisclosure } from '../../../shared';
import { PackageInputs, packageSchema } from '../validators';
import { useAddPackage, usePackage, usePackageUpdate } from '../hooks';
import { useInputIcon } from '../../../shared';
import { useProperties } from '../../property';
import { SelectModal } from '../../../shared/components/ui/components/custom/select-modal/SelectModal';



interface Props {
  id?: string;
}

export const PackageForm = ( { id }: Props ) => {

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isPropertyModalOpen, onOpen: onPropertyModalOpen, onClose: onPropertyModalClose } = useDisclosure();
  const { addPackage, isPending: isAddingPackage } = useAddPackage();
  const { packageUpdate, isPending: isUpdatingPackage } = usePackageUpdate();
  const { properties } = useProperties();

  const { pkg, isLoading } = id ? usePackage( id ) : { pkg: null, isLoading: false };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<PackageInputs>( {
    resolver: zodResolver( packageSchema ),
  } );

  useEffect( () => {
    if ( id && pkg ) {
      reset( {
        title: pkg.title,
        propertyId: pkg.property.id,
        description: pkg.description,
        arrivalDate: pkg.arrivalDate,
      } );
    }
  }, [ id, pkg, reset ] );

  const onSubmit = async ( data: PackageInputs ) => {
    if ( id ) {
      await packageUpdate( data, id );
    } else {
      await addPackage( data );
      reset();
    }
    onClose();
  };

  const isPending = isAddingPackage || isUpdatingPackage;

  if ( id && isLoading ) {
    return <UI.Spinner />;
  }

  return (
    <div>
      <UI.Button startContent={ id ? '' : <Icons.IoAddOutline size={ 24 } /> } onPress={ onOpen } color="primary" variant="solid" className="bg-primary-600 hover:bg-primary-700 text-white font-medium">
        { id ? <><Icons.IoPencilOutline size={ 24 } /> Editar</> : 'Nuevo' }
      </UI.Button>

      <UI.Modal
        isOpen={ isOpen }
        onOpenChange={ onOpenChange }
        backdrop="blur"
        isDismissable={ false }
      >
        <UI.ModalContent>
          { ( onClose ) => (
            <form onSubmit={ handleSubmit( onSubmit ) }>
              <UI.ModalHeader className="flex items-center justify-center px-4 py-3">
                <div className="flex items-center space-x-2 font-bold text-2xl">
                  { useInputIcon( { icon: 'IoCubeOutline', className: 'text-gray-500' } ) }
                  <h2>{ id ? 'Editar paquete' : 'Nuevo paquete' }</h2>
                </div>
              </UI.ModalHeader>

              <UI.ModalBody>
                <UI.Input
                  endContent={ useInputIcon( { icon: 'IoCubeOutline' } ) }
                  label="Título"
                  placeholder="Ingrese el título del paquete"
                  variant="bordered"
                  errorMessage={ errors.title?.message }
                  isInvalid={ !!errors.title }
                  { ...register( 'title' ) }
                />

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-foreground">Propiedad</label>
                  <UI.Button
                    variant="bordered"
                    onPress={onPropertyModalOpen}
                    className="justify-start h-14 px-3"
                    startContent={<Icons.IoHomeOutline size={20} />}
                  >
                    <div className="flex-1 text-left">
                      {watch('propertyId') ? (
                        (() => {
                          const selectedProperty = properties?.find(p => p.id === watch('propertyId'));
                          if (selectedProperty) {
                            const normalizedProperty = {
                              ...selectedProperty,
                              users: selectedProperty.users || (selectedProperty.users ? [selectedProperty.users] : [])
                            };
                            return (
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {selectedProperty.isMain ? '🏠 ' : ''}{selectedProperty.address}
                                </span>
                                <span className="text-xs text-default-500">
                                  {normalizedProperty.users.map(user => `${user.lastName}, ${user.name}`).join(' • ')}
                                  {selectedProperty.isMain ? ' • Principal' : ''}
                                </span>
                              </div>
                            );
                          }
                          return <span className="text-default-400">Seleccionar propiedad...</span>;
                        })()
                      ) : (
                        <span className="text-default-400">Seleccionar propiedad...</span>
                      )}
                    </div>
                  </UI.Button>
                  {errors.propertyId && (
                    <p className="text-xs text-danger">{errors.propertyId.message}</p>
                  )}
                </div>

                <SelectModal
                  isOpen={isPropertyModalOpen}
                  onClose={onPropertyModalClose}
                  title="Seleccionar Propiedad"
                  options={properties?.map((property) => {
                    const normalizedProperty = {
                      ...property,
                      users: property.users || (property.users ? [property.users] : [])
                    };

                    return {
                      key: property.id,
                      label: property.isMain ? `🏠 ${property.address}` : property.address,
                      description: `${normalizedProperty.users.map(user => `${user.lastName}, ${user.name}`).join(' • ')}${property.isMain ? ' • Principal' : ''}`
                    };
                  }) || []}
                  selectedKeys={watch('propertyId') ? [watch('propertyId')] : []}
                  onSelectionChange={(keys) => {
                    const value = keys[0];
                    setValue('propertyId', value as string);
                  }}
                  selectionMode="single"
                  searchPlaceholder="Buscar propiedad..."
                />

                <UI.Textarea
                  label="Descripción"
                  placeholder="Ingrese una breve descripción del paquete"
                  variant="bordered"
                  errorMessage={ errors.description?.message }
                  isInvalid={ !!errors.description }
                  { ...register( 'description' ) }
                />

                <UI.Input
                  type="datetime-local"
                  label="Fecha estimada de recepción"
                  placeholder="Ingrese la fecha estimada de recepción"
                  variant="bordered"
                  errorMessage={ errors.arrivalDate?.message }
                  isInvalid={ !!errors.arrivalDate }
                  { ...register( 'arrivalDate' ) }
                />
              </UI.ModalBody>

              <UI.ModalFooter className="flex justify-center space-x-2">
                <UI.Button
                  color="danger"
                  variant="solid"
                  onPress={ onClose }
                  isDisabled={ isPending }
                  startContent={ <Icons.IoCloseOutline size={ 24 } /> }
                  className="bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  Cancelar
                </UI.Button>

                <UI.Button
                  color="primary"
                  variant="solid"
                  type="submit"
                  isLoading={ isPending }
                  startContent={ !isPending && <Icons.IoSaveOutline size={ 24 } /> }
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
                >
                  Guardar
                </UI.Button>
              </UI.ModalFooter>
            </form>
          ) }
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};
