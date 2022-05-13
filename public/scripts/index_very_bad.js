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
    const imageWrapper = document.getElementById("image-wrapper");
    if (!text) {
        return;
    }
    const imageBlob = await textToBitmap(text, font);
    const imageUrl = URL.createObjectURL(imageBlob);
    // const image = new Image();
    const image = document.getElementById('text_image');
    image.src = imageUrl;
    requestAnimationFrame(() => {
        const currentHeight = image.getBoundingClientRect().height;
        image.style.height = `${currentHeight}px`;
    }, 0);
}

function textToBitmap(text, font) {
    const FONT_SIZE = 100;
    const VERTICAL_EXTRA_SPACE = 1;
    const HORIZONTAL_EXTRA_SPACE = 1;
    const canvas = window.document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${FONT_SIZE * dpr}px "${font}"`;
    const {
        actualBoundingBoxLeft,
        actualBoundingBoxRight,
        fontBoundingBoxAscent,
        fontBoundingBoxDescent,
        actualBoundingBoxAscent,
        actualBoundingBoxDescent,
        width
    } = ctx.measureText(text);
    console.log(ctx.measureText(text));
    canvas.height = Math.max(
        Math.abs(actualBoundingBoxAscent) + Math.abs(actualBoundingBoxDescent),
        (Math.abs(fontBoundingBoxAscent) || 0) + (Math.abs(fontBoundingBoxDescent) || 0)
    ) * VERTICAL_EXTRA_SPACE;

    canvas.width = Math.max(width, Math.abs(actualBoundingBoxLeft) + actualBoundingBoxRight) *
        HORIZONTAL_EXTRA_SPACE;

    ctx.font = `${FONT_SIZE * dpr}px "${font}"`;
    ctx.textBaseline = "top";
    ctx.fillText(text, 0, 0);
    return new Promise((resolve) => {
        canvas.toBlob(resolve);
    });
}

