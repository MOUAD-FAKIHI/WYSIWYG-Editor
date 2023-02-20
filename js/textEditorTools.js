iframe = document.getElementById('iframeTextEdit');
content = document.getElementById('iframeContent').innerHTML;
frameDoc = iframe.document;
if (iframe.contentWindow) {
  frameDoc = iframe.contentWindow.document;
}
frameDoc.open();
frameDoc.writeln(content);
frameDoc.close();

let ii = 1;
let jj = 1;

iframeBody = iframe.contentWindow.document.getElementById('bodyEditor');
showCodeSource();
// insert <p><br></p> if iframebody is empty
iframeBody.addEventListener('keyup', (e) => {
  if (e.keyCode == 8) {
    if (iframeBody.childNodes.length == 0) {
      iframeBody.insertAdjacentHTML('afterbegin', '<p><br></p>');
      ii = 0;
      jj = 0;
    }
  }
});

// function bold
document.getElementById('bold_button').onclick = () => {
  document
    .getElementById('iframeTextEdit')
    .contentWindow.document.execCommand('bold', false, null);
  document.getElementById('bold_button').classList.toggle('active');
  iframeBody.focus();
};
//  function ordered list
document.getElementById('orderList_button').onclick = () => {
  if (isSelectionTag('OL')) {
    let currentNode = iframe.contentWindow.getSelection().focusNode;
    // while the node is note the body contenteditable
    while (currentNode.id != 'bodyEditor') {
      if (currentNode.tagName === 'OL') break;
      currentNode = currentNode.parentNode;
    }
    let liTags = currentNode.getElementsByTagName('li');
    let allNewPtags = new Array();
    for (i = 0; i < liTags.length; i++) {
      let newPtag = iframe.contentWindow.document.createElement('p');
      newPtag.innerHTML = liTags[i].innerHTML;
      allNewPtags.push(newPtag);
    }
    currentNode.parentNode.replaceChild(allNewPtags[0], currentNode);
    for (i = 0; i < liTags.length - 1; i++) {
      allNewPtags[i].after(allNewPtags[i + 1]);
    }
    document.getElementById('orderList_button').classList.remove('active');
  } else {
    document
      .getElementById('iframeTextEdit')
      .contentWindow.document.execCommand('insertOrderedList', false, null);
  }
  iframeBody.focus();
  showCodeSource();
};
//  function unordered list
document.getElementById('unorderedList_button').onclick = () => {
  if (isSelectionTag('UL')) {
    let currentNode = iframe.contentWindow.getSelection().focusNode;
    // while the node is note the body contenteditable
    while (currentNode.id != 'bodyEditor') {
      if (currentNode.tagName === 'UL') break;
      currentNode = currentNode.parentNode;
    }
    let liTags = currentNode.getElementsByTagName('li');
    let allNewPtags = new Array();
    for (i = 0; i < liTags.length; i++) {
      let newPtag = iframe.contentWindow.document.createElement('p');
      newPtag.innerHTML = liTags[i].innerHTML;
      allNewPtags.push(newPtag);
    }
    currentNode.parentNode.replaceChild(allNewPtags[0], currentNode);
    for (i = 0; i < liTags.length - 1; i++) {
      allNewPtags[i].after(allNewPtags[i + 1]);
    }
    document.getElementById('unorderedList_button').classList.remove('active');
  } else {
    document
      .getElementById('iframeTextEdit')
      .contentWindow.document.execCommand('insertUnorderedList', false, null);
  }
  iframeBody.focus();
  showCodeSource();
};
// underline text
document.getElementById('underline_button').onclick = () => {
  document
    .getElementById('iframeTextEdit')
    .contentWindow.document.execCommand('underline', false, null);
  document.getElementById('underline_button').classList.toggle('active');
  iframeBody.focus();
};
// italic text
document.getElementById('italic_button').onclick = () => {
  document
    .getElementById('iframeTextEdit')
    .contentWindow.document.execCommand('italic', false, null);
  document.getElementById('italic_button').classList.toggle('active');
  iframeBody.focus();
};
// last and next action
function doUndo() {
  document
    .getElementById('iframeTextEdit')
    .contentWindow.document.execCommand('undo', false, null);
  iframeBody.focus();
}
function doRedo() {
  document
    .getElementById('iframeTextEdit')
    .contentWindow.document.execCommand('redo', false, null);
  iframeBody.focus();
}
// change color
function changeColor() {
  document
    .getElementById('iframeTextEdit')
    .contentWindow.document.execCommand(
      'foreColor',
      false,
      document.getElementById('txtColorSelector').value
    );
  iframeBody.focus();
}
// change text size
function changeSize() {
  document
    .getElementById('iframeTextEdit')
    .contentWindow.document.execCommand(
      'fontSize',
      false,
      document.getElementById('txtSizeSelector').value
    );
  iframeBody.focus();
}
// show code source
iframeBody.addEventListener('input', showCodeSource, false);
function showCodeSource() {
  // remove p parent tag of ul tags
  const ulTags = iframeBody.getElementsByTagName('ul');
  for (i = 0; i < ulTags.length; i++) {
    const ulParentTag = ulTags[i].parentNode;
    if (ulParentTag.nodeName == 'P') {
      ulTags[i].parentNode.replaceWith(ulTags[i]);
    }
  }
  // remove p parent tag of ol tags
  const olTags = iframeBody.getElementsByTagName('ol');
  for (i = 0; i < olTags.length; i++) {
    const olParentTag = olTags[i].parentNode;
    if (olParentTag.nodeName == 'P') {
      olTags[i].parentNode.replaceWith(olTags[i]);
    }
  }
  // remplacer les div par des p
  const divTags = iframeBody.getElementsByTagName('div');
  for (i = 0; i < divTags.length; i++) {
    let newPtag = iframe.contentWindow.document.createElement('p');
    newPtag.innerHTML = divTags[i].innerHTML;
    divTags[i].parentNode.replaceChild(newPtag, divTags[i]);
  }

  // show source code
  const TagsReturn = iframeBody.childNodes;
  document.getElementById('sourceCodeHTML').value = '';
  for (i = ii; i < TagsReturn.length - jj; i++) {
    let tagsRl = TagsReturn[i].outerHTML;
    if (!/^<p>/.test(tagsRl)) {
      tagsRl = tagsRl.replace(/></g, '>\n<');
      tagsRl = tagsRl.replace(/\n<u>/g, '<u>');
      tagsRl = tagsRl.replace(/\n<font/g, '<font');
      tagsRl = tagsRl.replace(/\n<i>/g, '<i>');
      tagsRl = tagsRl.replace(/\n<b>/g, '<b>');
      tagsRl = tagsRl.replace(/<\/u>\n/g, '</u>');
      tagsRl = tagsRl.replace(/<\/font>\n/g, '</font>');
      tagsRl = tagsRl.replace(/<\/i>\n/g, '</i>');
      tagsRl = tagsRl.replace(/<\/b>\n/g, '</b>');
      tagsRl = tagsRl.replace(/\n<br>\n/g, '<br>');
      tagsRl = tagsRl.replace(/ style=""/g, '');
    }
    document.getElementById('sourceCodeHTML').value += tagsRl + '\n';
  }
}

// past only text
iframeBody.addEventListener('paste', function (e) {
  // cancel paste
  e.preventDefault();
  // get text representation of clipboard
  let pastext = (e.originalEvent || e).clipboardData.getData('text/plain');
  // insert text manually
  document
    .getElementById('iframeTextEdit')
    .contentWindow.document.execCommand('insertHTML', false, pastext);
});

// focus to the content editable
document.addEventListener('DOMContentLoaded', () => {
  iframeBody.focus();
});

iframe.contentWindow.document.onclick = () => {
  iframeBody.focus();
};
// active the buttons when selection changes
iframe.contentWindow.document.onselectionchange = () => {
  // check if the editor is focused
  if (iframeBody === iframe.contentWindow.document.activeElement) {
    if (isSelectionTag('B')) {
      document.getElementById('bold_button').classList.add('active');
    } else {
      document.getElementById('bold_button').classList.remove('active');
    }

    if (isSelectionTag('I')) {
      document.getElementById('italic_button').classList.add('active');
    } else {
      document.getElementById('italic_button').classList.remove('active');
    }

    if (isSelectionTag('U')) {
      document.getElementById('underline_button').classList.add('active');
    } else {
      document.getElementById('underline_button').classList.remove('active');
    }

    if (isSelectionTag('UL')) {
      document.getElementById('unorderedList_button').classList.add('active');
    } else {
      document
        .getElementById('unorderedList_button')
        .classList.remove('active');
    }

    if (isSelectionTag('OL')) {
      document.getElementById('orderList_button').classList.add('active');
    } else {
      document.getElementById('orderList_button').classList.remove('active');
    }

    if (isSelectionAlign('center')) {
      document.getElementById('button_alignCenter').classList.add('active');
    } else {
      document.getElementById('button_alignCenter').classList.remove('active');
    }

    if (isSelectionAlign('left')) {
      document.getElementById('button_alignLeft').classList.add('active');
    } else {
      document.getElementById('button_alignLeft').classList.remove('active');
    }

    if (isSelectionAlign('right')) {
      document.getElementById('button_alignRight').classList.add('active');
    } else {
      document.getElementById('button_alignRight').classList.remove('active');
    }
  }
};

// check if the current selection
function isSelectionTag(tag) {
  // Get the current node
  let currentNode = iframe.contentWindow.getSelection().focusNode;
  // while the node is note the body contenteditable
  while (currentNode.id != 'bodyEditor') {
    if (currentNode.tagName === tag) return true;
    currentNode = currentNode.parentNode;
  }
  return false;
}
// check the text align
function isSelectionAlign(align) {
  // Get the current node
  let currentNode = iframe.contentWindow.getSelection().focusNode;
  // while the node is note the body contenteditable
  while (currentNode.id != 'bodyEditor') {
    if (currentNode.style?.textAlign && currentNode.style.textAlign === align)
      return true;
    currentNode = currentNode.parentNode;
  }
  return false;
}

// text alignment left center right
function textRight() {
  if (isSelectionAlign('right')) {
    // Get the current node
    let currentNode = iframe.contentWindow.getSelection().focusNode;
    // while the node is note the body contenteditable
    while (currentNode.id != 'bodyEditor') {
      if (currentNode.style?.textAlign) {
        currentNode.style.removeProperty('text-align');
        break;
      }
      currentNode = currentNode.parentNode;
    }
    document.getElementById('button_alignRight').classList.remove('active');
    document.getElementById('button_alignLeft').classList.remove('active');
    document.getElementById('button_alignCenter').classList.remove('active');
  } else {
    document
      .getElementById('iframeTextEdit')
      .contentWindow.document.execCommand('JustifyRight', false, null);
    document.getElementById('button_alignRight').classList.add('active');
    document.getElementById('button_alignLeft').classList.remove('active');
    document.getElementById('button_alignCenter').classList.remove('active');
  }
  iframeBody.focus();
  showCodeSource();
}

function textLeft() {
  if (isSelectionAlign('left')) {
    // Get the current node
    let currentNode = iframe.contentWindow.getSelection().focusNode;
    // while the node is note the body contenteditable
    while (currentNode.id != 'bodyEditor') {
      if (currentNode.style?.textAlign) {
        currentNode.style.removeProperty('text-align');
        break;
      }
      currentNode = currentNode.parentNode;
    }
    document.getElementById('button_alignRight').classList.remove('active');
    document.getElementById('button_alignLeft').classList.remove('active');
    document.getElementById('button_alignCenter').classList.remove('active');
  } else if (isSelectionAlign('center') || isSelectionAlign('right')) {
    document
      .getElementById('iframeTextEdit')
      .contentWindow.document.execCommand('JustifyLeft', false, null);
    document.getElementById('button_alignRight').classList.remove('active');
    document.getElementById('button_alignLeft').classList.add('active');
    document.getElementById('button_alignCenter').classList.remove('active');
  }
  iframeBody.focus();
  showCodeSource();
}

function textCenter() {
  if (isSelectionAlign('center')) {
    // Get the current node
    let currentNode = iframe.contentWindow.getSelection().focusNode;
    // while the node is note the body contenteditable
    while (currentNode.id != 'bodyEditor') {
      if (currentNode.style?.textAlign) {
        currentNode.style.removeProperty('text-align');
        break;
      }
      currentNode = currentNode.parentNode;
    }
    document.getElementById('button_alignRight').classList.remove('active');
    document.getElementById('button_alignLeft').classList.remove('active');
    document.getElementById('button_alignCenter').classList.remove('active');
  } else {
    document
      .getElementById('iframeTextEdit')
      .contentWindow.document.execCommand('JustifyCenter', false, null);
    document.getElementById('button_alignRight').classList.remove('active');
    document.getElementById('button_alignLeft').classList.remove('active');
    document.getElementById('button_alignCenter').classList.add('active');
  }
  iframeBody.focus();
  showCodeSource();
}
// color button
function buttoncolorText() {
  document.getElementById('txtColorBtn').style.color =
    document.getElementById('txtColorSelector').value;
}
// copy button
function copyCodeSource() {
  document.getElementById('sourceCodeHTML').select();
  document.execCommand('copy');
  document.getSelection().empty();
}
// export Pdf
window.jsPDF = window.jspdf.jsPDF;
function exportPdfFile() {
  var doc = new jsPDF();
  // Source HTMLElement or a string containing HTML.
  var elementHTML = iframeBody;
  // doc file name
  let fileName = prompt('File name:');
  if (fileName != null && fileName != '') {
    doc.html(elementHTML, {
      callback: function (doc) {
        // Save the PDF
        doc.save(`${fileName}.pdf`);
      },
      margin: [10, 10, 10, 10],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 190, //target width in the PDF document
      windowWidth: 675, //window width in CSS pixels
    });
  } else {
    return;
  }
}
