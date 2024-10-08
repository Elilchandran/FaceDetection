import React from 'react'

const SignIn= ({onRouteChange})=> {
  return (
    <article className="br3 ba --black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
<main className="pa4 black-80">
    <div className="measure">
    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">

            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
            <form>   
        <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" autoComplete="current-password" type="email" name="email-address"  id="email-address"/>
        </div>

        <div className="mv3">
            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" autoComplete="current-password" type="password" name="password"  id="password"/>
        </div>
        </form>
            {/* <label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox"/> Remember me</label> */}
    

        <div className="">
            <input
            onClick={()=>onRouteChange ('home')}
             className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
             type="submit" 
             value="Sign in"
            
             />
        </div>

        <div className="1h-copy mt3">
            <p onClick={()=>onRouteChange ('Register')} className="f6 link dim black db pointer">New Register</p>
            {/* <a href="#0" className="f6 link dim black db">htmlForgot your password?</a> */}
        </div>
        </fieldset>
    </div>
</main>
</article>
  )
}

export default SignIn