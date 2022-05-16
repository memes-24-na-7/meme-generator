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
    const image = document.getElementById('text_image');
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

    let dfi = document.getElementById("div_for_images").getBoundingClientRect();
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

