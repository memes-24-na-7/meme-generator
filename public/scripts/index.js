/*jshint esversion: 6 */
/*jshint esversion: 8 */
const textGeneratorForm = document.getElementById('text-generator-form');
const memeContainer = document.getElementById('meme-container');
const divForImages = document.getElementById("div-for-images");
const generateBtn = document.getElementById('generate-btn');
const fontSelect = document.getElementById("font-select");
const body = document.getElementsByTagName('body')[0];
const textInput = document.getElementById("text-input");
const sizeInput = document.getElementById("size-input");
const textColor = document.getElementById("text-color");
const memImage = document.getElementById('mem-image');
const textList = document.getElementById('text-list');
const nextBtn = document.getElementById("next-b");
const modal = document.getElementById('myModal');
const align = document.getElementById('align');
const memePhrases = ["было бы славно", "время начинать план скам", "амогус",
  "ля ты крыса", "не важно, кто,\nважно, кто", "Чык-Чырык", "беды с башкой",
  "Москва, метро \"Люблино\", работаем", "вы продоете рыбов?", "Елена, алле!",
  "Directed by Robert B. Weide",
  "Слушай, а ловко ты это придумал,\nя даже в начале не понял,\nмолодец",
  "калыван", "пока на расслабоне\nна чиле", "оооо, повезло, повезло",
  "вжух! и ты сдал веб", "братишка,\nя тебе покушац принес", "олды тут?",
  "загадка от\nЖака Фреско", "гучи флип флап", "суету навести охота",
  "хочу оливье", "боже, я не хочу умирац",
  "когда милицию переименовали в полицию\nмедики заволновались",
  "но это не точно", "скажи мне три главных слова", "омагад", "я ничаянна",
  "ъеъ", "я твой брат,\nбрат, а кто не брат мне,\nтот не брат, брат",
  "малолетние дИбИлы", "я просто ниче не понимаю\nващще",
  "сущность в виде гномика", "а кому щяс лехко", "девачки, я в шоке"];

/*#region Обработка нажатия кнопок*/

let galleryCounter = 0;

const getRandomInt = max => ~~(Math.random() * max);

let randomPressed = function () {
  fetch("https://api.imgflip.com/get_memes")
      .then(res => res.json())
      .then(result => {
        let randNumForMeme = getRandomInt(100);
        let randNumForText = getRandomInt(memePhrases.length - 1);
        textInput.value = memePhrases[randNumForText];
        let resulUrl = result.data.memes[randNumForMeme].url;
        launchWithImageUrl(resulUrl, generateImage);
      })
      .catch(err => console.log(err));
};

let changeState = function () {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  generateBtn.style.display = 'none';
  document.querySelectorAll('.second-state').forEach(function (e) {
    e.style.visibility = 'hidden';
  });
  document.querySelectorAll('.first-state').forEach(function (e) {
    e.style.visibility = 'visible';
  });
};

let cleanForm = function () {
  document.querySelectorAll('.draggable').forEach(function (e) {
    e.remove();
  });
  document.querySelectorAll('#text-list li').forEach(function (e) {
    e.remove();
  });
  textInput.value = '';
  fontSelect.value = 'Tahoma';
  sizeInput.value = 100;
  align.value = 'center';
  textColor.value = '#656464';
  memImage.src = '';
};

let backPressed = function () {
  changeState();
  cleanForm();
};

let downloadImgToGallery = function() {
  fetch("https://api.imgflip.com/get_memes")
      .then(res => res.json())
      .then(result => {
        let counter = galleryCounter;
        for(let i = counter * 10; i < counter * 10 + 10; i++) {
          addImg(result.data.memes[i].url, 'launchWithImageUrl');
        }
        galleryCounter += 1;
        if (counter === 9) {
          nextBtn.style.visibility = "hidden";
        }
      })
      .catch(err => console.log(err));
};

let removeTextImage = function(textObject) {
  document.getElementById(textObject.id + '-btn').remove();
  textObject.remove();
};

document.addEventListener('keydown', function (e) {
  if (e.code in ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"]) {
    let textImg = document.getElementById(document.activeElement.id.split('-')[0]);
    let pRect = textImg.parentElement.getBoundingClientRect();
    let tgtRect = textImg.getBoundingClientRect();
    if (e.code === "ArrowUp") {
      textImg.style.top = Number(textImg.style.top.slice(0, -2)) - 10 + 'px';
      if (tgtRect.bottom <= pRect.top) removeTextImage(textImg);
    }
    else if (e.code === "ArrowDown") {
      textImg.style.top = Number(textImg.style.top.slice(0, -2)) + 10 + 'px';
      if (tgtRect.top >= pRect.bottom) removeTextImage(textImg);
    }
    else if (e.code === "ArrowRight") {
      textImg.style.left = Number(textImg.style.left.slice(0, -2)) + 10 + 'px';
      if (tgtRect.left >= pRect.right) removeTextImage(textImg);
    }
    else {
      textImg.style.left = Number(textImg.style.left.slice(0, -2)) - 10 + 'px';
      if (tgtRect.right <= pRect.left) removeTextImage(textImg);
    }
  }
});

const tabIndex = 4;
let addImg = function(src, onclickFunctionName) {
  let newImageDiv = document.createElement('div');
  newImageDiv.className = "image";
  let img = document.createElement('img');
  img.tabIndex = tabIndex;
  img.src = src;
  img.setAttribute('onclick', `chooseImage(this, ${onclickFunctionName})`);
  img.onkeydown = ev => {
    if (ev.code === "Enter")
      chooseImageByEnter(img);
  };
  newImageDiv.appendChild(img);
  document.getElementsByClassName('modal-body')[0].appendChild(newImageDiv);
};

let chooseImageByEnter = function (imgs) {
  modal.style.display = "none";
  loadSrcToEdit(imgs.src);
};

let launchWithImageUrl = function(url, callAfterLaunch=null) {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL("image/png");
    loadSrcToEdit(dataURL, callAfterLaunch);
  };
  img.src = url;
};

let isInputAllowable = function (file) {
  if (!file) return false;
  let type = file.type.split('/')[0];
  if (type !== 'image') {
    alert(`Please, upload an image file, ${type} is not an image.`);
    return false;
  }
  return true;
};

let uploadMeme = function (file) {
  if (!isInputAllowable(file)) return;
  let reader = new FileReader();
  reader.onloadend = async () => {
    let imageData = reader.result;
    addImg(imageData, loadSrcToEdit);
    loadSrcToEdit(imageData);
  };
  reader.readAsDataURL(file);
};

let chooseImage = function (imgs, launchFunction) {
  modal.style.display = "none";
  launchFunction(imgs.src);
};

let resizeEditorWindows = function (width, height) {
  memImage.style.width = width;
  memImage.style.height = height;
  memeContainer.style.height = height;
  textGeneratorForm.style.width = width;
  document.querySelectorAll('.editor-block').forEach(function (e) {
    e.style.width = width;
  });
  divForImages.style.height = height;
};

let launchEditorPage = function () {
  generateBtn.style.display = 'block';
  document.querySelectorAll('.first-state').forEach(function (e) {
    e.style.visibility = 'hidden';
  });
  document.querySelectorAll('.second-state').forEach(function (e) {
    e.style.visibility = 'visible';
  });
};

let createWidthsHeights = function (img) {
  let memeWidth = img.width, memeHeight = img.height;
  let minWidth = window.innerWidth * 0.3, minHeight = 75;
  let maxWidth = window.innerWidth * 0.9, maxHeight = window.innerHeight * 0.9;
  if(window.innerHeight > window.innerWidth){
    minWidth = window.innerWidth * 0.8;
    maxHeight = window.innerHeight * 2;
  }
  return [memeWidth, memeHeight, minWidth, minHeight, maxWidth, maxHeight];
};

let adaptImgSize = function(img) {
  let [memeWidth, memeHeight, minWidth, minHeight, maxWidth, maxHeight] = createWidthsHeights(img);
  if (memeWidth < minWidth) {
    let newMemeHeight = minWidth * memeHeight / memeWidth;
    if (newMemeHeight <= maxHeight) {
      memeHeight = newMemeHeight;
      memeWidth = minWidth;
    }
  }
  if (memeHeight < minHeight) {
    let newMemeWidth = minHeight * memeWidth / memeHeight;
    if (newMemeWidth <= maxWidth) {
      memeWidth = newMemeWidth;
      memeHeight = minHeight;
    }
  }
  if (memeWidth > maxWidth) {
    memeHeight = maxWidth * memeHeight / memeWidth;
    memeWidth = maxWidth;
  }
  if (memeHeight > maxHeight) {
    memeWidth = maxHeight * memeWidth / memeHeight;
    memeHeight = maxHeight;
  }
  resizeEditorWindows(String(memeWidth) + 'px', String(memeHeight) + 'px');
  launchEditorPage();
};

let loadSrcToEdit = function (imgSrc, callAfterLaunch=null) {
  let img = new Image();
  img.src = imgSrc;
  memImage.src = imgSrc;
  img.onload = function() {
    adaptImgSize(this);
    if (callAfterLaunch != null) {
      callAfterLaunch();
    }
  };
};
/*#endregion*/

/*#region Для передвижения и изменения размера контейнера текста*/
let x, y, target = null;

let saveTextStart = function(e) {
  let divForImagesHeight = divForImages.getBoundingClientRect().height;
  if ('' in [target.style.left, target.style.top]) {
    target.style.left = 0 + 'px';
    target.style.top = -divForImagesHeight + 'px';
  }
  target.classList.add('dragging');
  x = e.clientX - target.style.left.slice(0, -2);
  y = e.clientY - target.style.top.slice(0, -2);
};

let moveText = function(e) {
  if (target === null) return;
  target.style.left = e.clientX - x + 'px';
  target.style.top = e.clientY - y + 'px';
};

let releaseText = function() {
  if (target === null) return;
  let pRect = target.parentElement.getBoundingClientRect();
  let tgtRect = target.getBoundingClientRect();
  if (tgtRect.bottom <= pRect.top ||
      tgtRect.top >= pRect.bottom ||
      tgtRect.right <= pRect.left ||
      tgtRect.left >= pRect.right) {
    document.getElementById(target.id + '-btn').remove();
    target.remove();
  }
  else {
    target.classList.remove('dragging');
  }
  target = null;
};

let getDraggableTarget = function(e) {
  for (let i = 0; e.path[i] !== document.body; i++) {
    if (e.path[i].classList.contains('draggable')) {
      return e.path[i];
    }
  }
  return null;
};

document.addEventListener('mousedown', function(e) {
  target = getDraggableTarget(e);
  if (target !== null)
    saveTextStart(e);
});
document.addEventListener('touchstart', function (e){
  target = getDraggableTarget(e);
  if (target !== null)
    saveTextStart(e.touches[0]);
});
document.addEventListener('mousemove', moveText);
document.addEventListener('touchmove', function(e) {
  moveText(e.changedTouches[0]);
});
document.addEventListener('mouseup', releaseText);
document.addEventListener('touchend', releaseText);
/*#endregion*/

/*#region modal*/

let openModalWindow = function() {
  modal.style.display = "block";
  if (galleryCounter === 0) {
    downloadImgToGallery();
  }
};

let closeModalWindow = function() {
  modal.style.display = "none";
};

/*#endregion*/

/*#region aaa*/

const availableFonts = [
  "Tahoma",
  "Great Vibes",
  "Georgia",
  "EB Garamond",
  "Jost",
  "Pattaya",
  "Playfair Display",
  "Roboto"
];

if (window.document.fonts && window.document.fonts.load) {
  availableFonts.forEach((font) => {
    font.replaceAll(' ', '-');
    let face = new FontFace(font, `url(/stylesheets/fonts/${font}.ttf)`);
    face.load().then(face => {
      document.fonts.add(face);
    });
  });
}

generateBtn.addEventListener("click", async () => {
  generateBtn.setAttribute("disabled", "true");
  await generateImage();
  generateBtn.removeAttribute("disabled");
});

const dpr = window.devicePixelRatio || 1;

let textCounter = 0;

let addCrossToButton = function(btn) {
  const firstLine = document.createElement('div');
  firstLine.classList.add('cross-line');
  firstLine.classList.add('first-line');
  const secondLine = document.createElement('div');
  secondLine.classList.add('cross-line');
  secondLine.classList.add('second-line');
  btn.appendChild(firstLine);
  btn.appendChild(secondLine);
};

let createAttrWithoutErrors = function () {
  const text = textInput.value,
      font = fontSelect.selectedOptions[0].textContent,
      size = sizeInput.value;
  if (size < 10 || size > 300) {
    alert("Размер текста не может быть меньше 10 и больше 300");
    return [undefined, undefined, undefined, undefined];
  }
  const color = textColor.value;
  if (!text) return [undefined, undefined, undefined, undefined];
  return [text, font, size, color];
};

let createDraggableObj = function () {
  const drag = document.createElement('div');
  drag.id = textCounter.toString();
  drag.classList.add('draggable');
  drag.style.zIndex = textCounter.toString();
  drag.style.top = '0';
  drag.style.left = '0';
  memeContainer.appendChild(drag);
  const dragger = document.createElement('div');
  drag.appendChild(dragger);
  dragger.classList.add('dragger');
  return [drag, dragger];
};

let createDelButton = function(rightContent, item, drag) {
  const del = document.createElement('button');
  addCrossToButton(del);
  del.type = 'button';
  del.tabIndex = 8;
  rightContent.appendChild(del);
  item.appendChild(rightContent);
  del.classList.add('cross-btn');
  textCounter++;
  del.addEventListener('click', () => {
    drag.remove();
    item.remove();
  });
};

async function generateImage() {
  const [text, font, size, color] = createAttrWithoutErrors();
  if (undefined in [text, font, size, color]) return;
  const [drag, dragger] = createDraggableObj();
  const img = document.createElement('img');
  dragger.appendChild(img);
  img.classList.add('text-img');
  img.src = URL.createObjectURL(await textToBitmap(text.split('\n'), font, size, color));
  const item = document.createElement('li');
  item.tabIndex = 8;
  item.id = textCounter.toString() + '-btn';
  item.className = 'text-pointer';
  textList.appendChild(item);
  const content = document.createElement('p');
  item.appendChild(content);
  content.classList.add('text-content');
  content.textContent = text;
  const rightContent = document.createElement('div');
  rightContent.style.display = 'inherit';
  const colorNum = document.createElement('p');
  colorNum.textContent = color;
  colorNum.style.margin = '0';
  colorNum.style.display = 'inline';
  rightContent.appendChild(colorNum);
  createDelButton(rightContent, item, drag);
}

function getTextLineSize(ctx, textLine, widthAddition) {
  let {
    actualBoundingBoxLeft,
    actualBoundingBoxRight,
    fontBoundingBoxAscent,
    fontBoundingBoxDescent,
    actualBoundingBoxAscent,
    actualBoundingBoxDescent,
    width
  } = ctx.measureText(textLine);

  let lineHeight = Math.max(
      Math.abs(actualBoundingBoxAscent) + Math.abs(actualBoundingBoxDescent),
      ((fontBoundingBoxAscent) || 0) + ((fontBoundingBoxDescent) || 0));
  let lineWidth = Math.max(
      width,
      Math.abs(actualBoundingBoxLeft) + Math.abs(actualBoundingBoxRight)) + widthAddition;
  return [lineWidth, lineHeight];
}

function adaptCanvasSize(canvas, size, heights, widths) {
  let dsk, memRect = memImage.getBoundingClientRect();
  if (memRect.width < canvas.width) {
    dsk = memRect.width / canvas.width;
  }
  if (memRect.height < canvas.height) {
    dsk = memRect.height / canvas.height;
  }
  if (memRect.width < canvas.width || memRect.height < canvas.height) {
    size *= dsk;
    canvas.height *= dsk;
    canvas.width *= dsk;
    for (let i = 0; i < heights.length; i++) {
      heights[i] *= dsk;
      widths[i] *= dsk;
    }
  }
  return size;
}

function setCanvasSize(canvas, font, size, texts) {
  let ctx = canvas.getContext("2d");
  ctx.font = `${size * dpr}px "${font}"`;
  let heights = [];
  let widths = [];
  let maxWidth = 0, totalHeight = 0, widthAddition = 0;
  if (font === 'Pattaya') {
    widthAddition = size / 2;
  } else if (font === 'Great Vibes') {
    widthAddition = getTextLineSize(ctx, 'jP')[1];
  }
  for (let textLine of texts) {
    let [lineWidth, lineHeight] = getTextLineSize(ctx, textLine, widthAddition);
    heights.push(lineHeight);
    widths.push(lineWidth);
    maxWidth = Math.max(maxWidth, lineWidth);
    totalHeight += lineHeight;
  }
  canvas.height = totalHeight;
  canvas.width = maxWidth;
  size = adaptCanvasSize(canvas, size, heights, widths);
  return [widths, heights, size];
}

const getX = (textAlign, lineWidth, canvasWidth, xPadding) =>
    textAlign === 'left' ? xPadding : (textAlign === 'center' ?
        (canvasWidth - lineWidth) / 2 + xPadding : canvasWidth - lineWidth + xPadding);

function textToBitmap(texts, font, size, color) {
  const canvas = window.document.createElement("canvas");
  let [lineWidths, lineHeights, newSize] = setCanvasSize(canvas, font, size, texts);
  const ctx = canvas.getContext("2d");
  ctx.font = `${newSize * dpr}px "${font}"`;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  let textAlign = align.selectedOptions[0].textContent, y = 0, xPadding = 0;
  if (font === 'Great Vibes') {
    y = lineHeights[0] / 6;
    xPadding = size / 2;
  } else if (font === 'Pattaya') {
    y = lineHeights[0] / 10;
    xPadding = size / 4;
  }
  for (let i = 0; i < texts.length; i++) {
    ctx.fillText(texts[i], getX(textAlign, lineWidths[i], canvas.width, xPadding), y);
    y += lineHeights[i];
  }
  return new Promise((resolve) => {
    canvas.toBlob(resolve);
  });
}

/*#endregion*/

/*#region buttons and cursor moving effects */
let scrollY = window.scrollY;

function backgroundMove(evt) {
  let x = evt.clientX / innerWidth;
  body.style.backgroundPositionX = `${(1 - x) * 100}%`;
}

document.addEventListener('mousemove', backgroundMove);

window.addEventListener('touchstart', function() {
  document.querySelectorAll('.cursor').forEach((cursor) => {
    cursor.remove();
  });
  document.removeEventListener('mousemove', backgroundMove);
}, { once: true });

window.addEventListener('scroll', function() {
  scrollY = window.scrollY;
});

document.querySelectorAll('.page-button').forEach(el => {
  let buttonMover = function(e) {
    const pos = this.getBoundingClientRect();
    const mx = e.pageX - pos.left - pos.width/2;
    const my = e.pageY - scrollY - pos.top - pos.height/2;
    this.style.transform = 'translate('+ mx * 0.15 +'px, '+ my * 0.3 +'px)';
  };
  el.addEventListener('mousemove', buttonMover);
  el.addEventListener('touchstart', function () {
    this.removeEventListener('mousemove', buttonMover);
  }, { once: true });
});

document.querySelectorAll('.page-button').forEach(el => el.addEventListener('mouseleave', function() {
  this.style.transform = 'translate(0px, 0px)';
}));

document.addEventListener('mousemove', function(e) {
  document.querySelectorAll('.cursor').forEach((cursor) => {
    cursor.style.left = (e.pageX - 25) + 'px';
    cursor.style.top = (e.pageY - scrollY - 25) + 'px';
  });
});
/*#endregion*/
