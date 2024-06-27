import { DropdownItem } from './Dropdown.Item';
import { DropdownItemList } from './Dropdown.ItemList';
import { DropdownRoot } from './Dropdown.Root';

export const Dropdown = Object.assign(DropdownRoot, {
  Item: DropdownItem,
  ItemList: DropdownItemList,
});
