import stateStore from '@/store/zuStore';
import { ThemeType } from '@/types';
import React from 'react'


interface ThemeButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  value: ThemeType;
}

const ThemeButton = ({ label, icon, isActive, value }: ThemeButtonProps) => {
  const { setTheme } = stateStore();
  return (
    <div
      className={
        `rounded-xl border w-full h-24 flex flex-col gap-1 justify-center items-center transition-all duration-300
      ${isActive
          ?
          'bg-text-blue/10 border-text-blue/40'
          :
          'bg-neutral-400/10 border-neutral-400/30 cursor-pointer'
        }
        `}
      onClick={() => {
        setTheme(value);
      }}>
      <div className={`${isActive ? 'text-text-blue' : 'text-neutral-400/80'} size-6`}>
        {icon}
      </div>
      <p className={`${isActive ? 'text-text-blue' : 'text-neutral-700/80'} text-sm`}>{label}</p>
    </div>
  )
}

export default ThemeButton