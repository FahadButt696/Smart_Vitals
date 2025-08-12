import userRoutes from './routes/userRoutes.js';

console.log('User routes imported successfully');
console.log('User routes type:', typeof userRoutes);
console.log('User routes:', userRoutes);
console.log('User routes stack:', userRoutes.stack);

// Try to access a specific route
if (userRoutes.stack) {
  console.log('\nAvailable routes:');
  userRoutes.stack.forEach((layer, index) => {
    if (layer.route) {
      console.log(`${index}: ${Object.keys(layer.route.methods).join(',')} ${layer.route.path}`);
    }
  });
} else {
  console.log('No routes found in userRoutes');
}
