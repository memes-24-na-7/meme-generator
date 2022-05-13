/*#region Обработка нажатия кнопок*/
var generatePressed = function () {
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
    let reader = new FileReader();
    reader.onloadend = () => launchEditor(reader.result);
    reader.readAsDataURL(file);
}
var launchEditor = function (imgSrc) {
    document.getElementById('generate_b').style.display = 'none';
    document.getElementById('upload_b').style.display = 'none';
    document.getElementById('div_for_images').style.display = 'block';
    document.getElementById('mem_image').style.display = 'block';
    document.getElementById('mem_image').src = imgSrc;
    document.getElementById('app').style.display = 'block';
    document.getElementById('download_b').style.display = 'block';
    document.getElementById('back_b').style.display = 'block';
    draggable = document.getElementById('draggable');
    draggable.style.top = '-360px';
    draggable.style.left = '0px';
    console.log(document.getElementById('text_image'))
}

var backPressed = function () {
    document.getElementById('div_for_images').style.display = 'none';
    document.getElementById('div_for_text_editing').style.display = 'none';
    document.getElementById('download_b').style.display = 'none';
    document.getElementById('back_b').style.display = 'none';
    document.getElementById('app').style.display = 'none';
    document.getElementById('generate_b').style.display = 'block';
    document.getElementById('upload_b').style.display = 'block';
}
/*#endregion*/

var connectParts = function () {
    let meme = document.createElement('div');
    meme.style.position = 'absolute';

    let originalMemePic = document.getElementById('mem_image');
    let memePic = document.createElement('img');
    memePic.src = originalMemePic.src;
    meme.appendChild(memePic);
    memePic.width = originalMemePic.width;
    memePic.height = originalMemePic.height;

    let originalTextPic = document.getElementById('text_image');
    let textPic = document.createElement('img');
    textPic.src = originalTextPic.getAttribute('src');
    textPic.style.position = 'absolute';
    let memeMargin = (document.body.clientWidth - originalMemePic.clientWidth) / 2;
    textPic.style.top = String(originalTextPic.offsetTop - 100) + 'px';
    textPic.style.left = String(originalTextPic.offsetLeft - memeMargin) + 'px';

    meme.appendChild(textPic);
    return meme;
}


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

