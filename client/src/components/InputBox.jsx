import { useState } from 'react'

const InputBox = ({ name, type, id, value, placeholder, icon }) => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <div className='relative w-full mb-4'>
      <input
        name={name}
        type={
          type === 'password' ? (passwordVisible ? 'text' : 'password') : type
        }
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        className='input-box'
      />
      <i className={`fi fi-rr-${icon} input-icon`}></i>
      {type === 'password' ? (
        <i
          className={`fi ${
            passwordVisible ? 'fi-rr-eye-crossed' : 'fi-rr-eye'
          } input-icon left-[auto] right-4 cursor-pointer`}
          onClick={() => setPasswordVisible(!passwordVisible)}
        ></i>
      ) : (
        ''
      )}
    </div>
  )
}

export default InputBox
