"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[611],{"../node_modules/.pnpm/@lexical+react@0.15.0_react-dom@18.3.1_react@18.3.1_yjs@13.6.15/node_modules/@lexical/react/LexicalNestedComposer.prod.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>f});var _lexical_react_LexicalCollaborationContext__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../node_modules/.pnpm/@lexical+react@0.15.0_react-dom@18.3.1_react@18.3.1_yjs@13.6.15/node_modules/@lexical/react/LexicalCollaborationContext.prod.mjs"),_lexical_react_LexicalComposerContext__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../node_modules/.pnpm/@lexical+react@0.15.0_react-dom@18.3.1_react@18.3.1_yjs@13.6.15/node_modules/@lexical/react/LexicalComposerContext.prod.mjs"),react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../node_modules/.pnpm/react@18.3.1/node_modules/react/index.js");var c=function s(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}((function(e){const t=new URLSearchParams;t.append("code",e);for(let e=1;e<arguments.length;e++)t.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));function p(e){const t=e.transform();return null!==t?new Set([t]):new Set}function f({initialEditor:s,children:f,initialNodes:d,initialTheme:u,skipCollabChecks:m}){const h=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),x=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_lexical_react_LexicalComposerContext__WEBPACK_IMPORTED_MODULE_1__.Gu);null==x&&c(9);const[_,{getTheme:g}]=x,v=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)((()=>{const e=u||g()||void 0,t=(0,_lexical_react_LexicalComposerContext__WEBPACK_IMPORTED_MODULE_1__.Mx)(x,e);if(void 0!==e&&(s._config.theme=e),s._parentEditor=_,d)for(let e of d){let t=null,r=null;if("function"!=typeof e){const o=e;e=o.replace,t=o.with,r=o.withKlass||null}const o=s._nodes.get(e.getType());s._nodes.set(e.getType(),{exportDOM:o?o.exportDOM:void 0,klass:e,replace:t,replaceWithKlass:r,transforms:p(e)})}else{const e=s._nodes=new Map(_._nodes);for(const[t,r]of e)s._nodes.set(t,{exportDOM:r.exportDOM,klass:r.klass,replace:r.replace,replaceWithKlass:r.replaceWithKlass,transforms:p(r.klass)})}return s._config.namespace=_._config.namespace,s._editable=_._editable,[s,t]}),[]),{isCollabActive:w,yjsDocMap:b}=(0,_lexical_react_LexicalCollaborationContext__WEBPACK_IMPORTED_MODULE_2__.k)(),M=m||h.current||b.has(s.getKey());return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{M&&(h.current=!0)}),[M]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>_.registerEditableListener((e=>{s.setEditable(e)}))),[s,_]),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_lexical_react_LexicalComposerContext__WEBPACK_IMPORTED_MODULE_1__.Gu.Provider,{value:v},!w||M?f:null)}},"./nodes/StickyComponent.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>StickyComponent});var LexicalCollaborationContext_prod=__webpack_require__("../node_modules/.pnpm/@lexical+react@0.15.0_react-dom@18.3.1_react@18.3.1_yjs@13.6.15/node_modules/@lexical/react/LexicalCollaborationContext.prod.mjs"),LexicalCollaborationPlugin_prod=__webpack_require__("../node_modules/.pnpm/@lexical+react@0.15.0_react-dom@18.3.1_react@18.3.1_yjs@13.6.15/node_modules/@lexical/react/LexicalCollaborationPlugin.prod.mjs"),LexicalComposerContext_prod=__webpack_require__("../node_modules/.pnpm/@lexical+react@0.15.0_react-dom@18.3.1_react@18.3.1_yjs@13.6.15/node_modules/@lexical/react/LexicalComposerContext.prod.mjs"),LexicalErrorBoundary_prod=__webpack_require__("../node_modules/.pnpm/@lexical+react@0.15.0_react-dom@18.3.1_react@18.3.1_yjs@13.6.15/node_modules/@lexical/react/LexicalErrorBoundary.prod.mjs"),LexicalHistoryPlugin_prod=__webpack_require__("../node_modules/.pnpm/@lexical+react@0.15.0_react-dom@18.3.1_react@18.3.1_yjs@13.6.15/node_modules/@lexical/react/LexicalHistoryPlugin.prod.mjs"),LexicalNestedComposer_prod=__webpack_require__("../node_modules/.pnpm/@lexical+react@0.15.0_react-dom@18.3.1_react@18.3.1_yjs@13.6.15/node_modules/@lexical/react/LexicalNestedComposer.prod.mjs"),LexicalPlainTextPlugin_prod=__webpack_require__("../node_modules/.pnpm/@lexical+react@0.15.0_react-dom@18.3.1_react@18.3.1_yjs@13.6.15/node_modules/@lexical/react/LexicalPlainTextPlugin.prod.mjs"),LexicalUtils_prod=__webpack_require__("../node_modules/.pnpm/@lexical+utils@0.15.0/node_modules/@lexical/utils/LexicalUtils.prod.mjs"),Lexical_prod=__webpack_require__("../node_modules/.pnpm/lexical@0.15.0/node_modules/lexical/Lexical.prod.mjs"),react=__webpack_require__("../node_modules/.pnpm/react@18.3.1/node_modules/react/index.js"),useLayoutEffect=__webpack_require__("./shared/useLayoutEffect.ts"),collaboration=__webpack_require__("./collaboration.ts"),SharedHistoryContext=__webpack_require__("./context/SharedHistoryContext.tsx");const StickyEditorTheme={...__webpack_require__("./themes/RootEditorTheme.ts").h,paragraph:"StickyEditorTheme__paragraph"};var ContentEditable=__webpack_require__("./ui/ContentEditable.tsx"),Placeholder=__webpack_require__("./ui/Placeholder.tsx"),StickyNode=__webpack_require__("./nodes/StickyNode.tsx");function positionSticky(stickyElem,positioning){const style=stickyElem.style,rootElementRect=positioning.rootElementRect,rectLeft=null!==rootElementRect?rootElementRect.left:0,rectTop=null!==rootElementRect?rootElementRect.top:0;style.top=rectTop+positioning.y+"px",style.left=rectLeft+positioning.x+"px"}function StickyComponent(_ref){let{caption,color,nodeKey,x,y}=_ref;const[editor]=(0,LexicalComposerContext_prod.DF)(),stickyContainerRef=(0,react.useRef)(null),positioningRef=(0,react.useRef)({isDragging:!1,offsetX:0,offsetY:0,rootElementRect:null,x:0,y:0}),{isCollabActive}=(0,LexicalCollaborationContext_prod.k)();(0,react.useEffect)((()=>{const position=positioningRef.current;position.x=x,position.y=y;const stickyContainer=stickyContainerRef.current;null!==stickyContainer&&positionSticky(stickyContainer,position)}),[x,y]),(0,useLayoutEffect.A)((()=>{const position=positioningRef.current,resizeObserver=new ResizeObserver((entries=>{for(let i=0;i<entries.length;i++){const entry=entries[i],{target}=entry;position.rootElementRect=target.getBoundingClientRect();const stickyContainer=stickyContainerRef.current;null!==stickyContainer&&positionSticky(stickyContainer,position)}})),removeRootListener=editor.registerRootListener(((nextRootElem,prevRootElem)=>{null!==prevRootElem&&resizeObserver.unobserve(prevRootElem),null!==nextRootElem&&resizeObserver.observe(nextRootElem)})),handleWindowResize=()=>{const rootElement=editor.getRootElement(),stickyContainer=stickyContainerRef.current;null!==rootElement&&null!==stickyContainer&&(position.rootElementRect=rootElement.getBoundingClientRect(),positionSticky(stickyContainer,position))};return window.addEventListener("resize",handleWindowResize),()=>{window.removeEventListener("resize",handleWindowResize),removeRootListener()}}),[editor]),(0,react.useEffect)((()=>{const stickyContainer=stickyContainerRef.current;null!==stickyContainer&&setTimeout((()=>{stickyContainer.style.setProperty("transition","top 0.3s ease 0s, left 0.3s ease 0s")}),500)}),[]);const handlePointerMove=event=>{const stickyContainer=stickyContainerRef.current,positioning=positioningRef.current,rootElementRect=positioning.rootElementRect,zoom=(0,LexicalUtils_prod.OV)(stickyContainer);null!==stickyContainer&&positioning.isDragging&&null!==rootElementRect&&(positioning.x=event.pageX/zoom-positioning.offsetX-rootElementRect.left,positioning.y=event.pageY/zoom-positioning.offsetY-rootElementRect.top,positionSticky(stickyContainer,positioning))},handlePointerUp=event=>{const stickyContainer=stickyContainerRef.current,positioning=positioningRef.current;null!==stickyContainer&&(positioning.isDragging=!1,stickyContainer.classList.remove("dragging"),editor.update((()=>{const node=(0,Lexical_prod.ns)(nodeKey);(0,StickyNode.oL)(node)&&node.setPosition(positioning.x,positioning.y)}))),document.removeEventListener("pointermove",handlePointerMove),document.removeEventListener("pointerup",handlePointerUp)},{historyState}=(0,SharedHistoryContext.O)();return react.createElement("div",{className:"sticky-note-container",ref:stickyContainerRef},react.createElement("div",{onPointerDown:event=>{const stickyContainer=stickyContainerRef.current;if(null==stickyContainer||2===event.button||event.target!==stickyContainer.firstChild)return;const stickContainer=stickyContainer,positioning=positioningRef.current;if(null!==stickContainer){const{left,top}=stickContainer.getBoundingClientRect(),zoom=(0,LexicalUtils_prod.OV)(stickContainer);positioning.offsetX=event.clientX/zoom-left,positioning.offsetY=event.clientY/zoom-top,positioning.isDragging=!0,stickContainer.classList.add("dragging"),document.addEventListener("pointermove",handlePointerMove),document.addEventListener("pointerup",handlePointerUp),event.preventDefault()}},className:`sticky-note ${color}`},react.createElement("button",{"aria-label":"Delete sticky note",className:"delete",onClick:()=>{editor.update((()=>{const node=(0,Lexical_prod.ns)(nodeKey);(0,StickyNode.oL)(node)&&node.remove()}))},title:"Delete"},"X"),react.createElement("button",{"aria-label":"Change sticky note color",className:"color",onClick:()=>{editor.update((()=>{const node=(0,Lexical_prod.ns)(nodeKey);(0,StickyNode.oL)(node)&&node.toggleColor()}))},title:"Color"},react.createElement("i",{className:"bucket"})),react.createElement(LexicalNestedComposer_prod.s,{initialEditor:caption,initialTheme:StickyEditorTheme},isCollabActive?react.createElement(LexicalCollaborationPlugin_prod.V,{id:caption.getKey(),providerFactory:collaboration.f,shouldBootstrap:!0}):react.createElement(LexicalHistoryPlugin_prod.G,{externalHistoryState:historyState}),react.createElement(LexicalPlainTextPlugin_prod.h,{contentEditable:react.createElement(ContentEditable.A,{className:"StickyNode__contentEditable"}),ErrorBoundary:LexicalErrorBoundary_prod.A,placeholder:react.createElement(Placeholder.A,{className:"StickyNode__placeholder"},"What's up?")}))))}try{StickyComponent.displayName="StickyComponent",StickyComponent.__docgenInfo={description:"",displayName:"StickyComponent",props:{caption:{defaultValue:null,description:"",name:"caption",required:!0,type:{name:"LexicalEditor"}},color:{defaultValue:null,description:"",name:"color",required:!0,type:{name:"enum",value:[{value:'"pink"'},{value:'"yellow"'}]}},nodeKey:{defaultValue:null,description:"",name:"nodeKey",required:!0,type:{name:"string"}},x:{defaultValue:null,description:"",name:"x",required:!0,type:{name:"number"}},y:{defaultValue:null,description:"",name:"y",required:!0,type:{name:"number"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/nodes/StickyComponent.tsx#StickyComponent"]={docgenInfo:StickyComponent.__docgenInfo,name:"StickyComponent",path:"src/nodes/StickyComponent.tsx#StickyComponent"})}catch(__react_docgen_typescript_loader_error){}}}]);