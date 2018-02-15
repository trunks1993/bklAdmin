// Here is a list of the toolbar
// Detail list see https://www.tinymce.com/docs/advanced/editor-control-identifiers/#toolbarcontrols

const config = {
  toolbars: [
    ['undo', 'redo', '|', 'fontsize', '|', 'blockquote', 'horizontal', '|', 'removeformat', 'formatmatch', '|', 'link', 'unlink'],
    ['bold', 'italic', 'underline', 'forecolor', 'backcolor', '|', 'indent', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'rowspacingtop', 'rowspacingbottom', 'lineheight', 'insertorderedlist', 'insertunorderedlist']
  ],
  labelMap: {
    'undo': '显示提示信息'
  }
}
export default config
