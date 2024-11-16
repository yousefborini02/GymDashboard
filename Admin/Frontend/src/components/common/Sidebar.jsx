

// // export default Sidebar;
// ////////////////////////////////////////////////////////////
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   BarChart2,
//   Contact,
//   FileText,
//   LogOut,
//   Menu,
//   Settings,
//   ShoppingBag,
//   ShoppingCart,
//   TrendingUp,
//   User,
//   Users,
//   Dumbbell ,
// } from "lucide-react";
// import { logout } from "../../store/authSlice"; // Adjust this import path as needed

// const SIDEBAR_ITEMS = [
//   { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/" },
 
//   /////
//   { name: "Gym Sections", icon: Dumbbell , color: "#10B981", href: "/gymsections" },

 
// ];

// const Sidebar = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     dispatch(logout()); // Dispatch the logout action
//     navigate("/"); // Navigate to the home page
//   };

//   return (
//     <motion.div
//       className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
//         isSidebarOpen ? "w-64" : "w-20"
//       }`}
//       animate={{ width: isSidebarOpen ? 256 : 80 }}
//     >
//       <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
//         >
//           <Menu size={24} />
//         </motion.button>
//         <nav className="mt-8 flex-grow">
//           {SIDEBAR_ITEMS.map((item) => (
//             <Link key={item.href} to={item.href}>
//               <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
//                 <item.icon
//                   size={20}
//                   style={{ color: item.color, minWidth: "20px" }}
//                 />
//                 <AnimatePresence>
//                   {isSidebarOpen && (
//                     <motion.span
//                       className="ml-4 whitespace-nowrap"
//                       initial={{ opacity: 0, width: 0 }}
//                       animate={{ opacity: 1, width: "auto" }}
//                       exit={{ opacity: 0, width: 0 }}
//                       transition={{ duration: 0.2, delay: 0.3 }}
//                     >
//                       {item.name}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             </Link>
//           ))}
//           <div
//             className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 cursor-pointer"
//             onClick={handleLogout}
//           >
//             <LogOut size={20} style={{ color: "#6EE7B7", minWidth: "20px" }} />
//             <AnimatePresence>
//               {isSidebarOpen && (
//                 <motion.span
//                   className="ml-4 whitespace-nowrap"
//                   initial={{ opacity: 0, width: 0 }}
//                   animate={{ opacity: 1, width: "auto" }}
//                   exit={{ opacity: 0, width: 0 }}
//                   transition={{ duration: 0.2, delay: 0.3 }}
//                 >
//                   Logout
//                 </motion.span>
//               )}
//             </AnimatePresence>
//           </div>
//         </nav>
//       </div>
//     </motion.div>
//   );
// };

// export default Sidebar;



import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Dumbbell,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { logout } from "../../store/authSlice"; // Adjust this import path as needed


const MENU_ITEMS = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
      { name: 'Gym Sections', icon: Dumbbell, href: '/gymsections' },
    ],
  },
];

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '5rem' },
  };

  const MenuGroup = ({ title, items }) => (
    <div className="mb-6">
      <AnimatePresence>
        {isExpanded && (
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
          >
            {title}
          </motion.h3>
        )}
      </AnimatePresence>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href}>
              <motion.div
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#444] text-white'
                    : 'text-gray-400 hover:bg-[#333] hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon
                  size={20}
                  className={`${isActive ? 'text-[#3CB347]' : 'text-gray-400'}`}
                />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3 font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <motion.div
      initial="expanded"
      animate={isExpanded ? 'expanded' : 'collapsed'}
      variants={sidebarVariants}
      className="relative min-h-screen border-r border-[#333] bg-black shadow-xl"
    >
      {/* Logo and Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-[#333]">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-[#3CB347] rounded-lg flex items-center justify-center">
                <Dumbbell size={20} className="text-white" />
              </div>
              <span className="font-bold text-white">Fitness Journey</span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-[#333] transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft size={20} className="text-[#3CB347]" />
          ) : (
            <ChevronRight size={20} className="text-[#3CB347]" />
          )}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-4">
        {MENU_ITEMS.map((group) => (
          <MenuGroup key={group.title} {...group} />
        ))}
      </nav>

      {/* Logout Button */}
      <motion.button
        className="absolute bottom-4 left-4 right-4 p-2 flex items-center rounded-lg text-[#3CB347] hover:bg-[#333] transition-all duration-200"
        onClick={handleLogout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <LogOut size={20} />
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3 font-medium"
            >
              Logout
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;
