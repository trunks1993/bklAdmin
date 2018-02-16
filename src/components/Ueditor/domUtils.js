/*
动态创建DOM元素的相关函数支持
*/
/*
获取以某个元素的DOM对象
@obj 该元素的ID字符串
*/
export function getElement(obj) {
  return typeof obj == 'string' ? document.getElementById(obj) : obj;
}
/*
获取某个元素的位置
@obj 该元素的DOM对象，或该元素的ID
*/
export function getObjectPosition(obj) {
  obj = typeof obj === 'string' ? getElement(obj) : obj;
  if (!obj) {
    return;
  }
  var position = '';
  if (obj.getBoundingClientRect) //For IEs
  {
    position = obj.getBoundingClientRect();
    return { x: position.left, y: position.top };
  } else if (document.getBoxObjectFor) {
    position = document.getBoxObjectFor(obj);
    return { x: position.x, y: position.y };
  } else {
    position = { x: obj.offsetLeft, y: obj.offsetTop };
    var parent = obj.offsetParent;
    while (parent) {
      position.x += obj.offsetLeft;
      position.y += obj.offsetTop;
      parent = obj.offsetParent;
    }
    return position;
  }
}
/*
为某个DOM对象动态绑定事件
@oTarget 被绑定事件的DOM对象
@sEventType 被绑定的事件名，注意，不加on的事件名，如 'click'
@fnHandler 被绑定的事件处理函数
*/
function addEventHandler(oTarget, sEventType, fnHandler) {
  if (oTarget.addEventListener) {
    oTarget.addEventListener(sEventType, fnHandler, false);
  } else if (oTarget.attachEvent) //for IEs
  {
    oTarget.attachEvent("on" + sEventType, fnHandler);
  } else {
    oTarget["on" + sEventType] = fnHandler;
  }
}
/*
从某个DOM对象中去除某个事件
@oTarget 被绑定事件的DOM对象
@sEventType 被绑定的事件名，注意，不加on的事件名，如 'click'
@fnHandler 被绑定的事件处理函数
*/
function removeEventHandler(oTarget, sEventType, fnHandler) {
  if (oTarget.removeEventListener) {
    oTarget.removeEventListener(sEventType, fnHandler, false)
  } else if (oTarget.detachEvent) //for IEs
  {
    oTarget.detachEvent(sEventType, fnHandler);
  } else {
    oTarget['on' + sEventType] = undefined;
  }
}
/*
创建动态的DOM对象
@domParams是被创建对象的属性的JSON表达，它具有如下属性：
@parentNode 被创建对象所属的父级元素(可为元素ID，也可为DOM对象）
@domId 被创建对象的ID
@domTag 被创建对象的tag名称，支持常用的布局元素，如div span等，但不支持input\form等特别的元素 
@content 被创建的对象内容 
@otherAttributes 为被创建的对象添加除函数必需的属性外其它属性,如[{attrName:'style.color',attrValue:'red'}]
@eventRegisters 为被创建的对象添加事件，类似[{eventType:'click',eventHandler:adsfasdf}]的数组
-经过组合后，该参数具有如下形式:
{parentNode:document.body,domTag:'div',content:'这是测试的',otherAttributes:[{attrName:'style.color',attrValue:'red'}],eventRegisters:[{eventType:'click',eventHandler:fnHandler}]}
*/
function dynCreateDomObject(domParams) {
  if (getElement(domParams.domId)) {
    childNodeAction('remove', domParams.parentNode, domParams.domId);
    return;
  }
  var dynObj = document.createElement(domParams.domTag);
  // with(dynObj) {
  //id也可以通过otherAttributes传入，但是出于ID的特殊性，此处仍然采用
  //JSON对象传入，并以DOM ID属性附件
  dynObj.id = domParams.domId;
  if (!!domParams.content) {
    dynObj.innerHTML = domParams.content; //innerHTML是DOM属性，而id等是元素属性，注意区别
  }
  // }
  /*添加属性*/
  if (null != domParams.otherAttributes) {
    for (var i = 0; i < domParams.otherAttributes.length; i++) {
      var otherAttribute = domParams.otherAttributes[i];
      dynObj.setAttribute(otherAttribute.attrName, otherAttribute.attrValue);
    }
  }
  /*end 添加属性*/
  /*添加相关事件*/
  if (null != domParams.eventRegisters) {
    for (var i = 0; i < domParams.eventRegisters.length; i++) {
      var eventRegister = domParams.eventRegisters[i];
      addEventHandler(dynObj, eventRegister.eventType, eventRegister.eventHandler);
    }
  }
  /*end 添加相关事件*/
  try {
    childNodeAction(domParams.actionType, domParams.parentNode, dynObj);
  } catch ($e) {}
  return dynObj;
}
/*
从父结点中删除子结点
@actionType 默认为append,输入字符串 append | remove
@parentNode 父结点的DOM对象，或者父结点的ID
@childNode 被删除子结点的DOM对象 或者被删除子结点的ID
*/
function childNodeAction(actionType, parentNode, childNode) {
  if (!parentNode) { return; }
  parentNode = typeof parentNode === 'string' ? getElement(parentNode) : parentNode;
  childNode = typeof childNode === 'string' ? getElement(childNode) : childNode;
  if (!parentNode || !childNode) { return; }
  switch (actionType) {
    case 'insertBefore':
      parentNode.insertBefore(childNode, parentNode.children[1]); //把p节点插入到div的前面
      break;
    case 'appendChild':
      parentNode.appendChild(childNode)
      break;
    case 'remove':
      parentNode.removeChild(childNode)
      break;
  }
}


export function createInput(editor, _this) {
  const ie = !!window.ActiveXObject;

  const domDivTitle = {
    domId: 'editor-titleInput',
    parentNode: editor.container,
    domTag: 'div',
    actionType: 'insertBefore',
    otherAttributes: [{ attrName: 'class', attrValue: 'editor-titleInput' }]
  }
  const inputTitle = {
    domId: 'editor-input-title',
    parentNode: 'editor-titleInput',
    domTag: 'input',
    actionType: 'appendChild',
    otherAttributes: [
      { attrName: 'class', attrValue: 'editor-titleInput-title' },
      { attrName: 'placeholder', attrValue: '请在这里输入标题' },
      { attrName: 'max-length', attrValue: '64' }
    ],
    eventRegisters: [{
      eventType: ie ? 'propertychange' : 'input',
      eventHandler: function inputTitle(e) {
        _this.$emit('inputTitleAndAuthor', { inputType: 0, value: getElement('editor-input-title').value })
      }
    },{
      eventType: 'focus',
      eventHandler: function inputTitle(e) {
        _this.editor.setDisabled()
      }
    }]
  }
  const domDivAuthor = {
    domId: 'editor-authorInput',
    parentNode: editor.container,
    domTag: 'div',
    actionType: 'insertBefore',
    otherAttributes: [{ attrName: 'class', attrValue: 'editor-authorInput' }],
  }
  const inputAuthor = {
    domId: 'editor-input-author',
    parentNode: 'editor-authorInput',
    domTag: 'input',
    actionType: 'appendChild',
    otherAttributes: [
      { attrName: 'class', attrValue: 'editor-authorInput-author' },
      { attrName: 'placeholder', attrValue: '请输入作者' },
      { attrName: 'max-length', attrValue: '8' }
    ],
    eventRegisters: [{
      eventType: ie ? 'propertychange' : 'input',
      eventHandler: function inputAuthor(e) {
        _this.$emit('inputTitleAndAuthor', { inputType: 1, value: getElement('editor-input-author').value })
      }
    },{
      eventType: 'focus',
      eventHandler: function inputAuthor(e) {
        _this.editor.setDisabled()
      }
    }]
  }
  const domLine = {
    domId: 'editor-line',
    parentNode: editor.container,
    domTag: 'div',
    actionType: 'insertBefore',
    otherAttributes: [{ attrName: 'class', attrValue: 'editor-line' }]
  }
  const domFixed = {
    domId: 'editor-fixedTemp',
    parentNode: editor.container,
    domTag: 'div',
    actionType: 'insertBefore',
  }
  dynCreateDomObject(domLine)
  dynCreateDomObject(domDivAuthor)
  dynCreateDomObject(inputAuthor)
  dynCreateDomObject(domDivTitle)
  dynCreateDomObject(inputTitle)
  dynCreateDomObject(domFixed)

  document.onscroll = function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    if (_this.$route.path === '/advert/index') {
      if (scrollTop > 91) {
        UE.dom.domUtils.addClass(editor.container.children[0], 'fixedToolBar')
        getElement('editor-fixedTemp').setAttribute('style', 'height: 117px')
        
        UE.dom.domUtils.addClass(getElement('advert-container-advertBox'), 'fixedAdvert')
        getElement('fixedAdvertTemp').setAttribute('style', 'display: block')

        UE.dom.domUtils.addClass(getElement('advert-container-toolsBox'), 'fixedTools')
        getElement('advert-container-toolsBox').setAttribute('style', 'left:'+(getObjectPosition(editor.container).x+750)+'px')
      } else {
        UE.dom.domUtils.removeClasses(editor.container.children[0], 'fixedToolBar')
        getElement('editor-fixedTemp').setAttribute('style', 'height: 0')
        
        UE.dom.domUtils.removeClasses(getElement('advert-container-advertBox'), 'fixedAdvert')
        getElement('fixedAdvertTemp').setAttribute('style', 'display: none')

        UE.dom.domUtils.removeClasses(getElement('advert-container-toolsBox'), 'fixedTools')
      }
    }
  }
}
