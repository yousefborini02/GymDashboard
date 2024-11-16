import React from 'react';

const Header = ({ title }) => {
  return (
    <header className='relative bg-[#222] border-b border-[#3CB347]/20'>
      {/* Gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-[#3CB347]/5 via-transparent to-[#3CB347]/5'></div>
      
      {/* Blur effect container */}
      <div className='relative backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center space-x-4'>
            <div className='h-8 w-1 rounded-full bg-[#3CB347]/50'></div>
            <h1 className='text-2xl font-bold tracking-tight'>
              <span className='text-[#3CB347]'>{title}</span>
            </h1>
          </div>
        </div>
      </div>
      
      {/* Bottom highlight */}
      <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3CB347]/30 to-transparent'></div>
    </header>
  );
};

export default Header;