// import React, { useState } from 'react';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="relative left-1/2 transform -translate-x-1/2 z-50 w-[100%] md:w-[100%] bg-white/10 backdrop-blur-md shadow-md px-6 py-5 text-white">
//       <div className="flex items-center justify-between">
//         <div className="text-lg font-bold tracking-wide">SmartVitals</div>

//         {/* Desktop Menu */}
//         <ul className="hidden md:flex gap-10 text-xl font-medium">
//           <li><a href="#" className="hover:text-blue-400 transition">Home</a></li>
//           <li><a href="#" className="hover:text-blue-400 transition">Features</a></li>
//           <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
//             <div className="flex justify-end w-[50rem] px-1.5 gap-6 border-amber-300">
//                 <li><a href="#" className="hover:text-blue-400 transition">SignUp</a></li>
//                 <li><a href="#" className="hover:text-blue-400 transition">Login</a></li>
//             </div>
          
//         </ul>

//         {/* Mobile Hamburger */}
//         <button
//           className="md:hidden"
//           onClick={() => setIsOpen(!isOpen)}
//           aria-label="Toggle Menu"
//         >
//           <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             {isOpen ? (
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12" />
//             ) : (
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M4 6h16M4 12h16M4 18h16" />
//             )}
//           </svg>
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <ul className="mt-4 md:hidden flex flex-col gap-4 text-sm font-medium">
//           <li><a href="#" className="hover:text-blue-400 transition">Home</a></li>
//           <li><a href="#" className="hover:text-blue-400 transition">Features</a></li>
//           <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
//           <li><a href="#" className="hover:text-blue-400 transition">Login</a></li>
//         </ul>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
