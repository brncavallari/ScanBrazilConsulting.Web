import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from '../src/app/pages/login/login';
import Home from '../src/app/pages/home/home';
import Register from '../src/app/pages/register/register';
import History from '../src/app/pages/history/history';
import ProtectedRoute from '../src/app/components/route/protectedRoute'

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<ProtectedRoute> <Outlet /> </ProtectedRoute>}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/configuration" />
                </Route>
                <Route path="*" element={<div className="min-h-screen bg-gray-900 text-white p-8">404: Página não encontrada</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
