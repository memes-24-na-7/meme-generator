const Jimp = require("jimp");

function writeOnImage(imageFile, resultFile, x, y, maxWidth, maxHeight, text) {
  Jimp
    .read(imageFile)
    .then(function (image) {
      loadedImage = image;
      return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    })
    .then(function (font){
      loadedImage
        .print(font, x, y, text, maxWidth, maxHeight)
        .getBuffer(Jimp.MIME_JPEG, (err, buff) => {return buff})
        .write(resultFile);
    })
    .catch(function (err) {
      console.error(err);
    });
}

module.exports = {
  writeOnImage
};
