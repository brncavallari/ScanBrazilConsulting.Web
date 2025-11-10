import React from 'react';
import Navbar from '@components/navbar/navbar'; 

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar /> 
            
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-15">
                        Bem-vindo(a) ao sistema de Despesas
                    </h2>
                </div>
            </main>
        </div>
    );
};

export default Home;
