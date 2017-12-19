const hoverEffect = ($div, beta, gamma, strength) => {
  console.log(strength);
  // const height = strength / window.innerHeight;
  // const width = strength / window.innerWidth;
  // const pageX = beta - window.innerWidth / 2;
  // const pageY = gamma - window.innerHeight / 2;
  // const newvalueX = width * pageX * - 1;
  // const newvalueY = height * pageY * - 1;
  //const newvalueZ = newvalueY / 2;
  $div.setAttribute(`style`, `background-position: ${- beta / 7  }px     ${- gamma / 7}px`);
  // $div.setAttribute(`style`, `transform: rotate(${newvalueZ  }deg)`);
};

export default hoverEffect;
