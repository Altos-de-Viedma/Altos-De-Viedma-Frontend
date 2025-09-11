import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Selection } from '@nextui-org/react';



export const DropMenuExample = () => {

  const [ selectedKeys, setSelectedKeys ] = React.useState<Selection>( new Set( [ "text" ] ) );

  const handleSelectionChange = ( keys: Selection ) => {
    setSelectedKeys( keys );
  };

  const handleSelectAll = () => {
    setSelectedKeys( new Set( [
      "text",
      "literature",
      "geography",
      "number",
      "date",
      "single_date",
      "iteration"
    ] ) );
  };

  const handleDeselectAll = () => {
    setSelectedKeys( new Set() );
  };

  const displayText = React.useMemo( () => {
    if ( selectedKeys === "all" ) return "All options";
    return Array.from( selectedKeys as Set<string> ).join( ", " ).replace( /_/g, " " );
  }, [ selectedKeys ] );

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          { displayText || 'Select options' }
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Multiple selection example"
        variant="flat"
        closeOnSelect={ false }
        disallowEmptySelection
        selectionMode="multiple"
        selectedKeys={ selectedKeys }
        onSelectionChange={ handleSelectionChange }
      >
        <DropdownItem key="additional_options" isReadOnly className="opacity-50">
          Additional Options
        </DropdownItem>

        <DropdownItem key="text" textValue="Arte">
          Arte
        </DropdownItem>

        <DropdownItem key="literature" textValue="Literatura">
          Literatura
        </DropdownItem>

        <DropdownItem key="geography" textValue="Geografía">
          Geografía
        </DropdownItem>

        <DropdownItem key="number">Number</DropdownItem>
        <DropdownItem key="date">Date</DropdownItem>

        <DropdownItem key="separator_2" isReadOnly className="opacity-50">
          Additional Options
        </DropdownItem>

        <DropdownItem key="single_date">Single Date</DropdownItem>
        <DropdownItem key="iteration">Iteration</DropdownItem>

        <DropdownItem key="separator_3" isReadOnly className="opacity-50">
          Options
        </DropdownItem>
        <DropdownItem key="select_all" textValue="Select All" onClick={ handleSelectAll }>
          Select All
        </DropdownItem>
        <DropdownItem key="deselect_all" textValue="Deselect All" onClick={ handleDeselectAll }>
          Deselect All
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};