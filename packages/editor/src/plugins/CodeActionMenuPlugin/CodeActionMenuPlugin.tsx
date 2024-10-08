import { $isCodeNode, CodeNode, getLanguageFriendlyName, normalizeCodeLang } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNearestNodeFromDOMNode } from 'lexical';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CopyButton } from './components/CopyButton';
import { canBePrettier, PrettierButton } from './components/PrettierButton';
import { useDebounce } from './utils';

import './CodeActionMenuPlugin.scss';

const CODE_PADDING = 8;

interface Position {
  right: string;
  top: string;
}

interface CodeActionMenuContainerProps {
  floatingAnchor: HTMLElement;
}

function CodeActionMenuContainer({ floatingAnchor }: CodeActionMenuContainerProps): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const [lang, setLang] = useState('');
  const [isShown, setShown] = useState<boolean>(false);
  const [shouldListenMouseMove, setShouldListenMouseMove] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    right: '0',
    top: '0',
  });
  const codeSetRef = useRef<Set<string>>(new Set());
  const codeDOMNodeRef = useRef<HTMLElement | null>(null);

  function getCodeDOMNode(): HTMLElement | null {
    return codeDOMNodeRef.current;
  }

  const debouncedOnMouseMove = useDebounce(
    (event: MouseEvent) => {
      const { codeDOMNode, isOutside } = getMouseInfo(event);
      if (isOutside) {
        setShown(false);
        return;
      }

      if (!codeDOMNode) {
        return;
      }

      codeDOMNodeRef.current = codeDOMNode;

      let codeNode: CodeNode | null = null;
      let _lang = '';

      editor.update(() => {
        const maybeCodeNode = $getNearestNodeFromDOMNode(codeDOMNode);

        if ($isCodeNode(maybeCodeNode)) {
          codeNode = maybeCodeNode;
          _lang = codeNode.getLanguage() || '';
        }
      });

      if (codeNode) {
        const { right: editorElemRight, y: editorElemY } = floatingAnchor.getBoundingClientRect();
        const { right, y } = codeDOMNode.getBoundingClientRect();
        setLang(_lang);
        setShown(true);
        setPosition({
          right: `${editorElemRight - right + CODE_PADDING}px`,
          top: `${y - editorElemY}px`,
        });
      }
    },
    50,
    1000,
  );

  useEffect(() => {
    if (!shouldListenMouseMove) {
      return;
    }

    document.addEventListener('mousemove', debouncedOnMouseMove);

    return () => {
      setShown(false);
      debouncedOnMouseMove.cancel();
      document.removeEventListener('mousemove', debouncedOnMouseMove);
    };
  }, [shouldListenMouseMove, debouncedOnMouseMove]);

  editor.registerMutationListener(CodeNode, (mutations) => {
    editor.getEditorState().read(() => {
      for (const [key, type] of mutations) {
        switch (type) {
          case 'created':
            codeSetRef.current.add(key);
            setShouldListenMouseMove(codeSetRef.current.size > 0);
            break;

          case 'destroyed':
            codeSetRef.current.delete(key);
            setShouldListenMouseMove(codeSetRef.current.size > 0);
            break;

          default:
            break;
        }
      }
    });
  });
  const normalizedLang = normalizeCodeLang(lang);
  const codeFriendlyName = getLanguageFriendlyName(lang);

  return (
    <>
      {isShown && (
        <div className="code-action-menu-container" style={{ ...position }}>
          <div className="code-highlight-language">{codeFriendlyName}</div>
          <CopyButton editor={editor} getCodeDOMNode={getCodeDOMNode} />
          {canBePrettier(normalizedLang) && (
            <PrettierButton editor={editor} getCodeDOMNode={getCodeDOMNode} lang={normalizedLang} />
          )}
        </div>
      )}
    </>
  );
}

function getMouseInfo(event: MouseEvent): {
  codeDOMNode: HTMLElement | null;
  isOutside: boolean;
} {
  const target = event.target;

  if (target && target instanceof HTMLElement) {
    const codeDOMNode = target.closest<HTMLElement>('code.RootEditor__code');
    const isOutside = !(codeDOMNode || target.closest<HTMLElement>('div.code-action-menu-container'));

    return { codeDOMNode, isOutside };
  } else {
    return { codeDOMNode: null, isOutside: true };
  }
}

interface CodeActionMenuProps {
  floatingAnchor: HTMLElement;
}

export function CodeActionMenuPlugin({ floatingAnchor }: CodeActionMenuProps) {
  return ReactDOM.createPortal(<CodeActionMenuContainer floatingAnchor={floatingAnchor} />, floatingAnchor);
}
