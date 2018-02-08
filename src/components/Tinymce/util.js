export function initAddCommand(ed) {
  ed.addCommand('mceStageindent', function() {
    //基本变量设置
    var ed = tinyMCE.activeEditor,
      d = ed.dom,
      s = ed.selection,
      st, tn;
    st = s.getNode().style;
    tn = s.getNode().tagName
    const ps = d.select('p');
    //实现在选取段落时候缩进段落，不选取则缩进所有段落。
    if (s.getContent() != "") {
      let arr = []
      for (const index in ps) {
        if (index >= ps.indexOf(s.getStart().tagName == 'P' ? s.getStart() : s.getStart().parentNode) &&
          index <= ps.indexOf(s.getEnd().tagName == 'P' ? s.getEnd() : s.getEnd().parentNode)) arr.push(ps[index])
      }
      if (hasIndent(arr)) d.setStyle(arr, 'text-indent', '2em');
      else d.setStyle(arr, 'text-indent', '');
    } else {
      if (hasIndent(ps)) d.setStyle(ps, 'text-indent', '2em');
      else d.setStyle(ps, 'text-indent', '');
    }
  })

  ed.addCommand('mceStageImg', function() {
    var ed = tinyMCE.activeEditor,
      d = ed.dom,
      s = ed.selection,
      st = s.getNode().style;
    var allinline = d.select('img');
    if (s.getContent() != "") {
      st.width = '100%';
      st.height = 'auto';
    } else {
      d.setStyle(allinline, 'width', '100%');
      d.setStyle(allinline, 'height', 'auto');
    }
  })
}

function hasIndent(arr) {
  let flag = false
  for (const index in arr) {
    if (arr[index].style.textIndent == '' || arr[index].style.textIndent == 'undefined') {
      flag = true
      break
    }
  }
  return flag
}
