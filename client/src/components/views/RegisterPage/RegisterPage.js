import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { useNavigate } from "react-router-dom";
import Auth from '../../../hoc/auth'

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("")
  const [Name, setName] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  }

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onSubmitHandler = (event) => {
    event.preventDefault(); // page refresh 막는 역할

    if(Password !== ConfirmPassword){
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
    }

    let body = {
      email:Email,
      name:Name,
      password:Password
    }

    dispatch(registerUser(body))
      .then(response => {
        if(response.payload.success) {
          // props.history.push('/login');
          navigate('/login');
        } else {
          alert('Failed to sign up')
        }
      })
  }

  return (
    <div style={{
      display:'flex', justifyContent:'center',alignItems:'center'
       , width:'100%', height:'100vh'
    }}>
      <form style={{display:'flex', flexDirection:'column'}}
            onSubmit={onSubmitHandler}
      >
        <lable>Email</lable>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <lable>Name</lable>
        <input type="text" value={Name} onChange={onNameHandler} />
        <lable>Password</lable>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <lable>Confirm Password</lable>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
        <br />
        <button type="submit">
          Register
        </button>
      </form>
    </div>
  )
}

export default Auth(RegisterPage, false);
