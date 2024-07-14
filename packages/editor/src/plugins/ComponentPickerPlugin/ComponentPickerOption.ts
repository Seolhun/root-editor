import { MenuOption } from '@lexical/react/LexicalTypeaheadMenuPlugin';

export class ComponentPickerOption extends MenuOption {
  // Icon for display
  icon?: JSX.Element;
  // TBD
  keyboardShortcut?: string;
  // For extra searching.
  keywords: Array<string>;
  // What happens when you select this option?
  onSelect: (queryString: string) => void;
  // What shows up in the editor
  title: string;

  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      keyboardShortcut?: string;
      keywords?: Array<string>;
      onSelect: (queryString: string) => void;
    },
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}
