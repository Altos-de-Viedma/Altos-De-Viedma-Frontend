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
      case "description":
        return (
          <div className="max-w-xs lg:max-w-md xl:max-w-lg">
            <p className="text-foreground/90 font-medium text-sm leading-relaxed whitespace-normal break-words">
              {cellValue || "-"}
            </p>
          </div>
        );
      default:
        return (
          <span className="text-foreground/90 font-medium">
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
    <div className="flex flex-col gap-2 sm:gap-3">
      {/* Mobile-first layout */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* Search input - full width on mobile */}
        <div className="w-full sm:flex-1 sm:max-w-md">
          <Input
            isClearable
            className="w-full"
            placeholder={`Buscar ${title}...`}
            startContent={<IoSearchOutline className="text-foreground/50" size={18} />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            size="md"
            classNames={{
              base: "bg-white dark:bg-gray-800",
              input: "text-foreground responsive-text-base",
              inputWrapper: [
                "border border-gray-200 dark:border-gray-700",
                "hover:border-gray-300 dark:hover:border-gray-600",
                "focus-within:border-primary-500 dark:focus-within:border-primary-400",
                "min-h-[2.5rem] sm:min-h-[3rem]",
                "px-3 py-2"
              ]
            }}
          />
        </div>

        {/* Action buttons - responsive layout */}
        <div className="flex flex-wrap gap-2 sm:gap-2 justify-center sm:justify-end">
          {onRefresh && (
            <Button
              isIconOnly
              variant="light"
              onPress={onRefresh}
              isLoading={isLoading}
              aria-label="Actualizar datos"
              size="lg"
              className="min-w-[3rem] h-[3rem] sm:min-w-[3.5rem] sm:h-[3.5rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <IoRefreshOutline size={20} />
            </Button>
          )}

          {Object.keys(statusColorMap).length > 0 && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="flat"
                  startContent={<IoFunnelOutline size={18} />}
                  endContent={<IoChevronDownOutline size={16} className="hidden sm:block" />}
                  size="lg"
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[3rem] sm:min-h-[3.5rem] px-3 sm:px-4"
                >
                  <span className="hidden sm:inline">Estado</span>
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
                  base: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg max-w-[90vw] sm:max-w-xs"
                }}
              >
                <DropdownItem key="active" className="capitalize responsive-text-sm">
                  Activo
                </DropdownItem>
                <DropdownItem key="inactive" className="capitalize responsive-text-sm">
                  Inactivo
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                variant="flat"
                startContent={<IoGridOutline size={18} />}
                endContent={<IoChevronDownOutline size={16} className="hidden sm:block" />}
                size="lg"
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[3rem] sm:min-h-[3.5rem] px-3 sm:px-4"
              >
                <span className="hidden sm:inline">Columnas</span>
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
                base: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg max-w-[90vw] sm:max-w-xs max-h-[60vh] overflow-y-auto"
              }}
            >
              {columns.map((column) => (
                <DropdownItem key={column.uid} className="capitalize responsive-text-sm">
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {addButtonComponent && (
            <div className="flex-shrink-0">
              {addButtonComponent}
            </div>
          )}
        </div>
      </div>

      {/* Stats and pagination controls - responsive layout */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center">
          <span className="text-foreground/70 responsive-text-sm font-medium whitespace-nowrap">
            Total {data.length} elementos
            {filteredItems.length !== data.length && (
              <span className="text-primary-600 dark:text-primary-400 ml-2 font-semibold">
                ({filteredItems.length} filtrados)
              </span>
            )}
          </span>
        </div>

        <label className="flex items-center text-foreground/70 responsive-text-sm font-medium whitespace-nowrap">
          Filas por página:
          <select
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md outline-none text-foreground responsive-text-sm ml-2 px-2 py-1 font-medium cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
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
    <div className="py-2 sm:py-2 px-2 sm:px-3 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
      {/* Selection info - full width on mobile */}
      {selectionMode !== "none" && (
        <div className="w-full sm:w-auto text-center sm:text-left">
          <span className="responsive-text-sm text-foreground/70 font-medium">
            {selectedKeys === "all"
              ? "Todos los elementos seleccionados"
              : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
          </span>
        </div>
      )}

      {/* Pagination - centered */}
      <div className="flex-1 flex justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          size="sm"
          classNames={{
            wrapper: "gap-0 overflow-visible h-7 sm:h-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
            item: "w-7 h-7 sm:w-8 sm:h-8 responsive-text-xs rounded-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
            cursor: "bg-primary-500 shadow-md text-white font-semibold",
            prev: "hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600",
            next: "hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600",
          }}
        />
      </div>

      {/* Navigation buttons - hidden on mobile, shown on larger screens */}
      <div className="hidden md:flex gap-2 flex-shrink-0">
        <Button
          size="sm"
          variant="flat"
          isDisabled={page === 1}
          onPress={onPreviousPage}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium responsive-text-xs px-3"
        >
          Anterior
        </Button>

        <Button
          size="sm"
          variant="flat"
          isDisabled={page === pages}
          onPress={onNextPage}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium responsive-text-xs px-3"
        >
          Siguiente
        </Button>
      </div>
    </div>
  ), [selectedKeys, filteredItems.length, page, pages, selectionMode, onPreviousPage, onNextPage]);

  return (
    <div className={`w-full wide-container ${className}`}>
      <Table
        aria-label={`Tabla de ${title}`}
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: [
            "max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] xl:max-h-[700px]",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "shadow-sm rounded-lg",
            "overflow-auto",
            "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600",
            "scrollbar-track-gray-100 dark:scrollbar-track-gray-800"
          ].join(" "),
          table: "min-w-full table-auto",
          th: [
            "bg-gray-50 dark:bg-gray-700",
            "text-foreground font-semibold",
            "border-b border-gray-200 dark:border-gray-600",
            "py-1 sm:py-2 px-2 sm:px-3 lg:px-3 xl:px-4",
            "first:pl-2 sm:first:pl-3 lg:first:pl-4 xl:first:pl-5",
            "last:pr-2 sm:last:pr-3 lg:last:pr-4 xl:last:pr-5",
            "whitespace-nowrap",
            "responsive-text-xs sm:responsive-text-sm",
            "text-left"
          ].join(" "),
          td: [
            "border-b border-gray-100 dark:border-gray-700",
            "py-1 sm:py-2 px-2 sm:px-3 lg:px-3 xl:px-4",
            "first:pl-2 sm:first:pl-3 lg:first:pl-4 xl:first:pl-5",
            "last:pr-2 sm:last:pr-3 lg:last:pr-4 xl:last:pr-5",
            "align-top",
            "responsive-text-xs sm:responsive-text-sm"
          ].join(" "),
          tr: "hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-150",
        }}
        selectedKeys={selectedKeys}
        selectionMode={selectionMode}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        isStriped={isStriped}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "profilePicture" || column.uid === "actions" ? "center" : "start"}
              allowsSorting={false}
              className={`text-foreground font-medium hover:text-foreground transition-colors ${
                column.uid === "description" ? "w-auto min-w-[200px] sm:min-w-[300px] lg:min-w-[400px] xl:min-w-[500px]" :
                column.uid === "actions" ? "w-auto min-w-[120px] sm:min-w-[150px] lg:min-w-[200px] xl:min-w-[250px]" :
                column.uid === "title" ? "w-auto min-w-[100px] sm:min-w-[120px] lg:min-w-[150px] xl:min-w-[200px]" :
                column.uid === "user" ? "w-auto min-w-[80px] sm:min-w-[100px] lg:min-w-[120px] xl:min-w-[150px]" :
                column.uid === "phone" ? "w-auto min-w-[80px] sm:min-w-[100px] xl:min-w-[120px]" :
                column.uid === "date" ? "w-auto min-w-[80px] sm:min-w-[100px] xl:min-w-[120px]" :
                column.uid === "status" || column.uid === "seen" ? "w-auto min-w-[60px] sm:min-w-[80px] xl:min-w-[100px]" :
                "w-auto min-w-[60px] sm:min-w-[80px] xl:min-w-[100px]"
              }`}
            >
              <div className="flex items-center">
                <span className="truncate">{column.name}</span>
              </div>
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          emptyContent={
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <Spinner size="lg" color="primary" />
                  <p className="text-foreground/60 responsive-text-sm">Cargando datos...</p>
                </div>
              ) : (
                emptyContent || (
                  <div className="flex flex-col items-center gap-4 text-foreground/60 text-center max-w-sm">
                    <div>
                      <p className="responsive-text-base font-medium mb-2">No hay datos disponibles</p>
                      <p className="responsive-text-sm text-foreground/50">
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
          items={items}
          isLoading={isLoading}
          loadingContent={
            <div className="flex justify-center py-6 sm:py-8">
              <Spinner size="lg" color="primary" />
            </div>
          }
        >
          {(item) => (
            <TableRow key={(item as any).id || Math.random()}>
              {headerColumns.map((column) => (
                <TableCell
                  key={column.uid}
                  className={
                    column.uid === "description" ? "w-auto min-w-[200px] sm:min-w-[300px] lg:min-w-[400px] xl:min-w-[500px]" :
                    column.uid === "actions" ? "w-auto min-w-[120px] sm:min-w-[150px] lg:min-w-[200px] xl:min-w-[250px]" :
                    column.uid === "title" ? "w-auto min-w-[100px] sm:min-w-[120px] lg:min-w-[150px] xl:min-w-[200px]" :
                    column.uid === "user" ? "w-auto min-w-[80px] sm:min-w-[100px] lg:min-w-[120px] xl:min-w-[150px]" :
                    column.uid === "phone" ? "w-auto min-w-[80px] sm:min-w-[100px] xl:min-w-[120px]" :
                    column.uid === "date" ? "w-auto min-w-[80px] sm:min-w-[100px] xl:min-w-[120px]" :
                    column.uid === "status" || column.uid === "seen" ? "w-auto min-w-[60px] sm:min-w-[80px] xl:min-w-[100px]" :
                    "w-auto min-w-[60px] sm:min-w-[80px] xl:min-w-[100px]"
                  }
                >
                  <div className={`flex items-start ${
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