
// Upward Floating Particles with Hard Umbrella Effect
// Particles float upward and bounce off a hard umbrella barrier around the cursor

(function() {
  // Wait for the DOM to be fully loaded before initializing
  document.addEventListener('DOMContentLoaded', initParticlesBackground);
  
  // If the DOM is already loaded, run initialization immediately
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initParticlesBackground, 1);
  }
  
  function initParticlesBackground() {
    // Create canvas element  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to cover the entire background
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0'; // Normal z-index
    canvas.style.pointerEvents = 'none'; // Don't intercept clicks
    
    // Add a class for easier reference
    canvas.classList.add('floating-particles-canvas');
    
    // Create a small clickable element that will follow the red particle
    const redParticleClickDetector = document.createElement('div');
    redParticleClickDetector.style.position = 'fixed';
    redParticleClickDetector.style.width = '20px'; // Will be updated dynamically
    redParticleClickDetector.style.height = '20px'; // Will be updated dynamically
    redParticleClickDetector.style.borderRadius = '50%'; // Circle shape
    redParticleClickDetector.style.zIndex = '10000'; // Very high z-index
    redParticleClickDetector.style.background = 'transparent';
    redParticleClickDetector.style.display = 'none'; // Hidden by default
    redParticleClickDetector.style.transform = 'translate(-50%, -50%)'; // Center on point
    document.body.appendChild(redParticleClickDetector);
    
    // Append canvas to body
    document.body.appendChild(canvas);
    
    // Particle settings - increased count and speed
    const particleCount = 300; // More particles
    const minSize = 1.5;
    const maxSize = 4;
    const baseOpacity = 0.3;
    const floatSpeedMin = 1.5; // Much faster upward movement
    const floatSpeedMax = 3.0;
    const horizontalDrift = 0.8; // Maximum horizontal movement for diagonal effect
    
    // Array to store particles
    let particles = [];
    let redParticlePosition = null; // Track red particle position
    
    // Resize handler
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    // Initialize particles
    function initParticles() {
      particles = [];
      
      for (let i = 0; i < particleCount; i++) {
        // Create particles at random positions starting from the bottom
        const size = minSize + Math.random() * (maxSize - minSize);
        const opacity = baseOpacity * (0.4 + Math.random() * 0.6);
        
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height - Math.random() * 50, // Start near bottom
          size: size,
          opacity: opacity,
          // More varied diagonal movement
          speedY: -(floatSpeedMin + Math.random() * (floatSpeedMax - floatSpeedMin)),
          speedX: (Math.random() - 0.5) * horizontalDrift * 2, // Double horizontal variation
          // Original speed for return to natural movement
          originalSpeedY: -(floatSpeedMin + Math.random() * (floatSpeedMax - floatSpeedMin)),
          originalSpeedX: (Math.random() - 0.5) * horizontalDrift * 2,
          // Each particle gets a slight blur effect for smoother appearance
          blur: Math.random() * 2,
          isSpecialRed: false // Flag for normal particles
        });
      }
    }
    
    // Mouse interaction - hard umbrella effect
    let mouseX = null;
    let mouseY = null;
    const umbrellaRadius = 100; // Radius of the umbrella
    
    function handleMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
    
    // Check if particle will hit the umbrella in next frame
    function checkUmbrellaCollision(particle, nextX, nextY) {
      // Special red particles ignore umbrella
      if (particle.isSpecialRed) return false;
      
      if (mouseX === null || mouseY === null) return false;
      
      const dx = mouseX - nextX;
      const dy = mouseY - nextY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Check if particle would be inside umbrella or just touching it
      return distance < (umbrellaRadius + particle.size);
    }
    
    // Handle collision and redirect particle
    function handleUmbrellaCollision(particle) {
      if (mouseX === null || mouseY === null) return;
      
      // Calculate distance to umbrella center
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If particle is already inside, push it out
      if (distance < umbrellaRadius + particle.size) {
        // Push particle outside umbrella
        const pushFactor = (umbrellaRadius + particle.size) / distance;
        particle.x = mouseX - dx * pushFactor;
        particle.y = mouseY - dy * pushFactor;
      }
      
      // Calculate collision normal (direction from collision point)
      const normal = {
        x: (particle.x - mouseX) / distance,
        y: (particle.y - mouseY) / distance
      };
      
      // Reflect velocity off umbrella surface
      const dotProduct = particle.speedX * normal.x + particle.speedY * normal.y;
      particle.speedX = particle.speedX - 2 * dotProduct * normal.x;
      particle.speedY = particle.speedY - 2 * dotProduct * normal.y;
      
      // Add some bounce intensity to make it feel more solid
      const bounceIntensity = 1.2;
      particle.speedX *= bounceIntensity;
      particle.speedY *= bounceIntensity;
    }
    
    // ======== SPECIAL RED PARTICLE FEATURE - START ========
    // This section adds a special red particle that appears randomly once per hour
    // and is immune to the umbrella effect. Can be removed if not needed.
    
    // Variables for special red particle
    let hasSpecialRedParticle = false;
    let specialRedParticleTimer = null;
    const COOLDOWN_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
    const STORAGE_KEY = 'redParticleLastSpawnTime';
    
    // Function to check if we can spawn a red particle based on cooldown
    function canSpawnRedParticle() {
      // Get the last spawn time from localStorage
      const lastSpawnTime = localStorage.getItem(STORAGE_KEY);
      
      // If no record exists, we can spawn
      if (!lastSpawnTime) {
        return true;
      }
      
      // Calculate time elapsed since last spawn
      const now = Date.now();
      const timeSinceLastSpawn = now - parseInt(lastSpawnTime);
      
      // Return true if cooldown period has passed
      return timeSinceLastSpawn >= COOLDOWN_TIME;
    }
    
    // Function to record spawn time in localStorage
    function recordRedParticleSpawn() {
      const now = Date.now();
      localStorage.setItem(STORAGE_KEY, now.toString());
    }
    
    // Function to spawn a special red particle
    function spawnSpecialRedParticle() {
      // Only spawn if there isn't already a special red particle
      // AND if the cooldown period has passed
      if (!hasSpecialRedParticle && canSpawnRedParticle()) {
        // Determine left or right side (avoiding middle)
        let particleX;
        
        // Define the middle section (30% of screen width)
        const middleStart = canvas.width * 0.35;
        const middleEnd = canvas.width * 0.65;
        
        // Randomly choose left or right side
        if (Math.random() < 0.5) {
          // Left side - 0 to 35% of screen width
          particleX = Math.random() * middleStart;
        } else {
          // Right side - 65% to 100% of screen width
          particleX = middleEnd + Math.random() * (canvas.width - middleEnd);
        }
        
        // Make the red particle similar to normal ones but still special
        const size = minSize + Math.random() * (maxSize - minSize) * 1.5; // Slightly larger than average
        
        // Calculate speeds similar to normal particles
        const speedY = -(floatSpeedMin + Math.random() * (floatSpeedMax - floatSpeedMin));
        const speedX = (Math.random() - 0.5) * horizontalDrift;
        
        // Add the red particle
        particles.push({
          x: particleX,
          y: canvas.height, // Start at the bottom
          size: size,
          opacity: 0.8, // More visible than regular particles
          // Normal movement speed
          speedY: speedY,
          speedX: speedX,
          // Original speed reference
          originalSpeedY: speedY,
          originalSpeedX: speedX,
          blur: 3, // Slight glow, not overwhelming
          isSpecialRed: true,
          pulsePhase: 0
        });
        
        hasSpecialRedParticle = true;
        
        // Record spawn time in localStorage for persistence
        recordRedParticleSpawn();
      }
    }
    
    // Update the position of the click detector to follow the red particle
    function updateRedParticleClickDetector() {
      // First find the red particle
      redParticlePosition = null;
      
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].isSpecialRed) {
          // Found the red particle
          redParticlePosition = {
            x: particles[i].x,
            y: particles[i].y,
            size: particles[i].size
          };
          break;
        }
      }
      
      // Update click detector position and size if red particle exists
      if (redParticlePosition) {
        // Calculate click area size (4x particle size)
        const clickAreaSize = redParticlePosition.size * 8; // 8x diameter for easy clicking
        
        // Update click detector
        redParticleClickDetector.style.width = clickAreaSize + 'px';
        redParticleClickDetector.style.height = clickAreaSize + 'px';
        redParticleClickDetector.style.left = redParticlePosition.x + 'px';
        redParticleClickDetector.style.top = redParticlePosition.y + 'px';
        redParticleClickDetector.style.display = 'block';
      } else {
        // Hide click detector if no red particle
        redParticleClickDetector.style.display = 'none';
      }
    }
    
    // Check if special particles are still visible
    function checkSpecialRedParticle() {
      // Look through all particles
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].isSpecialRed && particles[i].y < 0) {
          // Red particle has left the screen
          particles.splice(i, 1);
          hasSpecialRedParticle = false;
          break;
        }
      }
      
      // Update the click detector
      updateRedParticleClickDetector();
    }
    
    // Handle click on red particle
    function handleRedParticleClick(e) {
      e.preventDefault();
      // Navigate to the specified URL when red particle is clicked
      window.location.href = '/assets/html/footer2.html';
    }
    
    // Start the hourly timer for spawning the special red particle
    function startSpecialRedParticleTimer() {
      // Clear any existing timer
      if (specialRedParticleTimer) {
        clearInterval(specialRedParticleTimer);
      }
      
      // Set timer to spawn a red particle every hour (3600000 ms)
      specialRedParticleTimer = setInterval(() => {
        spawnSpecialRedParticle();
      }, 3600000); // Every hour
    }
    
    // Try to spawn a red particle at startup if cooldown allows
    setTimeout(() => {
      spawnSpecialRedParticle();
    }, 5000); // Try after 5 seconds
    
    // ======== SPECIAL RED PARTICLE FEATURE - END ========
    
    // Draw particles
    function drawParticles() {
      // Complete clear with no trail effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw each particle
      for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];
        
        // Calculate next position
        let nextX = particle.x + particle.speedX;
        let nextY = particle.y + particle.speedY;
        
        // Check for umbrella collision before moving
        if (checkUmbrellaCollision(particle, nextX, nextY)) {
          // Handle the collision
          handleUmbrellaCollision(particle);
        } else {
          // Gradually return to natural movement
          particle.speedX += (particle.originalSpeedX - particle.speedX) * 0.05;
          particle.speedY += (particle.originalSpeedY - particle.speedY) * 0.05;
        }
        
        // Move particle
        particle.y += particle.speedY;
        particle.x += particle.speedX;
        
        // Wrap around when particle reaches top - respawn at bottom
        if (particle.y < 0) {
          // For regular particles only
          if (!particle.isSpecialRed) {
            particle.y = canvas.height;
            particle.x = Math.random() * canvas.width;
            // Reset to original speed
            particle.speedX = particle.originalSpeedX;
            particle.speedY = particle.originalSpeedY;
          } 
          // Special red particles will be cleaned up by checkSpecialRedParticle
        }
        
        // Wrap around sides too
        if (particle.x < 0) {
          particle.x = canvas.width;
        } else if (particle.x > canvas.width) {
          particle.x = 0;
        }
        
        // Choose color based on particle type
        if (particle.isSpecialRed) {
          // Update pulse phase for neon effect
          if (particle.pulsePhase !== undefined) {
            particle.pulsePhase = (particle.pulsePhase + 0.05) % (Math.PI * 2);
          }
          
          // Red particle - more subtle now
          ctx.fillStyle = 'rgba(255, 50, 50, ' + particle.opacity + ')';
          ctx.shadowColor = 'rgba(255, 0, 0, 0.7)';
          ctx.shadowBlur = particle.blur;
          
          // Draw the red dot
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Regular white particles
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
          
          // Use shadow blur for softer dots
          ctx.shadowBlur = particle.blur;
          
          // Draw the dot
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Reset shadow for better performance
        ctx.shadowBlur = 0;
      }
      
      // Check if the special red particle needs cleanup
      checkSpecialRedParticle();
      
      // Request next animation frame
      requestAnimationFrame(drawParticles);
    }
    
    // Run everything
    resizeCanvas();
    initParticles();
    drawParticles();
    
    // Event listeners
    window.addEventListener('resize', function() {
      resizeCanvas();
      initParticles();
    });
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Add click handler to the red particle click detector
    redParticleClickDetector.addEventListener('click', handleRedParticleClick);
  }
})();
