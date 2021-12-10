let canvas,
    ctx,
    imgs = [],
    imagesOK = 0,
    next = 2,
    last,
    fadePct = 0;


window.onload = function () {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    loadAllImages();
};

function loadAllImages() {
    for (let i = 0; i < images.length; i++) {
        let img = new Image();
        imgs.push(img);
        img.onload = function () {
            imagesOK++;
            if (imagesOK >= images.length) {
                tick();
            }
        };
        img.src = "images/" + images[i];
    }
}


/**
 * @param {Image} img
 * @param {number} opacity
 */
function draw(img, opacity) {
    ctx.globalAlpha = opacity;
    let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    ctx.fillRect(canvas.width * (1 - opacity), 0, canvas.width, canvas.height);
    ctx.drawImage(img, (canvas.width - img.width * ratio) / 2 + canvas.width * (1 - opacity), (canvas.height - img.height * ratio) / 2, img.width * ratio, img.height * ratio);
}


function animateFade() {
    if (++fadePct > 100) {
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (last !== undefined) {
        draw(imgs[last], 1);
    }
    draw(imgs[next], fadePct / 100);
    requestAnimationFrame(animateFade);
}


async function update() {
    animateFade();
    await new Promise(r => setTimeout(r, 3000));
    last = next;
    next = ++next % imgs.length;
    fadePct = 0;
}


async function tick() {
    if (!canvas.matches(":hover")) {
        await update();
    }
    requestAnimationFrame(tick);
}
