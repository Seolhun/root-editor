import { EditorThemeClasses } from 'lexical';

export const theme: EditorThemeClasses = {
  autocomplete: 'RootEditor__autocomplete',
  blockCursor: 'RootEditor__blockCursor',
  characterLimit: 'RootEditor__characterLimit',
  code: 'RootEditor__code',
  codeHighlight: {
    atrule: 'RootEditor__tokenAttr',
    attr: 'RootEditor__tokenAttr',
    boolean: 'RootEditor__tokenProperty',
    builtin: 'RootEditor__tokenSelector',
    cdata: 'RootEditor__tokenComment',
    char: 'RootEditor__tokenSelector',
    class: 'RootEditor__tokenFunction',
    'class-name': 'RootEditor__tokenFunction',
    comment: 'RootEditor__tokenComment',
    constant: 'RootEditor__tokenProperty',
    deleted: 'RootEditor__tokenProperty',
    doctype: 'RootEditor__tokenComment',
    entity: 'RootEditor__tokenOperator',
    function: 'RootEditor__tokenFunction',
    important: 'RootEditor__tokenVariable',
    inserted: 'RootEditor__tokenSelector',
    keyword: 'RootEditor__tokenAttr',
    namespace: 'RootEditor__tokenVariable',
    number: 'RootEditor__tokenProperty',
    operator: 'RootEditor__tokenOperator',
    prolog: 'RootEditor__tokenComment',
    property: 'RootEditor__tokenProperty',
    punctuation: 'RootEditor__tokenPunctuation',
    regex: 'RootEditor__tokenVariable',
    selector: 'RootEditor__tokenSelector',
    string: 'RootEditor__tokenSelector',
    symbol: 'RootEditor__tokenProperty',
    tag: 'RootEditor__tokenProperty',
    url: 'RootEditor__tokenOperator',
    variable: 'RootEditor__tokenVariable',
  },
  embedBlock: {
    base: 'RootEditor__embedBlock',
    focus: 'RootEditor__embedBlockFocus',
  },
  hashtag: 'RootEditor__hashtag',
  heading: {
    h1: 'RootEditor__h1',
    h2: 'RootEditor__h2',
    h3: 'RootEditor__h3',
    h4: 'RootEditor__h4',
    h5: 'RootEditor__h5',
    h6: 'RootEditor__h6',
  },
  hr: 'RootEditor__hr',
  image: 'RootEditor__image',
  indent: 'RootEditor__indent',
  inlineImage: 'inline-editor-image',
  layoutContainer: 'RootEditor__layoutContainer',
  layoutItem: 'RootEditor__layoutItem',
  link: 'RootEditor__link',
  list: {
    checklist: 'RootEditor__checklist',
    listitem: 'RootEditor__listItem',
    listitemChecked: 'RootEditor__listItemChecked',
    listitemUnchecked: 'RootEditor__listItemUnchecked',
    nested: {
      listitem: 'RootEditor__nestedListItem',
    },
    ol: 'RootEditor__ol',
    olDepth: ['RootEditor__ol1', 'RootEditor__ol2', 'RootEditor__ol3', 'RootEditor__ol4', 'RootEditor__ol5'],
    ul: 'RootEditor__ul',
    ulDepth: ['RootEditor__ul1', 'RootEditor__ul2', 'RootEditor__ul3', 'RootEditor__ul4', 'RootEditor__ul5'],
  },
  ltr: 'RootEditor__ltr',
  mark: 'RootEditor__mark',
  markOverlap: 'RootEditor__markOverlap',
  paragraph: 'RootEditor__paragraph',
  quote: 'RootEditor__quote',
  rtl: 'RootEditor__rtl',
  table: 'RootEditor__Table',
  tableAddColumns: 'RootEditor__TableAddColumns',
  tableAddRows: 'RootEditor__TableAddRows',
  tableCell: 'RootEditor__TableCell',
  tableCellActionButton: 'RootEditor__TableCellActionButton',
  tableCellActionButtonContainer: 'RootEditor__TableCellActionButtonContainer',
  tableCellEditing: 'RootEditor__TableCellEditing',
  tableCellHeader: 'RootEditor__TableCellHeader',
  tableCellPrimarySelected: 'RootEditor__TableCellPrimarySelected',
  tableCellResizer: 'RootEditor__TableCellResizer',
  tableCellSelected: 'RootEditor__TableCellSelected',
  tableCellSortedIndicator: 'RootEditor__TableCellSortedIndicator',
  tableResizeRuler: 'RootEditor__TableCellResizeRuler',
  tableSelected: 'RootEditor__TableSelected',
  tableSelection: 'RootEditor__TableSelection',
  text: {
    bold: 'RootEditor__textBold',
    code: 'RootEditor__textCode',
    italic: 'RootEditor__textItalic',
    strikethrough: 'RootEditor__textStrikethrough',
    subscript: 'RootEditor__textSubscript',
    superscript: 'RootEditor__textSuperscript',
    underline: 'RootEditor__textUnderline',
    underlineStrikethrough: 'RootEditor__textUnderlineStrikethrough',
  },
};

export interface RootEditorClasses extends EditorThemeClasses {
  componentPicker: 'RootEditor__ComponentPicker';
  floatingTextFormatToolbar: 'RootEditor__FloatingTextFormatToolbar';
  fontSizer: 'RootEditor__FontSizer';
  imageCaption: 'ImageNode__Caption';
  imageResizer: 'ImageNode__Resizer';
  imageResizerResizing: 'ImageNode__Resizer--resizing';
  linkEditor: 'RootEditor__LinkEditor';
  mention: 'RootEditor__Mention';
  mentionList: 'RootEditor__MentionList';
  plainText: 'RootEditor__PlainText';
  richText: 'RootEditor__RichText';
  settings: 'RootEditor__Settings';
}

export const EditorClasses = {
  ...theme,
  componentPicker: 'RootEditor__ComponentPicker',
  floatingTextFormatToolbar: 'RootEditor__FloatingTextFormatToolbar',
  fontSizer: 'RootEditor__FontSizer',
  imageCaption: 'ImageNode__Caption',
  imageResizer: 'ImageNode__Resizer',
  imageResizerResizing: 'ImageNode__Resizer--resizing',
  linkEditor: 'RootEditor__LinkEditor',
  mention: 'RootEditor__Mention',
  mentionList: 'RootEditor__MentionList',
  plainText: 'RootEditor__PlainText',
  richText: 'RootEditor__RichText',
  settings: 'RootEditor__Settings',
} as const satisfies RootEditorClasses;
