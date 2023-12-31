import { React, useEffect } from 'react'
import "../style/contact.css"

const Contact = (props) => {

  const {setProgress} = props

  useEffect(() => {
    setProgress(40);

    setTimeout(() => {
      setProgress(100)
    }, 200)

  }, [setProgress])


  return (
    <div className='contact'>
      <div className="contact-container">
        <h1>Have Questions?</h1>
        <p>Please feel free to call or email us, or use our contact form to get in touch with us. We look forward to hearing from you!</p>
        <h3>Emergency? Call Us:</h3>
        <p>909090909099</p>
        <h3>Send Us Mail</h3>
        <p className='mailid' onClick={() => window.location = 'mailto:codestream63@gmail.com'}>codestream63@gmail.com</p>
      </div>

      <div className="contact-form">
        <input type="text" placeholder='Name' required />
        <input type="email" placeholder='Email' required />
        <input type="text" placeholder='Subject' required />
        <textarea name="" id="" cols="30" rows="10" placeholder='Message' required></textarea>
        <button >Send message</button>
      </div>
    </div>
  )
}

export default Contact
