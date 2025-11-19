import React from 'react';

const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = [1, 2, 3, 4];
    return (
        <div className="flex items-center justify-between mx-auto w-full max-w-4xl mb-12">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-colors duration-300 shadow-lg
                        ${step === currentStep ? 'bg-green-500 ring-4 ring-green-300/50' :
                            step < currentStep ? 'bg-blue-500' : 'bg-gray-700'}`}>
                        {step}
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-4 transition-colors duration-300 rounded
                            ${step < currentStep ? 'bg-green-500' : 'bg-gray-700'}`}>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default ProgressBar;