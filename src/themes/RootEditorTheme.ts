import type { EditorThemeClasses } from 'lexical';

import './RootEditorTheme.scss';

export const rootEditorTheme: EditorThemeClasses = {
  autocomplete: 'RootEditorTheme__autocomplete',
  blockCursor: 'RootEditorTheme__blockCursor',
  characterLimit: 'RootEditorTheme__characterLimit',
  code: 'RootEditorTheme__code',
  codeHighlight: {
    atrule: 'RootEditorTheme__tokenAttr',
    attr: 'RootEditorTheme__tokenAttr',
    boolean: 'RootEditorTheme__tokenProperty',
    builtin: 'RootEditorTheme__tokenSelector',
    cdata: 'RootEditorTheme__tokenComment',
    char: 'RootEditorTheme__tokenSelector',
    class: 'RootEditorTheme__tokenFunction',
    'class-name': 'RootEditorTheme__tokenFunction',
    comment: 'RootEditorTheme__tokenComment',
    constant: 'RootEditorTheme__tokenProperty',
    deleted: 'RootEditorTheme__tokenProperty',
    doctype: 'RootEditorTheme__tokenComment',
    entity: 'RootEditorTheme__tokenOperator',
    function: 'RootEditorTheme__tokenFunction',
    important: 'RootEditorTheme__tokenVariable',
    inserted: 'RootEditorTheme__tokenSelector',
    keyword: 'RootEditorTheme__tokenAttr',
    namespace: 'RootEditorTheme__tokenVariable',
    number: 'RootEditorTheme__tokenProperty',
    operator: 'RootEditorTheme__tokenOperator',
    prolog: 'RootEditorTheme__tokenComment',
    property: 'RootEditorTheme__tokenProperty',
    punctuation: 'RootEditorTheme__tokenPunctuation',
    regex: 'RootEditorTheme__tokenVariable',
    selector: 'RootEditorTheme__tokenSelector',
    string: 'RootEditorTheme__tokenSelector',
    symbol: 'RootEditorTheme__tokenProperty',
    tag: 'RootEditorTheme__tokenProperty',
    url: 'RootEditorTheme__tokenOperator',
    variable: 'RootEditorTheme__tokenVariable',
  },
  embedBlock: {
    base: 'RootEditorTheme__embedBlock',
    focus: 'RootEditorTheme__embedBlockFocus',
  },
  hashtag: 'RootEditorTheme__hashtag',
  heading: {
    h1: 'RootEditorTheme__h1',
    h2: 'RootEditorTheme__h2',
    h3: 'RootEditorTheme__h3',
    h4: 'RootEditorTheme__h4',
    h5: 'RootEditorTheme__h5',
    h6: 'RootEditorTheme__h6',
  },
  hr: 'RootEditorTheme__hr',
  image: 'RootImage',
  indent: 'RootEditorTheme__indent',
  inlineImage: 'RootInlineImage',
  layoutContainer: 'RootEditorTheme__layoutContainer',
  layoutItem: 'RootEditorTheme__layoutItem',
  link: 'RootEditorTheme__link',
  list: {
    checklist: 'RootEditorTheme__checklist',
    listitem: 'RootEditorTheme__listItem',
    listitemChecked: 'RootEditorTheme__listItemChecked',
    listitemUnchecked: 'RootEditorTheme__listItemUnchecked',
    nested: {
      listitem: 'RootEditorTheme__nestedListItem',
    },
    olDepth: [
      'RootEditorTheme__ol1',
      'RootEditorTheme__ol2',
      'RootEditorTheme__ol3',
      'RootEditorTheme__ol4',
      'RootEditorTheme__ol5',
    ],
    ul: 'RootEditorTheme__ul',
  },
  ltr: 'RootEditorTheme__ltr',
  mark: 'RootEditorTheme__mark',
  markOverlap: 'RootEditorTheme__markOverlap',
  paragraph: 'RootEditorTheme__paragraph',
  quote: 'RootEditorTheme__quote',
  rtl: 'RootEditorTheme__rtl',
  table: 'RootEditorTheme__table',
  tableAddColumns: 'RootEditorTheme__tableAddColumns',
  tableAddRows: 'RootEditorTheme__tableAddRows',
  tableCell: 'RootEditorTheme__tableCell',
  tableCellActionButton: 'RootEditorTheme__tableCellActionButton',
  tableCellActionButtonContainer: 'RootEditorTheme__tableCellActionButtonContainer',
  tableCellEditing: 'RootEditorTheme__tableCellEditing',
  tableCellHeader: 'RootEditorTheme__tableCellHeader',
  tableCellPrimarySelected: 'RootEditorTheme__tableCellPrimarySelected',
  tableCellResizer: 'RootEditorTheme__tableCellResizer',
  tableCellSelected: 'RootEditorTheme__tableCellSelected',
  tableCellSortedIndicator: 'RootEditorTheme__tableCellSortedIndicator',
  tableResizeRuler: 'RootEditorTheme__tableCellResizeRuler',
  tableSelected: 'RootEditorTheme__tableSelected',
  tableSelection: 'RootEditorTheme__tableSelection',
  text: {
    bold: 'RootEditorTheme__textBold',
    code: 'RootEditorTheme__textCode',
    italic: 'RootEditorTheme__textItalic',
    strikethrough: 'RootEditorTheme__textStrikethrough',
    subscript: 'RootEditorTheme__textSubscript',
    superscript: 'RootEditorTheme__textSuperscript',
    underline: 'RootEditorTheme__textUnderline',
    underlineStrikethrough: 'RootEditorTheme__textUnderlineStrikethrough',
  },
};
