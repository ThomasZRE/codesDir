import { useEffect, useState } from 'react'
import codesService from './services/codes'


// Content component
const Content = (props) => {
  // Styles
  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  }

  const textStyle = {
    marginLeft: '10rem',
    marginRight: '10rem',
  }

  const latest = props.latest.filter(o => o.to === props.email)

  return (
    <div>
      {latest.map(o => {
        const date = new Date(o.date)
        const dateCol = date.toLocaleString('es-CO')

        return (
          <div style={contentStyle} key={o.id}>
            <h3 style={ { alignSelf: 'center',} }>{o.subject}</h3>
            <p style={textStyle}><strong>Fecha:</strong> {dateCol}</p>
            <p style={textStyle}><strong>Cuenta:</strong> {o.to}</p>
            <p style={textStyle}>{o.body.replaceAll("\\n", "")}</p>
          </div>
        )
      })}
    </div>
  )
}

const App = () => {
  const [ email, setEmail ] = useState('')
  const [ latest, setLatest ] = useState([]) // Latest mails

  // Styles
  const contentStyle = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '5rem',
    marginBottom: '5rem'
  }

  const buttonStyle = {
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '1rem',
    padding: '0.5rem',
    margin: '0.5em',
    fontSize: '1rem',
  }

  const inputStyle = {
    borderRadius: '1rem',
    padding: '0.5rem 1rem 0.5rem 1rem',
    fontSize: '1rem',
    margin: '0.5em',
    marginRight: '0',
  }


  // Handlers
  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  // Gets latest mails
  const hookEmails = (event) => {
    event.preventDefault()
    codesService.getLatest().then(currents => setLatest(currents))
  }


  return (
    <div style={contentStyle}>
      <h1>Códigos de ChatGPT</h1>
      <form onSubmit={hookEmails}>
        <input style={inputStyle} placeholder='Ingresa tu correo aquí' value={email} onChange={handleEmailChange}/>
        <button style={buttonStyle} type='submit'>Enviar</button>
      </form>

      <Content latest={latest} email={email}/>
    </div>
  )
}

export default App