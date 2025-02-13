document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert("WebGL não é suportado no seu navegador!");
        return;
    }

    // Configuração inicial do WebGL
    canvas.width = 400;
    canvas.height = 400;
    
    // Vértices iniciais (top-left, top-right, bottom-right, bottom-left)
    let vertices = [
        { x: 50, y: 50 },  
        { x: 350, y: 50 }, 
        { x: 350, y: 350 },
        { x: 50, y: 350 }  
    ];

    let draggingIndex = null;
    let image = new Image();
    image.src = "https://via.placeholder.com/300"; // Imagem temporária

    image.onload = function () {
        draw();
    };

    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Criando textura
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Criando buffer de vértices
        let vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        let vertexArray = new Float32Array([
            vertices[0].x / canvas.width, vertices[0].y / canvas.height,
            vertices[1].x / canvas.width, vertices[1].y / canvas.height,
            vertices[2].x / canvas.width, vertices[2].y / canvas.height,
            vertices[3].x / canvas.width, vertices[3].y / canvas.height
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

        // Renderização básica (não inclui shaders avançados ainda)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }

    // Eventos de mouse para mover os vértices
    canvas.addEventListener("mousedown", function (event) {
        const { offsetX, offsetY } = event;
        vertices.forEach((v, index) => {
            if (Math.hypot(v.x - offsetX, v.y - offsetY) < 10) {
                draggingIndex = index;
            }
        });
    });

    canvas.addEventListener("mousemove", function (event) {
        if (draggingIndex !== null) {
            vertices[draggingIndex].x = event.offsetX;
            vertices[draggingIndex].y = event.offsetY;
            draw();
        }
    });

    canvas.addEventListener("mouseup", function () {
        draggingIndex = null;
    });

    draw();
});
