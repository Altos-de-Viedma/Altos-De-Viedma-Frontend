import {
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@heroui/react";
import {
  IoChevronDownOutline,
  IoSearchOutline
} from 'react-icons/io5';
import { ReactNode, useCallback, useMemo, useState } from "react";

export type StatusColorMap = {
  [ key: string ]: ChipProps[ "color" ];
};

export interface CustomTableProps {
  data: any[];
  columns: Column[];
  renderCustomCell?: ( item: any, columnKey: string ) => ReactNode;
  statusColorMap?: StatusColorMap;
  initialVisibleColumns?: string[];
  pageSize?: number;
  title?: string;
  addButtonComponent?: ReactNode;
  selectionMode?: "none" | "single" | "multiple";
  isStriped?: boolean;
}

interface Column {
  name: string;
  uid: string;
  sortable?: boolean;
}

export const CustomTable = ( {
  data,
  columns,
  renderCustomCell,
  statusColorMap = {},
  initialVisibleColumns = [],
  pageSize = 5,
  title = "Tabla",
  addButtonComponent,
  selectionMode = "single",
  isStriped = false
}: CustomTableProps ) => {
  const [ filterValue, setFilterValue ] = useState( "" );
  const [ selectedKeys, setSelectedKeys ] = useState<Selection>( new Set( [] ) );
  const [ visibleColumns, setVisibleColumns ] = useState<Selection>(
    new Set( initialVisibleColumns.length ? initialVisibleColumns : columns.map( c => c.uid ) )
  );
  const [ statusFilter, setStatusFilter ] = useState<Selection>( "all" );
  const [ rowsPerPage, setRowsPerPage ] = useState( pageSize );
  const [ sortDescriptor, setSortDescriptor ] = useState<SortDescriptor>( {
    column: columns[ 0 ].uid,
    direction: "ascending",
  } );
  const [ page, setPage ] = useState( 1 );

  const hasSearchFilter = Boolean( filterValue );

  const headerColumns = useMemo( () => {
    if ( visibleColumns === "all" ) return columns;
    return columns.filter( ( column ) =>
      Array.from( visibleColumns as Set<string> ).includes( column.uid )
    );
  }, [ visibleColumns, columns ] );

  const filteredItems = useMemo( () => {
    let filteredData = [ ...data ];

    if ( hasSearchFilter ) {
      const searchLower = filterValue.toLowerCase().trim();
      
      // Búsqueda ultra inteligente en TODOS los campos del objeto
      filteredData = filteredData.filter( ( item ) => {
        // Buscar en todas las propiedades del objeto
        for ( const key in item ) {
          if ( item.hasOwnProperty( key ) ) {
            const value = item[ key ];
            
            // Ignorar propiedades que son componentes de React o funciones
            if ( typeof value === 'function' || value?.$$typeof ) continue;
            
            // Convertir a string y buscar
            let stringValue = '';
            
            if ( value === null || value === undefined ) {
              continue;
            } else if ( typeof value === 'string' ) {
              stringValue = value.toLowerCase();
            } else if ( typeof value === 'number' || typeof value === 'boolean' ) {
              stringValue = String( value ).toLowerCase();
            } else if ( Array.isArray( value ) ) {
              // Si es un array, buscar en cada elemento
              stringValue = value.join( ' ' ).toLowerCase();
            } else if ( typeof value === 'object' ) {
              // Si es un objeto (como chips, elementos de React), intentar extraer texto
              // Para objetos con propiedades children o label
              if ( value?.props?.children ) {
                stringValue = String( value.props.children ).toLowerCase();
              } else if ( value?.label ) {
                stringValue = String( value.label ).toLowerCase();
              } else if ( value?.toString ) {
                stringValue = value.toString().toLowerCase();
              }
            }
            
            // Si encontramos coincidencia en cualquier campo, retornar true
            if ( stringValue.includes( searchLower ) ) {
              return true;
            }
          }
        }
        return false;
      } );
    }

    if ( statusFilter !== "all" && Array.from( statusFilter as Set<string> ).length !== 0 ) {
      filteredData = filteredData.filter( ( item ) =>
        ( statusFilter as Set<string> ).has( item.status )
      );
    }

    return filteredData;
  }, [ data, filterValue, statusFilter ] );

  const pages = Math.ceil( filteredItems.length / rowsPerPage );

  const sortedItems = useMemo( () => {
    return [ ...filteredItems ].sort( ( a, b ) => {
      const first = a[ sortDescriptor.column as keyof typeof a ];
      const second = b[ sortDescriptor.column as keyof typeof b ];

      let cmp = 0;

      if ( first !== undefined && second !== undefined ) {
        if ( typeof first === 'string' && typeof second === 'string' ) {
          cmp = first.localeCompare( second );
        } else if ( typeof first === 'number' && typeof second === 'number' ) {
          cmp = first - second;
        } else {
          // Si no son strings ni números, convertimos a string para comparar
          cmp = String( first ).localeCompare( String( second ) );
        }
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    } );
  }, [ sortDescriptor, filteredItems ] );

  const items = useMemo( () => {
    const start = ( page - 1 ) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice( start, end );
  }, [ page, sortedItems, rowsPerPage ] );

  const defaultRenderCell = useCallback( ( item: any, columnKey: string ) => {
    const cellValue = item[ columnKey ];

    if ( renderCustomCell ) {
      const customCell = renderCustomCell( item, columnKey );
      if ( customCell ) return customCell;
    }

    if ( statusColorMap[ item.status ] ) {
      return (
        <Chip
          className="capitalize"
          color={ statusColorMap[ item.status ] }
          size="sm"
          variant="flat"
        >
          { cellValue }
        </Chip>
      );
    }

    return cellValue;
  }, [ statusColorMap, renderCustomCell ] );

  const onSearchChange = useCallback( ( value: string ) => {
    if ( value ) {
      setFilterValue( value );
      setPage( 1 );
    } else {
      setFilterValue( "" );
    }
  }, [] );

  const onClear = useCallback( () => {
    setFilterValue( "" );
    setPage( 1 );
  }, [] );

  const topContent = useMemo( () => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder={ `Buscar ${ title }...` }
          startContent={ <IoSearchOutline /> }
          value={ filterValue }
          onClear={ onClear }
          onValueChange={ onSearchChange }
        />
        <div className="flex gap-3">
          { statusFilter !== "all" && (
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <button className="bg-default-100 text-default-700 border-default-200 hover:bg-default-200 px-4 py-2 rounded-md text-sm flex items-center">
                  Estado
                  <IoChevronDownOutline className="text-small ml-2" />
                </button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Estado de filtro"
                closeOnSelect={ false }
                selectedKeys={ statusFilter }
                selectionMode="multiple"
                onSelectionChange={ setStatusFilter }
              >
                { Array.from( new Set( data.map( item => item.status ) ) ).map( ( status ) => (
                  <DropdownItem key={ status } className="capitalize">
                    { status }
                  </DropdownItem>
                ) ) }
              </DropdownMenu>
            </Dropdown>
          ) }
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <button className="bg-default-100 text-default-700 border-default-200 hover:bg-default-200 px-4 py-2 rounded-md text-sm flex items-center">
                Columnas
                <IoChevronDownOutline className="text-small ml-2" />
              </button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Columnas de la tabla"
              closeOnSelect={ false }
              selectedKeys={ visibleColumns }
              selectionMode="multiple"
              onSelectionChange={ setVisibleColumns }
            >
              { columns.map( ( column ) => (
                <DropdownItem key={ column.uid } className="capitalize">
                  { column.name }
                </DropdownItem>
              ) ) }
            </DropdownMenu>
          </Dropdown>
          { addButtonComponent }
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total { data.length } elementos
        </span>
        <label className="flex items-center text-default-400 text-small">
          Elementos por página:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={ ( e ) => {
              setRowsPerPage( Number( e.target.value ) );
              setPage( 1 );
            } }
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  ), [
    filterValue,
    visibleColumns,
    onSearchChange,
    onClear,
    data.length,
    columns,
    addButtonComponent,
    title,
    statusFilter,
  ] );

  const bottomContent = useMemo( () => (
    <div className="py-2 px-2 flex justify-between items-center">
      { selectionMode !== "none" && (
        <span className="w-[30%] text-small text-default-400">
          { selectedKeys === "all"
            ? "Todos los elementos seleccionados"
            : `${ selectedKeys.size } de ${ filteredItems.length } seleccionados` }
        </span>
      ) }
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={ page }
        total={ pages }
        onChange={ setPage }
      />
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <button
          className="bg-default-100 text-default-700 border-default-200 hover:bg-default-200 px-4 py-2 rounded-md text-sm"
          disabled={ pages === 1 }
          onClick={ () => page > 1 && setPage( page - 1 ) }
        >
          Anterior
        </button>
        <button
          className="bg-default-100 text-default-700 border-default-200 hover:bg-default-200 px-4 py-2 rounded-md text-sm"
          disabled={ pages === 1 }
          onClick={ () => page < pages && setPage( page + 1 ) }
        >
          Siguiente
        </button>
      </div>
    </div>
  ), [ selectedKeys, filteredItems.length, page, pages, selectionMode ] );

  return (
    <Table
      aria-label={ `Tabla de ${ title }` }
      isHeaderSticky
      bottomContent={ bottomContent }
      bottomContentPlacement="outside"
      classNames={ {
        wrapper: "max-h-[382px]",
      } }
      selectedKeys={ selectedKeys }
      selectionMode={ selectionMode }
      sortDescriptor={ sortDescriptor }
      topContent={ topContent }
      topContentPlacement="outside"
      onSelectionChange={ setSelectedKeys }
      onSortChange={ setSortDescriptor }
      isStriped={ isStriped }
    >
      <TableHeader columns={ headerColumns }>
        { ( column ) => (
          <TableColumn
            key={ column.uid }
            align={ column.uid === "actions" ? "center" : "start" }
            allowsSorting={ column.sortable }
          >
            { column.name }
          </TableColumn>
        ) }
      </TableHeader>
      <TableBody emptyContent={ `No se encontraron elementos en ${ title }` } items={ items }>
        { ( item ) => (
          <TableRow key={ ( item as any ).id || Math.random() }>
            { headerColumns.map( ( column ) => (
              <TableCell key={ column.uid }>
                { defaultRenderCell( item, column.uid ) }
              </TableCell>
            ) ) }
          </TableRow>
        ) }
      </TableBody>
    </Table>
  );
};