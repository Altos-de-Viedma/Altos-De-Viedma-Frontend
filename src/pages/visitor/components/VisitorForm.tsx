import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icons, UI, useDisclosure } from '../../../shared';
import { useAddVisitor, useVisitor, useVisitorUpdate } from '../hooks';
import { useProperties } from '../../property/hooks/useProperties';
import { VisitorInputs, visitorSchema } from '../validators';

interface Props {
  id?: string;
}

export const VisitorForm = ( { id }: Props ) => {
  const [ isUploading, setIsUploading ] = useState( false );
  const [ previewImage, setPreviewImage ] = useState( 'https://i.imgur.com/O7WbIax.png' );
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { addVisitor } = useAddVisitor();
  const { visitorUpdate } = useVisitorUpdate();
  const { properties } = useProperties();

  const { visitor, isLoading } = id ? useVisitor( id ) : { visitor: null, isLoading: false };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<VisitorInputs>( {
    resolver: zodResolver( visitorSchema ),
    defaultValues: {
      profilePicture: 'https://i.imgur.com/O7WbIax.png'
    }
  } );

  useEffect( () => {
    if ( id && visitor ) {
      reset( {
        dateAndTimeOfVisit: visitor.dateAndTimeOfVisit,
        fullName: visitor.fullName,
        dni: visitor.dni,
        phone: visitor.phone,
        description: visitor.description,
        property: visitor.property.id,
        profilePicture: visitor.profilePicture,
        vehiclePlate: visitor.vehiclePlate
      } );
      setPreviewImage( visitor.profilePicture );
    }
  }, [ id, visitor, reset ] );

  const handleImageUploadNative = async ( event: Event ) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[ 0 ];
    if ( !file ) return;

    setIsUploading( true );

    try {
      const formData = new FormData();
      formData.append( 'image', file );

      const response = await fetch( 'https://api.imgbb.com/1/upload?key=5ef0cb48aca6afad30cfda8a18773df7', {
        method: 'POST',
        body: formData,
      } );

      const data = await response.json();

      if ( data.data?.url ) {
        setValue( 'profilePicture', data.data.url );
        setPreviewImage( data.data.url );
      }
    } catch ( error ) {
      console.error( 'Error uploading image:', error );
    } finally {
      setIsUploading( false );
    }
  };

  const handleGallerySelect = () => {
    const input = document.createElement( 'input' );
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener( 'change', handleImageUploadNative );
    input.click();
  };

  const onSubmit = async ( data: VisitorInputs ) => {
    if ( id ) {
      await visitorUpdate( data, id );
    } else {
      await addVisitor( data );
      reset();
      setPreviewImage( 'https://i.imgur.com/O7WbIax.png' );
    }
    onClose();
  };

  const handleReenterVisit = () => {
    if ( visitor ) {
      const reenteredVisitorData: VisitorInputs = {
        dateAndTimeOfVisit: new Date().toISOString().slice( 0, 16 ),
        fullName: visitor.fullName,
        dni: visitor.dni,
        phone: visitor.phone,
        description: visitor.description,
        property: visitor.property.id,
        profilePicture: visitor.profilePicture,
        vehiclePlate: visitor.vehiclePlate
      };
      addVisitor( reenteredVisitorData );
      onClose();
    }
  };

  if ( id && isLoading ) {
    return <UI.Spinner />;
  }

  return (
    <div>
      <UI.Button
        startContent={ id ? '' : <Icons.IoAddOutline size={ 24 } /> }
        onPress={ onOpen }
        variant="light"
      >
        { id ? <><Icons.IoPencilOutline size={ 24 } /> Editar</> : 'Nuevo' }
      </UI.Button>

      <UI.Modal
        isOpen={ isOpen }
        onOpenChange={ onOpenChange }
        backdrop="blur"
        isDismissable={ false }
        scrollBehavior="inside"
      >
        <UI.ModalContent>
          { ( onClose ) => (
            <form onSubmit={ handleSubmit( onSubmit ) }>
              <UI.ModalHeader className="flex items-center justify-center px-4 py-3">
                <div className="flex flex-col items-center space-y-4 font-bold text-2xl">
                  <UI.Avatar
                    className="w-20 h-20 text-tiny"
                    src={ previewImage }
                  />
                  <div className="flex flex-row gap-2">
                    <UI.Button
                      variant="light"
                      isDisabled={ isUploading }
                      startContent={ isUploading ? <UI.Spinner size="sm" /> : <Icons.IoCameraOutline size={ 20 } /> }
                      onPress={ handleGallerySelect }
                    >
                      { isUploading ? 'Subiendo...' : 'Cámara' }
                    </UI.Button>
                  </div>
                  <h2>{ id ? 'Editar visitante' : 'Nuevo visitante' }</h2>
                </div>
              </UI.ModalHeader>

              <UI.ModalBody>
                <input
                  type="hidden"
                  { ...register( 'profilePicture' ) }
                />

                <UI.Input
                  label="Nombre completo"
                  placeholder="Ingrese el nombre completo"
                  variant="bordered"
                  errorMessage={ errors.fullName?.message }
                  isInvalid={ !!errors.fullName }
                  { ...register( 'fullName' ) }
                />

                <UI.Input
                  label="DNI"
                  placeholder="Ingrese el DNI"
                  variant="bordered"
                  errorMessage={ errors.dni?.message }
                  isInvalid={ !!errors.dni }
                  { ...register( 'dni' ) }
                />

                <UI.Input
                  label="Teléfono"
                  placeholder="Ingrese el teléfono"
                  variant="bordered"
                  errorMessage={ errors.phone?.message }
                  isInvalid={ !!errors.phone }
                  { ...register( 'phone' ) }
                />

                <UI.Input
                  label="Placa del vehículo"
                  placeholder="Ingrese la placa del vehículo"
                  variant="bordered"
                  errorMessage={ errors.vehiclePlate?.message }
                  isInvalid={ !!errors.vehiclePlate }
                  { ...register( 'vehiclePlate' ) }
                />

                <UI.Select
                  label="Propiedad"
                  placeholder="Seleccione la propiedad"
                  variant="bordered"
                  errorMessage={ errors.property?.message }
                  isInvalid={ !!errors.property }
                  { ...register( 'property' ) }
                >
                  { properties?.map( ( property ) => (
                    <UI.SelectItem key={ property.id } value={ property.id }>
                      { property.address }
                    </UI.SelectItem>
                  ) ) || [] }
                </UI.Select>

                <UI.Input
                  type="datetime-local"
                  label="Fecha y hora de salida"
                  placeholder="Seleccione fecha y hora"
                  variant="bordered"
                  errorMessage={ errors.dateAndTimeOfVisit?.message }
                  isInvalid={ !!errors.dateAndTimeOfVisit }
                  { ...register( 'dateAndTimeOfVisit' ) }
                />

                <UI.Textarea
                  label="Descripción"
                  placeholder="Ingrese una breve descripción"
                  variant="bordered"
                  errorMessage={ errors.description?.message }
                  isInvalid={ !!errors.description }
                  { ...register( 'description' ) }
                />
              </UI.ModalBody>

              <UI.ModalFooter className="flex justify-center space-x-2">
                <UI.Button
                  color="danger"
                  variant="light"
                  onPress={ onClose }
                  startContent={ <Icons.IoCloseOutline size={ 24 } /> }
                >
                  Cancelar
                </UI.Button>

                { id && visitor?.visitCompleted ? (
                  <UI.Button
                    color="primary"
                    onPress={ handleReenterVisit }
                    startContent={ <Icons.IoSaveOutline size={ 24 } /> }
                  >
                    Reingresar visita
                  </UI.Button>
                ) : (
                  <UI.Button
                    color="primary"
                    type="submit"
                    isDisabled={ isUploading }
                    startContent={ <Icons.IoSaveOutline size={ 24 } /> }
                  >
                    Guardar
                  </UI.Button>
                ) }
              </UI.ModalFooter>
            </form>
          ) }
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};