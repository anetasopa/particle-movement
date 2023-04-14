var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var ball = {
  x: 100,
  y: 50,
  r: 5,
  color: "blue"
};

var particles = [];

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const coeff = 0.000001;
const size = 30;

for (let i = 0; i < size; i++) {
  particles.push({
    x: getRndInteger(200, 400),
    y: getRndInteger(200, 400),
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
    Q: getRndInteger(-50, 50),
    mass: getRndInteger(5, 10)
  });
}

function a(particle1, particle2) {
  const y1 = particle1.y;
  const y2 = particle2.y;

  return Math.abs(y1 - y2);
}

function b(particle1, particle2) {
  const x1 = particle1.x;
  const x2 = particle2.x;

  return Math.abs(x1 - x2);
}

function c(particle1, particle2) {
  let yD = a(particle1, particle2);
  yD = Math.pow(yD, 2);

  let xD = b(particle1, particle2);
  xD = Math.pow(xD, 2);

  return Math.sqrt(xD + yD);
}

function sinAlpha(particle1, particle2) {
  const dA = a(particle1, particle2);
  const r = c(particle1, particle2);

  const sinAlpha = dA / r;

  return sinAlpha;
}

function cosAlpha(particle1, particle2) {
  const dB = b(particle1, particle2);
  const r = c(particle1, particle2);

  const cosAlpha = dB / r;

  return cosAlpha;
}

function F(particle1, particle2) {
  const Q1 = particle1.Q;
  const Q2 = particle2.Q;
  const r = c(particle1, particle2);

  const powerF = (Q1 * Q2) / Math.pow(r, 2);

  return powerF;
}

function Fx(particle1, particle2) {
  const cF = F(particle1, particle2);
  const cosA = cosAlpha(particle1, particle2);

  const Fx = cF * cosA;

  return Fx;
}

function Fy(particle1, particle2) {
  const cF = F(particle1, particle2);
  const sinA = sinAlpha(particle1, particle2);

  const Fy = cF * sinA;

  return Fy;
}

function calculatePositions(particles) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const cFx = Fx(particles[i], particles[j]) * coeff;
      const cFy = Fy(particles[i], particles[j]) * coeff;
      //const sinA = sinAlpha(particles[0], particles[1]);

      //console.log(`${cFx}, ${cFy}, ${sinA}`);

      if (particles[i].x > particles[j].x) {
        particles[i].ax += cFx / particles[i].mass;
        particles[j].ax += -cFx / particles[j].mass;
      } else {
        particles[i].ax += -cFx / particles[i].mass;
        particles[j].ax += cFx / particles[j].mass;
      }

      if (particles[i].y > particles[j].y) {
        particles[i].ay += cFy / particles[i].mass;
        particles[j].ay += -cFy / particles[j].mass;
      } else {
        particles[i].ay += -cFy / particles[i].mass;
        particles[j].ay += cFy / particles[j].mass;
      }

      particles[i].vx += particles[i].ax;
      particles[i].vy += particles[i].ay;

      particles[j].vx += particles[j].ax;
      particles[j].vy += particles[j].ay;

      particles[i].x += particles[i].vx;
      particles[i].y += particles[i].vy;

      particles[j].x += particles[j].vx;
      particles[j].y += particles[j].vy;

      if (particles[i].x > 500 || particles[i].x < 0) {
        particles[i].vx = -particles[i].vx;
      }
      if (particles[i].y > 500 || particles[i].y < 0) {
        particles[i].vy = -particles[i].vy;
      }

      if (particles[j].x > 500 || particles[j].x < 0) {
        particles[j].vx = -particles[j].vx;
      }
      if (particles[j].y > 500 || particles[j].y < 0) {
        particles[j].vy = -particles[j].vy;
      }
    }
  }
}

function drawParticles(particles) {
  particles.forEach((particle) => {
    const ball = {
      x: particle.x,
      y: particle.y,
      r: particle.mass,
      color: particle.Q >= 0 ? "red" : "blue"
    };

    drawBall(ball);
  });
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI, false);
  ctx.lineWidth = 0;
  ctx.strokeStyle = ball.color;
  ctx.fillStyle = ball.color;
  ctx.fill();
}

function drawAnimation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  calculatePositions(particles);
  drawParticles(particles);
}

function loop() {
  window.requestAnimationFrame(loop);

  drawAnimation();
}

loop();

// canvas.onmousedown = function (e) {
//   particles.push(
//     {
//       x: e.x,
//       y:  e.y,
//       vx: 0,
//       vy: 0,
//       ax: 0,
//       ay: 0,
//       Q: -50000,
//       mass: 2000000
//     }
//   );
// };
