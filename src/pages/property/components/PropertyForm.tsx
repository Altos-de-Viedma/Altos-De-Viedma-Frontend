import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icons, UI, useDisclosure } from '../../../shared';
import { PropertyInputs, propertySchema } from '../validators';
import { useAddProperty, useProperty, usePropertyUpdate } from '../hooks';
import { useInputIcon } from '../../../shared';
import { useUsers } from '../../users';
import { SelectModal } from '../../../shared/components/ui/components/custom/select-modal/SelectModal';

interface Props {
  id?: string;
}

export const PropertyForm = ( { id }: Props ) => {

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isSelectModalOpen, onOpen: onSelectModalOpen, onClose: onSelectModalClose } = useDisclosure();
  const { addProperty, isPending: isAddingProperty } = useAddProperty();
  const { propertyUpdate, isPending: isUpdatingProperty } = usePropertyUpdate();
  const { users } = useUsers();

  const { property, isLoading } = id ? useProperty( id ) : { property: null, isLoading: false };
  const [ isMainProperty, setIsMainProperty ] = useState( false );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<PropertyInputs>( {
    resolver: zodResolver( propertySchema ),
  } );

  useEffect( () => {
    if ( id && property ) {
      // Compatibilidad: convertir estructura antigua a nueva
      const normalizedProperty = {
        ...property,
        users: property.users || (property.users ? [property.users] : [])
      };

      reset( {
        address: normalizedProperty.address,
        description: normalizedProperty.description,
        users: normalizedProperty.users.map(user => user.id),
        isMain: normalizedProperty.isMain,
      } );
      setValue( 'users', normalizedProperty.users.map(user => user.id) );
      setIsMainProperty( normalizedProperty.isMain );
    }
  }, [ id, property, reset, setValue ] );

  const onSubmit = async ( data: PropertyInputs ) => {
    const propertyData = {
      ...data,
      isMain: isMainProperty,
    };

    if ( id ) {
      await propertyUpdate( propertyData, id );
    } else {
      await addProperty( propertyData );
      reset();
      setIsMainProperty( false );
    }
    onClose();
  };

  const isPending = isAddingProperty || isUpdatingProperty;

  if ( id && isLoading ) {
    return <UI.Spinner />;
  }

  return (
    <div>
      <UI.Button startContent={ id ? '' : <Icons.IoAddOutline size={ 24 } /> } onPress={ onOpen } color="primary" variant="solid" className="bg-primary-600 hover:bg-primary-700 text-white font-medium">
        { id ? <><Icons.IoPencilOutline size={ 24 } /> Editar</> : 'Nueva' }
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
                  { useInputIcon( { icon: 'IoHomeOutline', className: 'text-gray-500' } ) }
                  <h2>{ id ? 'Editar propiedad' : 'Nueva propiedad' }</h2>
                </div>
              </UI.ModalHeader>

              <UI.ModalBody>
                <UI.Input
                  endContent={ useInputIcon( { icon: 'IoLocationOutline' } ) }
                  label="Dirección"
                  placeholder="Ingrese la dirección de la propiedad"
                  variant="bordered"
                  errorMessage={ errors.address?.message }
                  isInvalid={ !!errors.address }
                  { ...register( 'address' ) }
                />

                <UI.Textarea
                  label="Descripción"
                  placeholder="Ingrese una breve descripción de la propiedad"
                  variant="bordered"
                  errorMessage={ errors.description?.message }
                  isInvalid={ !!errors.description }
                  { ...register( 'description' ) }
                />

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-foreground">Propietarios</label>
                  <UI.Button
                    variant="bordered"
                    onPress={onSelectModalOpen}
                    className="justify-start h-14 px-3"
                    startContent={<Icons.IoPersonOutline size={20} />}
                  >
                    <div className="flex-1 text-left">
                      {watch('users')?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {watch('users').slice(0, 2).map(userId => {
                            const user = users?.find(u => u.id === userId);
                            return user ? (
                              <UI.Chip
                                key={userId}
                                size="sm"
                                color="primary"
                                variant="flat"
                                classNames={{
                                  base: "bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-600",
                                  content: "text-blue-800 dark:text-blue-200 font-medium"
                                }}
                              >
                                {`${user.lastName}, ${user.name}`}
                              </UI.Chip>
                            ) : null;
                          })}
                          {watch('users').length > 2 && (
                            <UI.Chip
                              size="sm"
                              color="default"
                              variant="flat"
                              classNames={{
                                base: "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600",
                                content: "text-gray-700 dark:text-gray-300 font-medium"
                              }}
                            >
                              +{watch('users').length - 2} más
                            </UI.Chip>
                          )}
                        </div>
                      ) : (
                        <span className="text-default-400">Seleccionar propietarios...</span>
                      )}
                    </div>
                  </UI.Button>
                  {errors.users && (
                    <p className="text-xs text-danger">{errors.users.message}</p>
                  )}
                </div>

                <SelectModal
                  isOpen={isSelectModalOpen}
                  onClose={onSelectModalClose}
                  title="Seleccionar Propietarios"
                  options={users?.map(user => ({
                    key: user.id,
                    label: `${user.lastName}, ${user.name}`,
                    description: user.username
                  })) || []}
                  selectedKeys={watch('users') || []}
                  onSelectionChange={(keys) => {
                    setValue('users', keys);
                  }}
                  selectionMode="multiple"
                  searchPlaceholder="Buscar propietarios..."
                />

                <div className="flex flex-col space-y-2">
                  <UI.Checkbox
                    isSelected={ isMainProperty }
                    onValueChange={ setIsMainProperty }
                    color="primary"
                    size="lg"
                    className="text-foreground"
                    classNames={{
                      base: "inline-flex max-w-full w-full bg-content1 m-0",
                      wrapper: "before:border-default-400 dark:before:border-default-500 after:bg-primary",
                      label: "text-foreground font-medium",
                      icon: "text-white dark:text-white"
                    }}
                  >
                    <span className="font-medium text-foreground">
                      Establecer como propiedad principal
                    </span>
                  </UI.Checkbox>
                  <p className="text-xs text-gray-500 ml-6">
                    Solo una propiedad puede ser la principal. Al seleccionar esta opción, se quitará la principal de las demás propiedades.
                  </p>
                </div>
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
