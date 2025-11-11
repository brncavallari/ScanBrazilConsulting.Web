import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from '../src/app/pages/login/login';
import Home from '../src/app/pages/home/home';
import ProtectedRoute from '../src/app/components/route/protectedRoute'
import WorkTimer from '@pages/workTimer';
import CreateUserTimer from '@pages/workTimer/create';
import ImportWorkTimer from '@pages/workTimer/import';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<ProtectedRoute> <Outlet /> </ProtectedRoute>}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/worktimer" element={<WorkTimer />} />
                    <Route path="/worktimer/register" element={<CreateUserTimer />} />
                    <Route path="/worktimer/import" element={<ImportWorkTimer />} />
                </Route>
                <Route path="*" element={<div className="min-h-screen bg-gray-900 text-white p-8">404: Página não encontrada</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
