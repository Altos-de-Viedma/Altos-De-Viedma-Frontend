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

export type StatusColorMap = {
  [key: string]: ChipProps["color"];
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

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns as Set<string>).includes(column.uid)
    );
  }, [visibleColumns, columns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      const searchLower = filterValue.toLowerCase().trim();
      filteredData = filteredData.filter((item) => {
        return Object.values(item).some((value) => {
          if (value === null || value === undefined) return false;
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(searchLower);
        });
      });
    }

    if (statusFilter !== "all" && Array.from(statusFilter).length !== Object.keys(statusColorMap).length) {
      filteredData = filteredData.filter((item) =>
        Array.from(statusFilter).includes(item.status)
      );
    }

    return filteredData;
  }, [data, filterValue, statusFilter, hasSearchFilter, statusColorMap]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof any] as number;
      const second = b[sortDescriptor.column as keyof any] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const defaultRenderCell = useCallback((item: any, columnKey: string) => {
    const cellValue = item[columnKey];

    if (renderCustomCell) {
      const customCell = renderCustomCell(item, columnKey);
      if (customCell !== undefined) return customCell;
    }

    switch (columnKey) {
      case "status":
        return (
          <Chip
            className="capitalize font-medium"
            color={statusColorMap[item.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      default:
        return (
          <span className="text-foreground/90 font-medium truncate">
            {cellValue || "-"}
          </span>
        );
    }
  }, [renderCustomCell, statusColorMap]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <div className="w-full sm:max-w-[44%]">
          <Input
            isClearable
            className="w-full"
            placeholder={`Buscar ${title}...`}
            startContent={<IoSearchOutline className="text-foreground/50" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            classNames={{
              base: "bg-white dark:bg-gray-800",
              input: "text-foreground",
              inputWrapper: "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }}
          />
        </div>

        <div className="flex gap-3">
          {onRefresh && (
            <Button
              isIconOnly
              variant="light"
              onPress={onRefresh}
              isLoading={isLoading}
              aria-label="Actualizar datos"
            >
              <IoRefreshOutline size={18} />
            </Button>
          )}

          {statusFilter !== "all" && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  startContent={<IoFunnelOutline size={16} />}
                  endContent={<IoChevronDownOutline size={16} />}
                  className="hidden sm:flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Estado de filtro"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
                classNames={{
                  base: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
                }}
              >
                <DropdownItem key="active" className="capitalize">
                  Activo
                </DropdownItem>
                <DropdownItem key="inactive" className="capitalize">
                  Inactivo
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}

          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                startContent={<IoGridOutline size={16} />}
                endContent={<IoChevronDownOutline size={16} />}
                className="hidden sm:flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                Columnas
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Columnas de la tabla"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
              classNames={{
                base: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
              }}
            >
              {columns.map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {addButtonComponent && (
            <div>
              {addButtonComponent}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-foreground/70 text-sm font-medium">
          Total {data.length} elementos
          {filteredItems.length !== data.length && (
            <span className="text-primary-600 dark:text-primary-400 ml-2 font-semibold">
              ({filteredItems.length} filtrados)
            </span>
          )}
        </span>
        <label className="flex items-center text-foreground/70 text-sm font-medium">
          Filas por página:
          <select
            className="bg-transparent outline-none text-foreground/70 text-sm ml-2 font-medium cursor-pointer hover:text-foreground transition-colors"
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
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
    filteredItems.length,
    columns,
    addButtonComponent,
    title,
    statusFilter,
    onRefresh,
    isLoading,
    rowsPerPage,
    onRowsPerPageChange,
  ]);

  const bottomContent = useMemo(() => (
    <div className="py-4 px-2 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      {selectionMode !== "none" && (
        <span className="w-[30%] text-sm text-foreground/70 font-medium">
          {selectedKeys === "all"
            ? "Todos los elementos seleccionados"
            : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
        </span>
      )}

      <div className="flex-1 flex justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          classNames={{
            wrapper: "gap-0 overflow-visible h-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
            item: "w-8 h-8 text-small rounded-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
            cursor: "bg-primary-500 shadow-md text-white font-semibold",
            prev: "hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600",
            next: "hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600",
          }}
        />
      </div>

      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <Button
          size="sm"
          variant="flat"
          isDisabled={page === 1}
          onPress={onPreviousPage}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Anterior
        </Button>

        <Button
          size="sm"
          variant="flat"
          isDisabled={page === pages}
          onPress={onNextPage}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          Siguiente
        </Button>
      </div>
    </div>
  ), [selectedKeys, filteredItems.length, page, pages, selectionMode, onPreviousPage, onNextPage]);

  return (
    <div className={`w-full ${className}`}>
      <Table
        aria-label={`Tabla de ${title}`}
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[500px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg overflow-hidden",
          th: "bg-gray-50 dark:bg-gray-700 text-foreground font-semibold border-b border-gray-200 dark:border-gray-600 py-4 px-3 first:pl-6 last:pr-6",
          td: "border-b border-gray-100 dark:border-gray-700 py-4 px-3 first:pl-6 last:pr-6 align-middle",
          tr: "hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-150",
        }}}
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
              align={column.uid === "profilePicture" || column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              className="text-foreground font-medium group hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="truncate">{column.name}</span>
                {column.sortable && (
                  <IoChevronDownOutline
                    size={14}
                    className={`text-foreground/30 transition-all duration-200 ${
                      sortDescriptor.column === column.uid
                        ? 'opacity-100 text-primary-500'
                        : 'opacity-0 group-hover:opacity-60'
                    } ${
                      sortDescriptor.column === column.uid && sortDescriptor.direction === 'ascending'
                        ? 'rotate-180'
                        : ''
                    }`}
                  />
                )}
              </div>
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          emptyContent={
            <div className="flex flex-col items-center justify-center py-12">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <Spinner size="lg" color="primary" />
                  <p className="text-foreground/60">Cargando datos...</p>
                </div>
              ) : (
                emptyContent || (
                  <div className="flex flex-col items-center gap-4 text-foreground/60">
                    <div className="text-center">
                      <p className="text-lg font-medium">No hay datos disponibles</p>
                      <p className="text-sm">
                        {hasSearchFilter
                          ? "No se encontraron resultados para tu búsqueda"
                          : `No hay ${title} para mostrar`}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          }
          items={sortedItems}
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
                  <div className={`flex items-center ${
                    column.uid === "profilePicture" || column.uid === "actions"
                      ? "justify-center"
                      : "justify-start"
                  }`}>
                    {defaultRenderCell(item, column.uid)}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};