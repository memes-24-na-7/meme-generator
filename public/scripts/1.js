// import {writeOnImage} from "./editingImages";
// import html2canvas from './html2canvas.js';


var generate_pressed = function () {
    document.getElementById('download_b').style.display = 'block';
    document.getElementById('back_b').style.display = 'block';
    document.getElementById('generate_b').style.display = 'none';
    document.getElementById('mem_image').style.display = 'block';
    draw_image();

    var text = document.getElementById('dragable_text');
    text.style.display = 'block';
    text.onmousedown = function(event) {
        let shiftX = event.clientX - text.getBoundingClientRect().left;
        let shiftY = event.clientY - text.getBoundingClientRect().top;
        text.style.position = 'absolute';
        text.style.zIndex = 1000;
        document.body.append(text);
        moveAt(event.pageX, event.pageY);
        function moveAt(pageX, pageY) {
            text.style.left = pageX - shiftX + 'px';
            text.style.top = pageY - shiftY + 'px';
        }
        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }
        document.addEventListener('mousemove', onMouseMove);
        text.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            text.onmouseup = null;
        };
    };
    text.ondragstart = function() {
        return false;
    };
}
var draw_image = function () {
    kartinochka = document.getElementById('mem_image');
    kartinochka.src = '../public/images/Doggies.jpg';
    document.body.appendChild(kartinochka);
}
// var download_pressed = function () {
//     kartinochka = document.getElementById('mem_image');
//
//     let canvas = document.getElementById('meme');
//     let link = document.createElement("a");
//     link.setAttribute("href", kartinochka.src);
//     link.setAttribute("download", `${Date.now()}`);
//     link.click();
// }
var back_pressed = function () {
    document.getElementById('download_b').style.display = 'none';
    document.getElementById('back_b').style.display = 'none';
    document.getElementById('generate_b').style.display = 'block';
    document.getElementById('mem_image').style.display = 'none';
    document.getElementById('dragable_text').style.display = 'none';
}
var connectParts = function () {
    let meme = document.createElement('div');
    meme.style.display = 'inline-block';
    meme.style.position = 'relative';

    let originalMemePic = document.getElementById('mem_image');
    let memePic = document.createElement('img');
    memePic.src = originalMemePic.src;
    meme.appendChild(memePic);

    let originalTextPic = document.getElementById('dragable_text');
    let textPic = document.createElement('img');
    textPic.src = originalTextPic.getAttribute('src');
    textPic.style.position = 'absolute';
    let memeMargin = (document.body.clientWidth - originalMemePic.clientWidth) / 2;
    textPic.style.top = String(originalTextPic.offsetTop - 100) + 'px';
    textPic.style.left = String(originalTextPic.offsetLeft - memeMargin) + 'px';
    textPic.style.zIndex = 1;

    meme.appendChild(textPic);
    return meme;
}