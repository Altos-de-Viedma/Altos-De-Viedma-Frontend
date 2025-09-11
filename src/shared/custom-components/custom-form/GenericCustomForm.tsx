import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import React from 'react';

import { CustomFormFooter, CustomHeaderForm, CustomOpenForm } from './components';
import { CustomModal } from '../custom-modal';
import { IGenericCustomFormProps } from './interfaces';
import { UI } from './';
import { useRenderField } from './helpers';

export const GenericCustomForm = ( { id, config, onSubmit }: IGenericCustomFormProps ) => {

  const { isOpen, onOpen, onClose, onOpenChange } = UI.useDisclosure();

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm( {
    resolver: zodResolver( config.schema )
  } );

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = ( data: unknown ) => {
    onSubmit( data );
    reset();
    onClose();
  };

  const renderField = useRenderField( register, errors, control );

  const handleKeyDown = ( event: React.KeyboardEvent ) => {
    if ( event.key === 'Enter' ) {
      event.preventDefault();
      handleSubmit( handleFormSubmit )();
    }
  };

  return (
    <>
      <CustomOpenForm
        id={ id }
        onOpen={ onOpen }
        title={ config.title }
      />

      <CustomModal
        isOpen={ isOpen }
        onClose={ handleClose }
        onConfirm={ handleSubmit( handleFormSubmit ) }
        onOpenChange={ onOpenChange }
        headerContent={ <CustomHeaderForm title={ id ? `Editar ${ config.title }` : `Nuevo ${ config.title }` } id={ id } /> }
        bodyContent={
          <form onSubmit={ handleSubmit( handleFormSubmit ) } onKeyDown={ handleKeyDown }>
            <div className="flex flex-col space-y-4 justify-center">
              {
                config.fields.map( ( field ) => (
                  <div key={ field.name }>{ renderField( field ) }</div>
                ) )
              }
            </div>
          </form>
        }
        footerContent={
          <CustomFormFooter
            handleClose={ handleClose }
            handleConfirm={ handleSubmit( handleFormSubmit ) }
          />
        }
      />
    </>
  );
};