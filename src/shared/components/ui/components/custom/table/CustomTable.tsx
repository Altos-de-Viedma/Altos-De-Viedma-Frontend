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
  TableRow,
  Button,
  Spinner
} from "@heroui/react";
import {
  IoChevronDownOutline,
  IoSearchOutline,
  IoFunnelOutline,
  IoGridOutline,
  IoRefreshOutline
} from 'react-icons/io5';
import { ReactNode, useCallback, useMemo, useState } from "react";
import { motion } from 'framer-motion';

export type StatusColorMap = {
  [ key: string ]: ChipProps[ "color" ];
};

export interface CustomTableProps {
  data: any[];
  columns: Column[];
  renderCustomCell?: (item: any, columnKey: string) => ReactNode;
  statusColorMap?: StatusColorMap;
  initialVisibleColumns?: string[];
  pageSize?: number;
  title?: string;
  addButtonComponent?: ReactNode;
  selectionMode?: "none" | "single" | "multiple";
  isStriped?: boolean;
  isLoading?: boolean;
  onRefresh?: () => void;
  emptyContent?: ReactNode;
  className?: string;
}

interface Column {
  name: string;
  uid: string;
  sortable?: boolean;
}

export const CustomTable = ({
  data,
  columns,
  renderCustomCell,
  statusColorMap = {},
  initialVisibleColumns = [],
  pageSize = 5,
  title = "Tabla",
  addButtonComponent,
  selectionMode = "single",
  isStriped = false,
  isLoading = false,
  onRefresh,
  emptyContent,
  className = ""
}: CustomTableProps) => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(initialVisibleColumns.length ? initialVisibleColumns : columns.map(c => c.uid))
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: columns[0].uid,
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

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

  const topContent = useMemo(() => (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="flex justify-between gap-3 items-end">
        <motion.div
          className="w-full sm:max-w-[44%]"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Input
            isClearable
            className="w-full"
            placeholder={`Buscar ${title}...`}
            startContent={<IoSearchOutline className="text-foreground/50" />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
            classNames={{
              base: "glass-effect",
              input: "text-foreground",
              inputWrapper: "border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-500/50 transition-colors duration-300"
            }}
          />
        </motion.div>

        <div className="flex gap-3">
          {onRefresh && (
            <motion.div
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Button
                isIconOnly
                variant="light"
                onPress={onRefresh}
                isLoading={isLoading}
                className="btn-hover-lift"
                aria-label="Actualizar datos"
              >
                <IoRefreshOutline size={18} />
              </Button>
            </motion.div>
          )}

          {statusFilter !== "all" && (
            <Dropdown>
              <DropdownTrigger>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="flat"
                    startContent={<IoFunnelOutline size={16} />}
                    endContent={<IoChevronDownOutline size={16} />}
                    className="hidden sm:flex glass-effect border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-500/50 transition-all duration-300"
                  >
                    Estado
                  </Button>
                </motion.div>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Estado de filtro"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
                classNames={{
                  base: "glass-effect border border-gray-200/50 dark:border-gray-700/50 shadow-large"
                }}
              >
                {Array.from(new Set(data.map(item => item.status))).map((status) => (
                  <DropdownItem key={status} className="capitalize hover:bg-primary-500/10 transition-colors">
                    {status}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}

          <Dropdown>
            <DropdownTrigger>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="flat"
                  startContent={<IoGridOutline size={16} />}
                  endContent={<IoChevronDownOutline size={16} />}
                  className="hidden sm:flex glass-effect border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-500/50 transition-all duration-300"
                >
                  Columnas
                </Button>
              </motion.div>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Columnas de la tabla"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
              classNames={{
                base: "glass-effect border border-gray-200/50 dark:border-gray-700/50 shadow-large"
              }}
            >
              {columns.map((column) => (
                <DropdownItem key={column.uid} className="capitalize hover:bg-primary-500/10 transition-colors">
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {addButtonComponent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {addButtonComponent}
            </motion.div>
          )}
        </div>
      </div>

      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-foreground/60 text-sm font-medium">
          Total {data.length} elementos
          {filteredItems.length !== data.length && (
            <span className="text-primary-500 ml-2">
              ({filteredItems.length} filtrados)
            </span>
          )}
        </span>

        <label className="flex items-center text-foreground/60 text-sm gap-2">
          Elementos por página:
          <select
            className="bg-background border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-2 py-1 text-foreground text-sm focus:border-primary-500 focus:outline-none transition-colors"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </label>
      </motion.div>
    </motion.div>
  ), [
    filterValue,
    visibleColumns,
    onSearchChange,
    onClear,
    data.length,
    filteredItems.length,
    columns,
    addButtonComponent,
    title,
    statusFilter,
    onRefresh,
    isLoading,
    rowsPerPage,
  ]);

  const bottomContent = useMemo(() => (
    <motion.div
      className="py-4 px-2 flex justify-between items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {selectionMode !== "none" && (
        <motion.span
          className="w-[30%] text-sm text-foreground/60 font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {selectedKeys === "all"
            ? "Todos los elementos seleccionados"
            : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
        </motion.span>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            wrapper: "gap-0 overflow-visible h-8 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-medium",
            item: "w-8 h-8 text-sm rounded-none bg-transparent hover:bg-primary-500/10 transition-colors",
            cursor: "bg-primary-500 shadow-lg text-white font-medium",
            prev: "hover:bg-primary-500/10 transition-colors",
            next: "hover:bg-primary-500/10 transition-colors",
          }}
        />
      </motion.div>

      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="sm"
            variant="flat"
            isDisabled={page === 1}
            onPress={() => page > 1 && setPage(page - 1)}
            className="glass-effect border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-500/50 transition-all duration-300"
          >
            Anterior
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="sm"
            variant="flat"
            isDisabled={page === pages}
            onPress={() => page < pages && setPage(page + 1)}
            className="glass-effect border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-500/50 transition-all duration-300"
          >
            Siguiente
          </Button>
        </motion.div>
      </div>
    </motion.div>
  ), [selectedKeys, filteredItems.length, page, pages, selectionMode]);

  return (
    <motion.div
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Table
        aria-label={`Tabla de ${title}`}
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[500px] glass-effect border border-gray-200/50 dark:border-gray-700/50 shadow-large rounded-2xl overflow-hidden",
          th: "bg-gray-50/80 dark:bg-gray-800/80 text-foreground font-semibold first:rounded-tl-2xl last:rounded-tr-2xl border-b border-gray-200/50 dark:border-gray-700/50",
          td: "border-b border-gray-200/30 dark:border-gray-700/30 group-hover:bg-primary-50/50 dark:group-hover:bg-primary-950/20 transition-colors duration-200",
          tbody: "[&>tr:last-child>td]:border-b-0",
          tr: "hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-200 cursor-pointer",
        }}
        selectedKeys={selectedKeys}
        selectionMode={selectionMode}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        isStriped={isStriped}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              className="text-foreground/80 font-semibold"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                {column.name}
                {column.sortable && (
                  <motion.div
                    animate={{
                      rotate: sortDescriptor.column === column.uid && sortDescriptor.direction === "descending" ? 180 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <IoChevronDownOutline size={14} className="text-foreground/50" />
                  </motion.div>
                )}
              </motion.div>
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          emptyContent={
            <motion.div
              className="flex flex-col items-center justify-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <Spinner size="lg" color="primary" />
                  <p className="text-foreground/60">Cargando datos...</p>
                </div>
              ) : (
                emptyContent || (
                  <div className="flex flex-col items-center gap-4 text-foreground/60">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <IoSearchOutline size={24} />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">No se encontraron elementos</p>
                      <p className="text-sm text-foreground/40">
                        {filterValue ? `No hay resultados para "${filterValue}"` : `No hay datos en ${title}`}
                      </p>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          }
          items={items}
          isLoading={isLoading}
          loadingContent={
            <div className="flex justify-center py-8">
              <Spinner size="lg" color="primary" />
            </div>
          }
        >
          {(item) => (
            <TableRow key={(item as any).id || Math.random()}>
              {headerColumns.map((column) => (
                <TableCell key={column.uid}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: Math.random() * 0.1 }}
                  >
                    {defaultRenderCell(item, column.uid)}
                  </motion.div>
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
};