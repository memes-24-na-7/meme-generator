/*#region Обработка нажатия кнопок*/

let imageType = '';
let generatePressed = function () {
    imageType = 'image/png';
    let number = getRandomInt(7) + 1;
    launchEditor(`../public/images/${number}.png`);
}

var backPressed = function () {
    document.getElementById('div_for_images').style.display = 'none';
    document.getElementById('app').style.display = 'none';
    document.getElementById('download_b').style.display = 'none';
    document.getElementById('back_b').style.display = 'none';
    document.getElementById('generate_b').style.display = 'block';
    document.getElementById('upload_b').style.display = 'block';
    document.getElementById('gallery_b').style.display = 'block';
    document.querySelectorAll('.second_state').forEach(function (elem) {
            elem.style.display = 'none';
        });
    document.querySelectorAll('.first_state').forEach(function (elem) {
            elem.style.display = 'block';
        });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

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
}

let getImageType = function () {
    return imageType;
}

function myFunction(imgs) {
    let modal = document.getElementById('myModal');
    modal.style.display = "none";
    launchEditor(imgs.src);
}

let resizeEditorWindows = function (width, height) {
    let memeImage = document.getElementById('mem_image');
    memeImage.style.width = width;
    memeImage.style.height = height;
    document.getElementById('div_for_images').style.height = height;
    document.querySelectorAll('.editor-block').forEach(function (elem) {
        elem.style.width = width;
    });
    let draggable = document.getElementById('draggable');
    draggable.style.top = '-' + height;
    draggable.style.left = '0px';
}

let adaptImgSize = function() {
    let memeWidth = this.width;
    let memeHeight = this.height;
    let maxWidth = document.body.clientWidth * 0.9;
    if (memeWidth > maxWidth) {
        memeHeight = maxWidth * memeHeight / memeWidth;
        memeWidth = maxWidth;
    }
    let maxHeight = document.body.clientHeight * 0.65;
    if (memeHeight > maxHeight) {
        memeWidth = maxHeight * memeWidth / memeHeight;
        memeHeight = maxHeight;
    }
    resizeEditorWindows(String(memeWidth) + 'px', String(memeHeight) + 'px');
}

let checkImgSize = function (img) {
    const size = 1920;
    if (img.width > size || img.height > size) {
        return false;
    }
    return true;
}
let launchEditor = function (imgSrc) {
    let img = new Image();
    img.src = imgSrc;
    if (checkImgSize(img)) {
        document.getElementById('mem_image').src = imgSrc;
        img.onload = adaptImgSize;

        document.querySelectorAll('.second_state').forEach(function (elem) {
            elem.style.display = 'block';
        });
        document.querySelectorAll('.first_state').forEach(function (elem) {
            elem.style.display = 'none';
        });
        document.getElementById('gallery_b').style.display = 'none';
    }
}
/*#endregion*/

/*#region Для передвижения и изменения размера контейнера текста*/
var x, y, target = null;

document.addEventListener('mousedown', function(e) {
    fitTextBoxSize();
    var divForImagesHeight = document.getElementById('div_for_images').getBoundingClientRect().height;
    for (var i = 0; e.path[i] !== document.body; i++) {
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

var fitTextBoxSize = function () {
    var textDiv = document.getElementById('draggable');
    var textImage = document.getElementById('text_image');
    var newW = Math.round(textImage.getBoundingClientRect().width) + 'px';
    var newH = Math.round(textImage.getBoundingClientRect().height) + 'px';
    textDiv.style.width = newW;
    textDiv.style.height = newH;
}

var counter = 0;

document.addEventListener('mouseup', function() {
    if (target !== null) target.classList.remove('dragging');
    target = null;
    counter += 1;
});
document.addEventListener('mousemove', function(e) {
    if (target === null) return;
    target.style.left = e.clientX - x + 'px';
    target.style.top = e.clientY - y + 'px';
    var pRect = target.parentElement.getBoundingClientRect();
    var tgtRect = target.getBoundingClientRect();
    var divForImagesHeight = document.getElementById('div_for_images').getBoundingClientRect().height;
    if (tgtRect.left < pRect.left) target.style.left = 0;
    if (tgtRect.top < pRect.top) target.style.top = -Math.round(divForImagesHeight)+'px';
    if (tgtRect.right > pRect.right) target.style.left = pRect.width - tgtRect.width + 'px';
    if (tgtRect.bottom > pRect.bottom) target.style.top = pRect.height - tgtRect.height -Math.round(divForImagesHeight) + 'px';
});
/*#endregion*/

