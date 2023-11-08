import { FC } from 'react'

interface InputProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}

export const Input: FC<InputProps> = ({
  id,
  label,
  onChange,
  value,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-medium text-white"
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:outline-primary-hover"
        required
        value={value}
        onChange={({ target }) =>
          onChange(target.value)
        }
      />
    </div>
  )
}
