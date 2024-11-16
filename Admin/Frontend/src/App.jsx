
// import React, { useEffect } from "react";
// import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import Sidebar from "./components/common/Sidebar";
// import OverviewPage from "./pages/OverviewPage";
// import Login from "./components/login/Login";
// import { checkAuthStatus } from "./store/authSlice";
// import Reportpage from "./pages/Reportpage";

// function PrivateRoute({ children }) {
//   const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       navigate("/login");
//     }
//   }, [isAuthenticated, isLoading, navigate]);

//   return isAuthenticated ? children : null;
// }

// function App() {
//   const dispatch = useDispatch();
//   const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(checkAuthStatus());
//   }, [dispatch]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
//       {/* BG */}
//       <div className="fixed inset-0 z-0">
//         <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
//         <div className="absolute inset-0 backdrop-blur-sm" />
//       </div>

//       {isAuthenticated && <Sidebar />}
//       <Routes>
//         <Route
//           path="/login"
//           element={isAuthenticated ? <Navigate to="/" /> : <Login />}
//         />
//         <Route
//           path="/"
//           element={
//             <PrivateRoute>
//               <OverviewPage />
//             </PrivateRoute>
//           }
//         />    
//         <Route
//           path="/gymsections"
//           element={
//             <PrivateRoute>
//               <Reportpage />
//             </PrivateRoute>
//           }
//         />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;


// import React, { useEffect } from "react";
// import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import Sidebar from "./components/common/Sidebar";
// import OverviewPage from "./pages/OverviewPage";
// import Login from "./components/login/Login";
// import { checkAuthStatus } from "./store/authSlice";
// import Reportpage from "./pages/Reportpage";

// function PrivateRoute({ children }) {
//   const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       navigate("/login");
//     }
//   }, [isAuthenticated, isLoading, navigate]);

//   return isAuthenticated ? children : null;
// }

// function App() {
//   const dispatch = useDispatch();
//   const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(checkAuthStatus());
//   }, [dispatch]);

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-black">
//         <div className="flex items-center space-x-2">
//           <div className="h-4 w-4 animate-pulse rounded-full bg-[#3CB347]"></div>
//           <div className="h-4 w-4 animate-pulse rounded-full bg-[#3CB347] delay-75"></div>
//           <div className="h-4 w-4 animate-pulse rounded-full bg-[#3CB347] delay-150"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen overflow-hidden bg-black text-gray-100">
//       {/* Background with gradient */}
//       <div className="fixed inset-0 z-0">
//         <div className="absolute inset-0 bg-gradient-to-br from-black via-[#333] to-[#444] opacity-50" />
//         <div className="absolute inset-0 backdrop-blur-sm" />
//       </div>

//       {/* Content */}
//       <div className="relative z-10 flex w-full">
//         {isAuthenticated && <Sidebar />}
//         <main className="flex-1 overflow-auto">
//           <div className="relative h-full rounded-tl-xl bg-[#111] shadow-xl">
//             <div className="absolute inset-0 bg-gradient-to-b from-[#333]/10 to-transparent" />
//             <div className="relative h-full p-6">
//               <Routes>
//                 <Route
//                   path="/login"
//                   element={isAuthenticated ? <Navigate to="/" /> : <Login />}
//                 />
//                 <Route
//                   path="/"
//                   element={
//                     <PrivateRoute>
//                       <div className="rounded-lg bg-[#222]/50 p-6 backdrop-blur-sm">
//                         <OverviewPage />
//                       </div>
//                     </PrivateRoute>
//                   }
//                 />    
//                 <Route
//                   path="/gymsections"
//                   element={
//                     <PrivateRoute>
//                       <div className="rounded-lg bg-[#222]/50 p-6 backdrop-blur-sm">
//                         <Reportpage />
//                       </div>
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route path="*" element={<Navigate to="/" />} />
//               </Routes>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;




import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./components/common/Sidebar";
// import OverviewPage from "./pages/OverviewPage";
import Login from "./components/login/Login";
import { checkAuthStatus } from "./store/authSlice";
import Reportpage from "./pages/Reportpage";

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return isAuthenticated ? children : null;
}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-pulse rounded-full bg-[#3CB347]"></div>
          <div className="h-4 w-4 animate-pulse rounded-full bg-[#3CB347] delay-75"></div>
          <div className="h-4 w-4 animate-pulse rounded-full bg-[#3CB347] delay-150"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black text-gray-100">
      {/* Content */}
      <div className="relative z-10 flex w-full">
        {isAuthenticated && <Sidebar />}
        <main className="flex-1 overflow-auto">
          <div className="relative h-full bg-black">
            <div className="relative h-full p-6">
              <Routes>
                <Route
                  path="/login"
                  element={isAuthenticated ? <Navigate to="/" /> : <Login />}
                />
                {/* <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <div className="bg-[#222] p-6 rounded-lg">
                        <OverviewPage />
                      </div>
                    </PrivateRoute>
                  }
                />     */}
                <Route
                  path="/gymsections"
                  element={
                    <PrivateRoute>
                      <div className="bg-black p-6 rounded-lg">
                        <Reportpage />
                      </div>
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;