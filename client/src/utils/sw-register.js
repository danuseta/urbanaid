const swRegister = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker is not supported in this browser');
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    if (registrations.length === 0) {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered successfully:', registration.scope);

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New content is available and will be used when all tabs for this page are closed.');
          }
        });
      });
    } else {
      console.log('Service Worker already registered');
      
      registrations.forEach(async (registration) => {
        try {
          await registration.update();
          console.log('Service Worker updated');
        } catch (error) {
          console.error('Failed to update Service Worker:', error);
        }
      });
    }

  } catch (error) {
    console.error('Service Worker registration failed:', error);
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('Service Worker re-registered successfully:', registration.scope);
    } catch (retryError) {
      console.error('Service Worker re-registration also failed:', retryError);
      return null;
    }
  }
};

navigator.serviceWorker.addEventListener('controllerchange', () => {
  console.log('Service Worker controller changed');
});

export default swRegister;