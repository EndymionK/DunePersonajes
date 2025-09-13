const personajes = [
    {
        nombre: "Paul Atreides",
        planeta: "Caladan / Arrakis",
        afiliacion: "Casa Atreides",
        descripcion: "El joven duque, heredero de la Casa Atreides, destinado a convertirse en el Kwisatz Haderach. Protagonista de la saga.",
        imagen: "assets/img/paul.jpg"
    },
    {
        nombre: "Barón Vladimir Harkonnen",
        planeta: "Giedi Prime",
        afiliacion: "Casa Harkonnen",
        descripcion: "El cruel y manipulador líder de la Casa Harkonnen, enemigo jurado de los Atreides.",
        imagen: "assets/img/harkonnen.jpg"
    },
    {
        nombre: "Lady Jessica",
        planeta: "Caladan / Arrakis",
        afiliacion: "Bene Gesserit, Casa Atreides",
        descripcion: "Madre de Paul, concubina del duque Leto, miembro de la hermandad Bene Gesserit.",
        imagen: "assets/img/jessica.jpg"
    },
    {
        nombre: "Duncan Idaho",
        planeta: "Caladan / Arrakis",
        afiliacion: "Casa Atreides",
        descripcion: "Maestro de armas leal a los Atreides, famoso por su destreza y valentía.",
        imagen: "assets/img/duncan.jpg"
    },
    {
        nombre: "Chani",
        planeta: "Arrakis",
        afiliacion: "Fremen",
        descripcion: "Guerrera Fremen, hija de Liet-Kynes y gran amor de Paul Atreides.",
        imagen: "assets/img/chani.jpg"
    },
    {
        nombre: "Gurney Halleck",
        planeta: "Caladan / Arrakis",
        afiliacion: "Casa Atreides",
        descripcion: "Trovador guerrero, consejero y amigo cercano de Paul.",
        imagen: "assets/img/gurney.jpg"
    },
    {
        nombre: "Stilgar",
        planeta: "Arrakis",
        afiliacion: "Fremen",
        descripcion: "Líder de los Fremen, aliado fundamental de Paul en Arrakis.",
        imagen: "assets/img/stilgar.jpg"
    }
];

function crearTarjeta(personaje) {
    return `
    <div class="card">
        <img class="foto" src="${personaje.imagen}" alt="${personaje.nombre}" />
        <div class="nombre">${personaje.nombre}</div>
        <div class="planeta"><strong>Planeta:</strong> ${personaje.planeta}</div>
        <div class="afiliacion"><strong>Afiliación:</strong> ${personaje.afiliacion}</div>
        <div class="descripcion">${personaje.descripcion}</div>
    </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('card-container');
    contenedor.innerHTML = personajes.map(crearTarjeta).join('');

    // Partículas de arena
    const canvas = document.getElementById('sand-canvas');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);

    // Configuración de partículas
    const numParticles = Math.floor((width * height) / 2000);
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.7 + 0.8,
            speed: Math.random() * 0.6 + 0.2,
            drift: (Math.random() - 0.5) * 0.6
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
            // colores de arena ligeramente variables
            const alpha = 0.12 + Math.random() * 0.14;
            ctx.fillStyle = `rgba(230, 190, 110, ${alpha})`;
            ctx.shadowColor = `rgba(200, 160, 90, ${Math.min(0.18, alpha)})`;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function updateParticles() {
        for (const p of particles) {
            p.x += p.drift;
            p.y += p.speed;
            if (p.y > height) {
                p.y = -p.r;
                p.x = Math.random() * width;
            }
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
        }
    }

    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    animate();
});