import { DropdownItem } from './Dropdown.Item';
import { DropdownPanel } from './Dropdown.Panel';
import { DropdownRoot } from './Dropdown.Root';
import { DropdownTrigger } from './Dropdown.Trigger';

export const Dropdown = Object.assign(DropdownRoot, {
  Item: DropdownItem,
  Panel: DropdownPanel,
  Trigger: DropdownTrigger,
});
