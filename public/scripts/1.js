// import {writeOnImage} from "./editingImages";
// import html2canvas from './html2canvas.js';

/*#region Обработка нажатия кнопок*/
var generate_pressed = function () {
    document.getElementById('generate_b').style.display = 'none';
    document.getElementById('upload_b').style.display = 'none';
    document.getElementById('div_for_images').style.display = 'block';
    document.getElementById('div_for_text_editing').style.display = 'block';
    document.getElementById('download_b').style.display = 'block';
    document.getElementById('back_b').style.display = 'block';
    draggable = document.getElementById('draggable');
    draggable.style.top = '-360px';
    draggable.style.left = '0px';
    //TODO: сделать чтоб обновлялось начальное положение текста
}

var upload_pressed = function () { }

var back_pressed = function () {
    document.getElementById('div_for_images').style.display = 'none';
    document.getElementById('div_for_text_editing').style.display = 'none';
    document.getElementById('download_b').style.display = 'none';
    document.getElementById('back_b').style.display = 'none';
    document.getElementById('generate_b').style.display = 'block';
    document.getElementById('upload_b').style.display = 'block';
}
/*#endregion*/

// var draw_image = function () {
//     kartinochka = document.getElementById('mem_image');
//     kartinochka.src = '../public/images/Doggies_reserve.jpg';
//     document.body.appendChild(kartinochka);
// }

var connectParts = function () {
    let meme = document.createElement('div');
    meme.style.display = 'inline-block';
    meme.style.position = 'relative';

    let originalMemePic = document.getElementById('mem_image');
    let memePic = document.createElement('img');
    memePic.src = originalMemePic.src;
    memePic.style.top = '0';
    memePic.style.left = '0';
    memePic.style.zIndex = '0';
    meme.appendChild(memePic);

    let textPic = document.createElement('img');
    let originalTextPic = document.getElementById('dragable_text');
    textPic.src = originalTextPic.getAttribute('src');
    textPic.style.position = 'absolute';
    console.log(originalTextPic.style.top);

    textPic.style.top = '0';
    textPic.style.left = '0';
    textPic.style.zIndex = 1;
    meme.appendChild(textPic);
    return meme;
}


/*#region Для передвижения и изменения размера контейнера текста*/
var x, y, target = null;

document.addEventListener('mousedown', function(e) {
    fit_text_box_size();
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

var fit_text_box_size = function () {
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

