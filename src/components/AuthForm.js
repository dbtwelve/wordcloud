import { authService } from "fbase";
import React, { useState } from "react"

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email"){
            setEmail(value)
        } else if(name === "password"){
            setPassword(value)
        }
    };
    const onSubmit = async(event) => {
        event.preventDefault(); //이메일, 비밀번호 입력후 버튼누르면 화면 새로고침 방지
        try{
            let data;
            if(newAccount){
                data = await authService.createUserWithEmailAndPassword(email, password)
            } else {
                data = await authService.signInWithEmailAndPassword(email, password)
            }
            //console.log(data)
        } catch(error) {
            setError(error.message);
        }
        
    };
    const toggleAccount = () => setNewAccount((prev) => !prev) 
    return(
        <>
            <form onSubmit={onSubmit} className="container">
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    required value={email} 
                    onChange={onChange} 
                    className="authInput"
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    required value={password} 
                    onChange={onChange} 
                    className="authInput"
                />
                <input 
                    type="submit" 
                    value={newAccount ? "Create Account" : "Log In"} 
                    className="authInput authSubmit"/>
            </form>
            {error && <span className="authError">{error}</span>}
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Sign in" : "Create Account"}
            </span>
            
        </>
    )
};

export default AuthForm;