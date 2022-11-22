var miRuleta = new Winwheel({
    numSegments: 2,
    outerRadius: 170,
    segments: [
        { fillStyle: "#3949ab", text: "Preguntas" },
        { fillStyle: "#304ffe", text: "Memoria" }
        //{ fillStyle: "#3949ab", text: "Ahorcado" }
    ],
    animation: {
        type: "spinToStop",
        duration: 5,
        callbackFinished: "mensaje()",
        callbackAfter: "dibujarIndicador()"
    }
});

dibujarIndicador();

function mensaje() {
    var SegmentoSeleccionado = miRuleta.getIndicatedSegment();
    var resultado = SegmentoSeleccionado.text;
    if (resultado == 'Preguntas') {
        var con = confirm("Elemento seleccionado: " + SegmentoSeleccionado.text + ". Si quiere volver a girar la ruleta precione el boton de cancelar");
        if (con == true) { window.location.href = "http://localhost:3000/preguntas.html"; }
    }
    if (resultado == 'Memoria') {
        var con = confirm("Elemento seleccionado: " + SegmentoSeleccionado.text + ". Si quiere volver a girar la ruleta precione el boton de cancelar");
        if (con == true) { window.location.href = "http://localhost:3000/memoria.html"; }
    }
    if (resultado == 'Ahorcado') {
        var con = confirm("Elemento seleccionado: " + SegmentoSeleccionado.text + ". Si quiere volver a girar la ruleta precione el boton de cancelar");
        if (con == true) { window.location.href = "http://localhost:3000/ahorcado.html"; }
    }

    miRuleta.stopAnimation(false);
    miRuleta.rotationAngle = 0;
    miRuleta.draw();
    dibujarIndicador();
}

function dibujarIndicador() {
    var ctx = miRuleta.ctx;
    ctx.strokeStyle = "navy";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(170, 10);
    ctx.lineTo(230, 10);
    ctx.lineTo(200, 70);
    ctx.lineTo(170, 10);
    ctx.stroke();
    ctx.fill();
}