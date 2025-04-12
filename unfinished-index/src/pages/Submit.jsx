import React, { useState } from 'react'
import './Submit.css'

export default function Submit() {
    const [result, setResult] = useState("")

    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending...")
        const formData = new FormData(event.target);
    
        formData.append("access_key", "fe4c2f19-c412-472d-b656-e1e9306ec86a");
    
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
    
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: json
        }).then((res) => res.json());
    
        if (res.success) {
          console.log("Success", res);
          setResult(res.message)
          event.target.reset()
        } else {
            console.log("Error", res)
            setResult(res.message)
        }
      };

    return (
        <section className='submit'>
            <form onSubmit={onSubmit}>
                <h3>Submit Form</h3>
                <div className='input-box'>
                    <label>Full Name: </label>
                    <input name='name' type='text' className='field' placeholder='Enter your name' required />
                </div>
                <div className='input-box'>
                    <label>Email Address: </label>
                    <input name='email' type='email' className='field' placeholder='Enter your email' required />
                </div>
                <div className='input-box'>
                    <label>Building Information: </label>
                    <textarea name='message' id='' className='field message' placeholder='City, address or other information about the building' required />
                </div>
                
                <button type='submit'>Submit</button>
            </form>
            <div>{result}</div>
        </section>
    )
    
}