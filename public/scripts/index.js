const memImage = document.getElementById('mem-image');
const generateBtn = document.getElementById('generate-btn');
const memeContainer = document.getElementById('meme-container');
const divForImages = document.getElementById("div-for-images");
const textGeneratorForm = document.getElementById('text-generator-form');
const galleryCounter = document.getElementById('counter');
const nextBtn = document.getElementById("next-b");
const textInput = document.getElementById("text-input");
const fontSelect = document.getElementById("font-select");
const sizeInput = document.getElementById("size-input");
const textColor = document.getElementById("text-color");
const modal = document.getElementById('myModal');
const textList = document.getElementById('text-list');

/*#region Обработка нажатия кнопок*/

let randomPressed = function () {
  fetch("https://api.imgflip.com/get_memes")
    .then(res => res.json())
    .then(result => {
      let randNumber = getRandomInt(100);
      launchWithImageUrl(result.data.memes[randNumber].url);
    })
    .catch(err => console.log(err));
};

let changeState = function () {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  generateBtn.style.display = 'none';
  document.querySelectorAll('.second-state').forEach(function (elem) {
    elem.style.visibility = 'hidden';
  });
  document.querySelectorAll('.first-state').forEach(function (elem) {
    elem.style.visibility = 'visible';
  });
}

let cleanForm = function () {
  document.querySelectorAll('.draggable').forEach(function (elem) {
    elem.remove();
  });
  document.querySelectorAll('#text-list li').forEach(function (elem) {
    elem.remove();
  });
  textInput.value = '';
  fontSelect.value = 'Tahoma';
  sizeInput.value = 100;
}

let backPressed = function () {
  changeState();
  cleanForm();
};

let downloadImgToGallery = function() {
  fetch("https://api.imgflip.com/get_memes")
    .then(res => res.json())
    .then(result => {
      let counter = parseFloat(galleryCounter.textContent);
      for(let i = counter * 10; i < counter * 10 + 10; i++) {
        addImg(result.data.memes[i].url, 'launchWithImageUrl');
      }
      galleryCounter.textContent = (counter + 1).toString();
      if (counter === 9) {
        nextBtn.style.visibility = "hidden";
      }
    })
    .catch(err => console.log(err));
};

const tabIndex = 4;
let addImg = function(src, onclickFunctionName) {
  let newImageDiv = document.createElement('div');
  newImageDiv.className = "image";
  let img = document.createElement('img');
  img.tabIndex = tabIndex;
  img.src = src;
  img.setAttribute('onclick', `chooseImage(this, ${onclickFunctionName})`);
  img.onkeydown = ev => {
    if (ev.code === "Enter") {
      chooseImageByEnter(img);
    }
  }
  newImageDiv.appendChild(img);
  document.getElementsByClassName('modal-body')[0].appendChild(newImageDiv);
};

let chooseImageByEnter = function (imgs) {
  modal.style.display = "none";
  loadSrcToEdit(imgs.src);
};

let launchWithImageUrl = function(url) {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL("image/png");
    loadSrcToEdit(dataURL);
  };
  img.src = url;
};

let getRandomInt = function (max) {
  return Math.floor(Math.random() * max);
};

let isInputAllowable = function (file) {
  if (!file) {
    return false;
  }
  let type = file.type.split('/')[0];
  if (type !== 'image') {
    alert(`Please, upload an image file, ${type} is not an image.`);
    return false;
  }
  return true;
}

let uploadMeme = function (file) {
  if (!isInputAllowable(file)) {
    return;
  }
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
  document.querySelectorAll('.editor-block').forEach(function (elem) {
    elem.style.width = width;
  });
  divForImages.style.height = height;
};

let launchEditorPage = function () {
  generateBtn.style.display = 'block';
  document.querySelectorAll('.first-state').forEach(function (elem) {
    elem.style.visibility = 'hidden';
  });
  document.querySelectorAll('.second-state').forEach(function (elem) {
    elem.style.visibility = 'visible';
  });
};

let adaptImgSize = function() {
  let memeWidth = this.width;
  let memeHeight = this.height;
  let minWidth = 300;
  let minHeight = 75;
  let maxWidth = window.screen.width * 0.9;
  let maxHeight = window.screen.height * 0.65;

  if (memeWidth < minWidth) {
    memeHeight = minWidth * memeHeight / memeWidth;
    if (memeHeight > maxHeight) {
      alert("Your image is too narrow, crop it or choose another one.");
      return;
    }
    memeWidth = minWidth;
  }

  if (memeHeight < minHeight) {
    memeWidth = minHeight * memeWidth / memeHeight;
    if (memeWidth > maxWidth) {
      alert("Your image is too wide, crop it or choose another one.");
      return;
    }
    memeHeight = minHeight;
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

let loadSrcToEdit = function (imgSrc) {
  let img = new Image();
  img.src = imgSrc;
  memImage.src = imgSrc;
  img.onload = adaptImgSize;
};
/*#endregion*/

/*#region Для передвижения и изменения размера контейнера текста*/
let x, y, target = null;

document.addEventListener('mousedown', function(e) {
  let divForImagesHeight = divForImages.getBoundingClientRect().height;
  for (let i = 0; e.path[i] !== document.body; i++) {
    if (e.path[i].classList.contains('draggable')) {
      target = e.path[i];
      if (target.style.left === '' || target.style.top === '') {
        target.style.left = 0 + 'px'; // место клика на экране
        target.style.top = -divForImagesHeight + 'px';
      }
      target.classList.add('dragging');
      x = e.clientX - target.style.left.slice(0, -2); // место клика на экране
      y = e.clientY - target.style.top.slice(0, -2);
      return;
    }
  }
});

document.addEventListener('mouseup', function() {
  if (target !== null) {
    target.classList.remove('dragging');
  }
  target = null;
});

document.addEventListener('mousemove', function(e) {
  if (target === null) return;
  target.style.left = e.clientX - x + 'px';
  target.style.top = e.clientY - y + 'px';
  let pRect = target.parentElement.getBoundingClientRect();
  let tgtRect = target.getBoundingClientRect();
  let divForImagesHeight = divForImages.getBoundingClientRect().height;
  if (tgtRect.left < pRect.left) {
    target.style.left = 0;
  }
  if (tgtRect.top < pRect.top) {
    target.style.top = -divForImagesHeight + 5 + 'px';
  }
  if (tgtRect.right > pRect.right) {
    target.style.left = pRect.width - tgtRect.width + 'px';
  }
  if (tgtRect.bottom > pRect.bottom) {
    target.style.top = pRect.height - tgtRect.height - divForImagesHeight + 6 + 'px';
  }
});
/*#endregion*/

/*#region modal*/

let openModalWindow = function() {
  modal.style.display = "block";
  let counter = parseFloat(galleryCounter.textContent);
  if (counter === 0) {
    downloadImgToGallery();
  }
};

let closeModalWindow = function() {
  modal.style.display = "none";
};

/*#endregion*/

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
  availableFonts.forEach((font) => window.document.fonts.load(`16px ${font}`));
}

generateBtn.addEventListener("click", async () => {
  generateBtn.setAttribute("disabled", "true");
  await generateImage();
  generateBtn.removeAttribute("disabled");
});

const dpr = window.devicePixelRatio || 1;

let textCounter = 0n;

async function generateImage() {
  const text = textInput.value;
  const font = fontSelect.selectedOptions[0].textContent;
  const size = sizeInput.value;
  const color = textColor.value;
  if (!text) {
    return;
  }
  const imageBlob = await textToBitmap(text, font, size, color);
  const imageUrl = URL.createObjectURL(imageBlob);
  const drag = document.createElement('div');
  drag.style.zIndex = textCounter.toString();
  textCounter++;

  drag.classList.add('draggable');
  drag.style.top = '-' + String(memImage.offsetHeight) - 5 + "px";
  drag.style.left = '0px';
  memeContainer.appendChild(drag);
  const dragger = document.createElement('div');
  drag.appendChild(dragger);
  dragger.classList.add('dragger');
  const img = document.createElement('img');
  dragger.appendChild(img);
  img.classList.add('text-img');
  img.src = imageUrl;

  const item = document.createElement('li');
  textList.appendChild(item);
  item.textContent = `${text} ${font} ${size}px ${color}`;
  const del = document.createElement('button');
  del.type = 'button';
  item.appendChild(del);
  del.textContent = 'X';
  del.style.right = '0';
  del.classList.add('form-btn');
  del.classList.add('cross-btn');
  del.addEventListener('click', (evt) => {
    drag.remove();
    item.remove();
  });
}

function textToBitmap(text, font, size, color) {
  const canvas = window.document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `${size * dpr}px "${font}"`;
  const {
    actualBoundingBoxLeft,
    actualBoundingBoxRight,
    fontBoundingBoxAscent,
    fontBoundingBoxDescent,
    actualBoundingBoxAscent,
    actualBoundingBoxDescent,
    width
  } = ctx.measureText(text);
  canvas.height = Math.max(
    Math.abs(actualBoundingBoxAscent) + Math.abs(actualBoundingBoxDescent),
    ((fontBoundingBoxAscent) || 0) + ((fontBoundingBoxDescent) || 0));

  canvas.width = Math.max(width, Math.abs(actualBoundingBoxLeft) + actualBoundingBoxRight);

  let dfi = divForImages.getBoundingClientRect();
  if (dfi.width < canvas.width) {
    let dsk = dfi.width / canvas.width;
    size *= dsk;
    canvas.height *= dsk;
    canvas.width *= dsk;
  }
  if (dfi.height < canvas.height) {
    let dsk = dfi.height / canvas.height;
    size *= dsk;
    canvas.height *= dsk;
    canvas.width *= dsk;
  }

  ctx.font = `${size * dpr}px "${font}"`;
  ctx.textBaseline = "top";
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  return new Promise((resolve) => {
    canvas.toBlob(resolve);
  });
}

/*#region buttons and cursor moving effects */
let scrollY = window.scrollY;

window.addEventListener('scroll', function(e) {
  scrollY = window.scrollY;
});

document.querySelectorAll('.page-button').forEach(el => {
  el.addEventListener('mousemove', function(e) {
    const pos = this.getBoundingClientRect();
    const mx = e.pageX - pos.left - pos.width/2;
    const my = e.pageY - scrollY - pos.top - pos.height/2;
    this.style.transform = 'translate('+ mx * 0.15 +'px, '+ my * 0.3 +'px)';
  });
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
