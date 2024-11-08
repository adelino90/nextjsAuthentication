'use client'

import '@/app/globals.css'
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { login, signUp,auth } from '@/actions/auth-action';
import styles from './auth-form.module.css'

export default function AuthForm({mode}) {
  const [formState, formAction] = mode === 'signup' ? useFormState(signUp, {}) : useFormState(login, {});
  //const [formState, formAction] =  useFormState(auth.bind(null,mode), {});
  //console.log(mode)
  return (
    <form id="auth-form" action={formAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
     
        {formState.errors && (
          <ul id = "form-errors">
            {Object.keys(formState.errors).map((error)=>
            (<li key={error}>
              {formState.errors[error]}
            </li>)
            )
            }
          </ul>
        )}
      <p>
        <button type="submit" className={mode === 'signup' ? styles.register : styles.login}>
          {mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </p>
      <p>
        {mode === 'login' &&<Link href="/?mode=signup">Create an Account.</Link>}
        {mode === 'signup' &&<Link href="/?mode=login">Login with existing account.</Link>}
      </p>
    </form>
  );


}
