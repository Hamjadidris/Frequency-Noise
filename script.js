const styleRoot = document.querySelector(":root");
const noiseContainer = document.querySelector(".noise-container");
const noiseCanvas = document.querySelector(".noise-canvas");
const editBtn = document.querySelector(".edit-btn");
const formCard = document.querySelector(".form-container");
const blurSwitch = document.querySelector("#blur-switch");
const gridSizeInput = document.querySelector("#grid-size");
const dotSizeInput = document.querySelector("#dot-size");
const animationSpeedInput = document.querySelector("#animation-speed");

let rows = 50;
let columns = 50;
let frequency = 0.1;
let animate = false;
let animationSpeed = 1;

let formIsIn = false;
editBtn.addEventListener("click", () => {
  if (formIsIn) {
    formCard.classList.remove("slide-in");
    formCard.classList.add("slide-out");
    formIsIn = false;
    return;
  }
  formCard.classList.add("slide-in");
  formCard.classList.remove("slide-out");
  formIsIn = true;
});

const getDotLocation = (index) => {
  const { clientHeight, clientWidth } = noiseCanvas;
  const containerHeight = clientHeight;
  const containerWidth = clientWidth - 16;

  const position = index + 1;

  const rowPosition = roundToFive(position, rows);

  const columnPosition = roundToFive(position, columns) - 1.02;

  const roundedIndex = index - columnPosition * columns;

  const radius = containerWidth / rows / 2;

  const x = roundedIndex * radius;

  const y = radius * rowPosition;

  const offsetX = (roundedIndex + 1) * radius;

  const offsetY = radius * rowPosition;

  return {
    x: x + offsetX,
    y: y + offsetY,
    radius: radius,
  };
};

const placeDots = () => {
  const dotsAmounts = rows * columns;

  noiseCanvas.innerHTML = `
        <defs>
         <filter id="blurFilter">
           <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur" />
           <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -5" result="filter"/>
         </filter>
       </defs>


  ${[...Array(dotsAmounts).keys()].map((i) => {
    const location = getDotLocation(i);
    const randomNumber = getRandomNumber();
    return `<circle r="${location.radius / randomNumber}" 
    cx="${location.x}" cy="${location.y}" 
    fill="#000" style="--radius: ${randomNumber}"/>  `;
  })}
      `;
};

function roundToFive(value, nearest) {
  if (value % nearest === 0) {
    return value / nearest;
  }
  return Math.floor((value + nearest) / nearest);
}

function getRandomNumber() {
  return Math.random() * 4 + 0.8;
}

placeDots();
window.addEventListener("resize", placeDots);

blurSwitch.addEventListener("input", (e) => {
  const { checked } = e.target;
  if (checked) {
    noiseCanvas.style.filter = `url("#blurFilter")`;
  } else {
    noiseCanvas.style.filter = "unset";
  }
});

gridSizeInput.addEventListener("input", (e) => {
  const { value } = e.target;
  rows = +value;
  columns = +value;
  placeDots();
});

dotSizeInput.addEventListener("input", (e) => {
  const { value } = e.target;
  styleRoot.style.setProperty("--dot-size", `${value}px`);
});

animationSpeedInput.addEventListener("input", (e) => {
  const { value } = e.target;
  const duration = Math.abs(value - 1) + 0.1;
  styleRoot.style.setProperty("--anim-duration", `${duration}s`);
});
