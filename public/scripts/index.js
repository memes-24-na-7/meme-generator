/*#region Обработка нажатия кнопок*/
let imageType = '';

let generatePressed = function () {
    imageType = 'image/png';
    let number = getRandomInt(7) + 1;
    launchEditor(`../public/images/${number}.png`);
};

let backPressed = function () {
    console.log(document.getElementById('mem-image'));
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    document.querySelectorAll('.second-state').forEach(function (elem) {
            elem.style.visibility = 'hidden';
        });
    document.querySelectorAll('.first-state').forEach(function (elem) {
            elem.style.visibility = 'visible';
        });
};

let getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
};

let uploadMeme = function (file) {
    if (!file) {
        return;
    }
    let type = file.type.split('/')[0];
    if (type !== 'image') {
        alert(`Please, upload an image file, ${type} is not an image.`);
        return;
    }

    imageType = file.type;
    let reader = new FileReader();
    reader.onloadend = () => launchEditor(reader.result);
    reader.readAsDataURL(file);
};

let getImageType = function () {
    return imageType;
};

let chooseImage = function (imgs) {
    let modal = document.getElementById('myModal');
    modal.style.display = "none";
    imageType = 'image/png';
    launchEditor(imgs.src);
};

let resizeEditorWindows = function (width, height) {
    let memeImage = document.getElementById('mem-image');
    memeImage.style.width = width;
    memeImage.style.height = height;
    document.getElementById('text-generator-form').style.width = width;
    document.querySelectorAll('.editor-block').forEach(function (elem) {
        elem.style.width = width;
        // TODO: При "широком" положении не надо менять размер текстового дива, он должен быть постоянным
    });
    document.getElementById('div-for-images').style.height = height;
    let draggable = document.getElementById('draggable');
    draggable.style.top = '-' + height;
    draggable.style.left = '0px';
};

let adaptImgSize = function() {
    console.log(this.width, this.height);
    let memeWidth = this.width;
    let memeHeight = this.height;
    let maxWidth = window.screen.width * 0.9;
    console.log(maxWidth);
    if (memeWidth > maxWidth) {
        memeHeight = maxWidth * memeHeight / memeWidth;
        memeWidth = maxWidth;
    }
    let maxHeight = window.screen.height * 0.65;
    console.log(maxHeight);
    if (memeHeight > maxHeight) {
        memeWidth = maxHeight * memeWidth / memeHeight;
        memeHeight = maxHeight;
    }
    console.log(memeWidth, memeHeight);
    resizeEditorWindows(String(memeWidth) + 'px', String(memeHeight) + 'px');
};

let checkImgSize = function (img) {
    const size = 1920;
    return !(img.width > size || img.height > size);
};

let launchEditor = function (imgSrc) {
    let img = new Image();
    img.src = imgSrc;
    if (checkImgSize(img)) {
        document.getElementById('mem-image').src = imgSrc;
        img.onload = adaptImgSize;
        document.querySelectorAll('.first-state').forEach(function (elem) {
            elem.style.visibility = 'hidden';
        });
        document.querySelectorAll('.second-state').forEach(function (elem) {
            elem.style.visibility = 'visible';
        });
    }
};
/*#endregion*/

/*#region Для передвижения и изменения размера контейнера текста*/
let x, y, target = null;

document.addEventListener('mousedown', function(e) {
    fitTextBoxSize();
    let divForImagesHeight = document.getElementById('div-for-images').getBoundingClientRect().height;
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

let fitTextBoxSize = function () {
    let textDiv = document.getElementById('draggable');
    let textImage = document.getElementById('text-image');
    let newW = Math.round(textImage.getBoundingClientRect().width) + 'px';
    let newH = Math.round(textImage.getBoundingClientRect().height) + 'px';
    textDiv.style.width = newW;
    textDiv.style.height = newH;
}

let counter = 0;

document.addEventListener('mouseup', function() {
    if (target !== null) {
        target.classList.remove('dragging');
    }
    target = null;
    counter += 1;
});
document.addEventListener('mousemove', function(e) {
    if (target === null) return;
    target.style.left = e.clientX - x + 'px';
    target.style.top = e.clientY - y + 'px';
    let pRect = target.parentElement.getBoundingClientRect();
    let tgtRect = target.getBoundingClientRect();
    let divForImagesHeight = document.getElementById('div-for-images').getBoundingClientRect().height;
    if (tgtRect.left < pRect.left) {
        target.style.left = 0;
    }
    if (tgtRect.top < pRect.top) {
        target.style.top = -Math.round(divForImagesHeight) + 'px';
    }
    if (tgtRect.right > pRect.right) {
        target.style.left = pRect.width - tgtRect.width + 'px';
    }
    if (tgtRect.bottom > pRect.bottom) {
        target.style.top = pRect.height - tgtRect.height - Math.round(divForImagesHeight) + 'px';
    }
});
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

const btn = document.getElementById("generate-btn");

btn.addEventListener("click", async () => {
    btn.setAttribute("disabled", "true");
    await generateImage();
    btn.removeAttribute("disabled");
});

const dpr = window.devicePixelRatio || 1;

async function generateImage() {
    const text = document.getElementById("text-input").value;
    const font = document.getElementById("font-select").selectedOptions[0]
        .textContent;
    const size = document.getElementById("size-input").value;
    if (!text) {
        return;
    }
    const imageBlob = await textToBitmap(text, font, size);
    const imageUrl = URL.createObjectURL(imageBlob);
    const image = document.getElementById('text-image');
    image.src = imageUrl;
}

function textToBitmap(text, font, size) {
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

    let dfi = document.getElementById("div-for-images").getBoundingClientRect();
    if (dfi.width < canvas.width) {
        let dsk = dfi.width / canvas.width;
        console.log(dsk)
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
    ctx.fillText(text, 0, 0);
    return new Promise((resolve) => {
        canvas.toBlob(resolve);
    });
}
