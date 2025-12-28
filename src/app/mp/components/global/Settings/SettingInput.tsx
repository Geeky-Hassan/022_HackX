import React, { ChangeEvent } from 'react'

interface SettingInputProps {
  label: string;
  description?: string;
  type: "text" | "email" | "password" | "number" | "textarea";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SettingInput = ({ label, description, type, value, onChange }: SettingInputProps) => {
  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='flex flex-col'>
        <p className='text-md text-neutral-700 font-medium'>{label}</p>
        {description && <p className='text-sm text-neutral-700/80'>{description}</p>}
      </div>
      {type === "textarea" ? (
        <textarea
          value={value}
          rows={4}
          onChange={onChange}
          className='outline-neutral-400/40 resize-none rounded-xl border border-neutral-400/30 bg-neutral-400/10 w-full px-4 py-2' />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className='outline-none rounded-xl border border-neutral-400/30 bg-neutral-400/10 w-full h-12 px-4 py-2' />
      )}

    </div>
  )
}

export default SettingInput
