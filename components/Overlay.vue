<template>
  <div class="Overlay">
  </div>
  <svg>
    <filter id="pixelate">
      <feFlood x="4" y="4" height="2" width="2" flood-color="black"/>
      
      <feComposite width="8" height="8"/>
      
      <feTile result="a"/>
      
      <feComposite in="SourceGraphic" in2="a" 
                  operator="in"/>
      
      <feMorphology operator="dilate"
                    radius="4"/>
    </filter>
  </svg>
</template>

<style scoped>
.Overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: url('#pixelate');
  background-color: var(--colorOverlay);
  z-index: 999;
  animation: pixelate 3s infinite alternate;
}

@keyframes pixelate {
  from {
    --rad: 0;
  } to {
    --rad: 4;
  }
}

#pixelate feMorphology {
  radius: var(--radius);
}
</style>

