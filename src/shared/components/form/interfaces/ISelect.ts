
import { Control, FieldValues, Path, FieldErrors } from 'react-hook-form';

type Size = "sm" | "md" | "lg";
type SelectionMode = "multiple" | "single";

type Option = {
  key: string;
  label: string;
};

export type ControlledSelectProps<T extends FieldValues> = {
  label:                string;
  placeholder:          string;
  defaultSelectedKeys?: string[];
  size?:                Size;
  options:              Option[];
  name:                 Path<T>;
  control:              Control<T>;
  errors:               FieldErrors<T>;
  selectionMode?:       SelectionMode;
};