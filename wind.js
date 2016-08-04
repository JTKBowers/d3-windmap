function updateParticle(particle){
  particle.prev_x = particle.x;
  particle.prev_y = particle.y;

  particle.x += .7;
  // particle.x += Math.random();
  // particle.y += 0.3*(Math.random()-0.5);

  return particle;
}

function createWind(canvasSelector, mapProj){
  console.log(mapProj);
  var width = 1500;
  var nominalHeight = 1160;

  var height = getHeight();
  if (height < nominalHeight)
    width *= height/nominalHeight;

  function createWindParticle(){
    return {
      x: Math.random() * width*0.8,
      y: Math.random() * height,
      prev_x: undefined,
      prev_y: undefined,
      lifespan: Math.random() * 200,
      age: 0
    };
  }

  var particles = new ParticleSystem(canvasSelector, width,height);
  particles.createParticle = createWindParticle;
  particles.updateParticle = updateParticle;
  particles.createParticles(2000);
  particles.start();
}
