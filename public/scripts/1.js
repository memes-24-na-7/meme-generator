/*#region Обработка нажатия кнопок*/
let imageType = '';
var generatePressed = function () {
    imageType = 'image/jpeg';
    launchEditor('../public/images/Doggies.jpg');
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
let launchEditor = function (imgSrc) {
    let img = new Image();
    img.src = imgSrc;
    document.getElementById('mem_image').src = imgSrc;
    img.onload = adaptImgSize;

    document.querySelectorAll('.second_state').forEach(function (elem) {
        elem.style.display = 'block';
    });
    document.querySelectorAll('.first_state').forEach(function (elem) {
        elem.style.display = 'none';
    });
}
let backPressed = function () {
    document.querySelectorAll('.second_state').forEach(function (elem) {
        elem.style.display = 'none';
    });
    document.querySelectorAll('.first_state').forEach(function (elem) {
        elem.style.display = 'block';
    });
}
/*#endregion*/

/*#region Для передвижения и изменения размера контейнера текста*/
var x, y, target = null;

document.addEventListener('mousedown', function(e) {
    fitTextBoxSize();
    for (var i = 0; e.path[i] !== document.body; i++) {
        if (e.path[i].classList.contains('draggable')) {
            target = e.path[i];
            if (target.style.left === '' || target.style.top === '') {
                target.style.left = 0 + 'px'; // место клика на экране
                target.style.top = -360 + 'px';
            }
            target.classList.add('dragging');
            x = e.clientX - target.style.left.slice(0, -2); // место клика на экране
            y = e.clientY - target.style.top.slice(0, -2);
            return;
        }
    }
});

var fitTextBoxSize = function () {
    var text_div = document.getElementById('draggable');
    var text_image = document.getElementById('text_image');
    var new_w = Math.round(text_image.getBoundingClientRect().width) + 'px';
    var new_h = Math.round(text_image.getBoundingClientRect().height) + 'px';
    text_div.style.width = new_w;
    text_div.style.height = new_h;
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
    if (tgtRect.left < pRect.left) target.style.left = 0;
    if (tgtRect.top < pRect.top) target.style.top = -360+'px';
    if (tgtRect.right > pRect.right) target.style.left = pRect.width - tgtRect.width + 'px';
    if (tgtRect.bottom > pRect.bottom) target.style.top = pRect.height - tgtRect.height -360 + 'px';
});
/*#endregion*/

