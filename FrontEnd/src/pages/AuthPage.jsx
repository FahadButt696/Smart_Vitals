// import React, { useState } from 'react';
// import CustomSignIn from '../components/custom/CustomSignIn';
// import CustomSignUp from '../components/custom/CustomSignUp';

// function AuthPage() {
//   const [isLogin, setIsLogin] = useState(true); // true for login, false for signup

//   const toggleForm = () => {
//     setIsLogin(!isLogin);
//   };

//   // Classes for the Welcome Panel (the purple triangle part)
//   const welcomePanelClasses = `
//     absolute top-0 h-full w-1/2 flex items-center justify-center p-8
//     transition-all duration-700 ease-in-out transform
//     bg-gradient-to-br from-purple-800 to-indigo-900
//     ${isLogin ? 'right-0' : 'left-0'} // Position based on isLogin state
//     ${isLogin ? 'rounded-r-2xl' : 'rounded-l-2xl'} // Apply rounded corners based on side
//   `;

//   // Dynamic clipPath for the Welcome Panel to create the diagonal effect
//   const welcomeClipPath = isLogin
//     ? 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)' // Triangle on right for Login
//     : 'polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%)'; // Triangle on left for Sign Up

//   // Classes for the Form Panel (where SignIn/SignUp forms reside)
//   const formPanelClasses = `
//     absolute top-0 h-full w-1/2 flex items-center justify-center p-8
//     transition-all duration-700 ease-in-out transform
//     ${isLogin ? 'left-0' : 'right-0'} // Position based on isLogin state
//   `;

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 font-sans antialiased text-gray-100 bg-gradient-to-r from-gray-900 via-cyan-900 to-neutral-900 overflow-hidden">
//       <div className="relative w-full max-w-4xl h-[500px] bg-black bg-opacity-40 rounded-2xl shadow-2xl overflow-hidden border border-purple-800 backdrop-blur-sm">

//         {/* Welcome Panel - This panel contains the "WELCOME BACK!" text */}
//         <div
//           className={welcomePanelClasses}
//           style={{ clipPath: welcomeClipPath }}
//         >
//           <div className="text-center">
//             <h2 className="text-5xl font-extrabold text-white mb-4 leading-tight">
//               WELCOME BACK!
//             </h2>
//             <p className="text-lg text-gray-200">
//               Smart Vitals: Your fitness and health management partner with advanced AI features.
//             </p>
//           </div>
//         </div>

//         {/* Form Panel - This panel contains either the SignIn or SignUp form */}
//         <div className={formPanelClasses}>
//           {/* Login Form - Conditionally rendered and faded based on isLogin */}
//           <div
//             className={`absolute w-full h-full flex flex-col items-center justify-center p-8 transition-opacity duration-500 ease-in-out ${
//               isLogin ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
//             }`}
//           >
//             <CustomSignIn />
//             <p className="mt-6 text-gray-300">
//               Don't have an account?{' '}
//               <button
//                 onClick={toggleForm}
//                 className="font-semibold text-cyan-400 hover:text-cyan-500 transition-colors duration-200 focus:outline-none"
//               >
//                 Sign Up
//               </button>
//             </p>
//           </div>

//           {/* Sign Up Form - Conditionally rendered and faded based on isLogin */}
//           <div
//             className={`absolute w-full h-full flex flex-col items-center justify-center p-8 transition-opacity duration-500 ease-in-out ${
//               !isLogin ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
//             }`}
//           >
//             <CustomSignUp />
//             <p className="mt-6 text-gray-300">
//               Already have an account?{' '}
//               <button
//                 onClick={toggleForm}
//                 className="font-semibold text-cyan-400 hover:text-cyan-500 transition-colors duration-200 focus:outline-none"
//               >
//                 Login
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AuthPage;
