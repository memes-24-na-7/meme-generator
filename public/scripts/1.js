// import {writeOnImage} from "./editingImages";


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
    kartinochka.src = `/../images/Doggies.jpg`;
    document.body.appendChild(kartinochka);
}
var download_pressed = function () {
    kartinochka = document.getElementById('mem_image');
    let link = document.createElement("a");
    link.setAttribute("href", kartinochka.src);
    link.setAttribute("download", `${Date.now()}`);
    link.click();
}
var back_pressed = function () {
    document.getElementById('download_b').style.display = 'none';
    document.getElementById('back_b').style.display = 'none';
    document.getElementById('generate_b').style.display = 'block';
    document.getElementById('mem_image').style.display = 'none';
    document.getElementById('dragable_text').style.display = 'none';
}