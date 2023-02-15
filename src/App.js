import React, { useEffect, useState } from 'react';
import grapesjs from 'grapesjs';
import pluginWebPage from 'grapesjs-preset-webpage';
import pluginBasic from 'grapesjs-blocks-basic';
import pluginForms from 'grapesjs-plugin-forms';
import pluginExport from 'grapesjs-plugin-export';
import pluginCountDown from 'grapesjs-component-countdown';
import pluginStyleBg from 'grapesjs-style-bg';
import pluginTyped from 'grapesjs-typed';
import pluginImageEditor from 'grapesjs-tui-image-editor';
import pluginTooltip from 'grapesjs-tooltip';
import styleFilter from 'grapesjs-style-filter';
import customCode from 'grapesjs-custom-code';
import pluginTab from 'grapesjs-tabs';
import blockFlexBox from 'grapesjs-blocks-flexbox';
import styleGradient from 'grapesjs-style-gradient';
import navbar from 'grapesjs-navbar';
import parserPostCss from 'grapesjs-parser-postcss';
import './styles/main.scss';

function App() {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    const editor = grapesjs.init({
      container: '#editor',
      fromElement: 1,
      richTextEditor: {},
      plugins: [
        pluginBasic,
        pluginWebPage,
        pluginForms,
        pluginExport,
        pluginCountDown,
        pluginStyleBg,
        pluginTyped,
        pluginImageEditor,
        pluginTooltip,
        styleFilter,
        customCode,
        pluginTab,
        blockFlexBox,
        styleGradient,
        navbar,
        parserPostCss,
      ],
      pluginsOpts: {},
    });

    var pfx = editor.getConfig().stylePrefix;
    var modal = editor.Modal;
    var cmdm = editor.Commands;
    var codeViewer = editor.CodeManager.getViewer('CodeMirror').clone();
    var pnm = editor.Panels;
    var container = document.createElement('div');
    var btnEdit = document.createElement('button');

    codeViewer.set({
      codeName: 'htmlmixed',
      readOnly: 0,
      theme: 'hopscotch',
      autoBeautify: true,
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineWrapping: true,
      styleActiveLine: true,
      smartIndent: true,
      indentWithTabs: true,
    });

    btnEdit.innerHTML = 'Edit';
    btnEdit.className = pfx + 'btn-prim ' + pfx + 'btn-import';
    btnEdit.onclick = function () {
      var code = codeViewer.editor.getValue();
      editor.DomComponents.getWrapper().set('content', '');
      editor.setComponents(code.trim());
      modal.close();
    };

    cmdm.add('html-edit', {
      run: function (editor, sender) {
        sender && sender.set('active', 0);
        var viewer = codeViewer.editor;
        modal.setTitle('Edit code');
        if (!viewer) {
          var txtarea = document.createElement('textarea');
          container.appendChild(txtarea);
          container.appendChild(btnEdit);
          codeViewer.init(txtarea);
          viewer = codeViewer.editor;
        }
        var InnerHtml = editor.getHtml();
        var Css = editor.getCss();
        modal.setContent('');
        modal.setContent(container);
        codeViewer.setContent(InnerHtml + '<style>' + Css + '</style>');
        modal.open();
        viewer.refresh();
      },
    });

    pnm.addButton('options', [
      {
        id: 'edit',
        className: 'fa fa-edit',
        command: 'html-edit',
        attributes: {
          title: 'Edit',
        },
      },
    ]);

    // Add gradient picker as a single input
    editor.StyleManager.addProperty('decorations', {
      type: 'gradient', // <- new type
      name: 'Gradient',
      property: 'background-image',
      defaults: 'none',
      full: true,
    });

    // Add the new background-image bulti-in type
    editor.StyleManager.addProperty('decorations', {
      extend: 'background-image', // <- extend the built-in type
      name: 'Gradient Background',
    });
    setEditor(editor);
  }, []);

  return (
    <div className="App">
      <div id="editor"></div>
    </div>
  );
}

export default App;
