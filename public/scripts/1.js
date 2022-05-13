let generate_pressed = function () {
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
let launchEditor = function(imageSrc) {
    document.getElementById('download_b').style.display = 'block';
    document.getElementById('back_b').style.display = 'block';
    document.getElementById('generate_b').style.display = 'none';
    document.getElementById('upload-button').style.display = 'none';
    document.getElementById('mem_image').style.display = 'block';
    draw_image(imageSrc);

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
var draw_image = function (imageSrc) {
    kartinochka = document.getElementById('mem_image');
    kartinochka.src = imageSrc;
    document.body.appendChild(kartinochka);
}
var back_pressed = function () {
    document.getElementById('download_b').style.display = 'none';
    document.getElementById('back_b').style.display = 'none';
    document.getElementById('generate_b').style.display = 'block';
    document.getElementById('mem_image').style.display = 'none';
    document.getElementById('dragable_text').style.display = 'none';
}
var connectParts = function () {
    let meme = document.createElement('div');
    meme.style.position = 'absolute';

    let originalMemePic = document.getElementById('mem_image');
    let memePic = document.createElement('img');
    memePic.src = originalMemePic.src;
    meme.appendChild(memePic);
    memePic.width = originalMemePic.width;
    memePic.height = originalMemePic.height;

    let originalTextPic = document.getElementById('dragable_text');
    let textPic = document.createElement('img');
    textPic.src = originalTextPic.getAttribute('src');
    textPic.style.position = 'absolute';
    let memeMargin = (document.body.clientWidth - originalMemePic.clientWidth) / 2;
    textPic.style.top = String(originalTextPic.offsetTop - 100) + 'px';
    textPic.style.left = String(originalTextPic.offsetLeft - memeMargin) + 'px';

    meme.appendChild(textPic);
    return meme;
}