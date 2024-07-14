import { MenuOption } from '@lexical/react/LexicalNodeMenuPlugin';

export class MentionOption extends MenuOption {
  name: string;
  picture: JSX.Element;

  constructor(name: string, picture: JSX.Element) {
    super(name);
    this.name = name;
    this.picture = picture;
  }
}

export interface MentionTypeaheadMenuItemProps {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionOption;
}

export type FetchMentionOptionsFn = (queryString: null | string) => Promise<MentionOption[]>;
export type RenderMentionOptionFn = (option: MentionOption, index: number) => JSX.Element;
