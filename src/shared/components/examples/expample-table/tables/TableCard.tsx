import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Input } from '@heroui/react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { IoSearchOutline } from 'react-icons/io5';

import { DataRow, data } from './data';


export const TableCard = () => {
  const [ records, setRecords ] = useState<DataRow[]>( [] );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {

    const timeout = setTimeout( () => {
      setRecords( data );
      setLoading( false );
    }, 2000 );

    return () => clearTimeout( timeout );
  }, [] );


  const columns: TableColumn<DataRow>[] = [
    {
      name: "Nombre",
      selector: ( row: DataRow ) => row.nombre,
      sortable: true
    },
    {
      name: "Apellido",
      selector: ( row: DataRow ) => row.apellido,
      sortable: true
    },
    {
      name: "Edad",
      selector: ( row: DataRow ) => row.edad,
      sortable: true
    },
  ];

  const handleChange = ( e: ChangeEvent<HTMLInputElement> ) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredRecords = data.filter( record =>
      record.nombre.toLowerCase().includes( searchTerm ) ||
      record.apellido.toLowerCase().includes( searchTerm ) ||
      record.edad.toString().includes( searchTerm )
    );
    setRecords( filteredRecords );
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <div className="flex flex-row justify-center">
        <Input
          className="w-1/2"
          isClearable
          radius="lg"
          onChange={ handleChange }
          placeholder="Buscar por nombre, apellido o edad"
          startContent={
            <IoSearchOutline className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
        />
        <Button className="ml-1">
          Nuevo
        </Button>
      </div>
      <DataTable
        title="Datos del usuario"
        columns={ columns }
        data={ records }
        pagination
        paginationPerPage={ 15 }
        progressPending={ loading }
        progressComponent={ <h1>Cargando...</h1> }
      />
    </div >
  );
};
