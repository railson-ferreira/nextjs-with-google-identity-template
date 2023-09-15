"use client"
import styles from './page.module.css'
import {signIn, signOut, useSession} from "next-auth/react";
import {useEffect} from "react";

export default function Home() {
    const session = useSession()

    function onSignInClick(event){
        event.preventDefault()
        signIn("google").finally()
    }
    function onSignOutClick(event){
        event.preventDefault()
        signOut({
            redirect: false,
        }).finally()
    }


    useEffect(()=>{
        console.log("session: ",session)
    },[session])

    return (
        <>
            <main className={styles.main}>
                <div>
                    {session?.status == "authenticated"?(
                        <button onClick={onSignOutClick}>
                            sign out
                        </button>
                    ):(
                        <a onClick={onSignInClick} href={"/api/auth/signin/google"}>
                            <img alt={"sign in with google button"} src={"/btn_google_signin_light_normal_web.png"}/>
                        </a>
                    )}
                    {session?.status == "authenticated" && (

                        // Profile Card UI Design Cool Hover Effect: https://codepen.io/FrankieDoodie/pen/NOJpVX
                        <div style={{
                            display: "block"
                        }}>
                            <br/>
                            <div className={styles.ourTeam}>
                                <div className={styles.picture}>
                                    <img alt="picture"
                                         src={session.data.user!.image!}/>
                                </div>
                                <div>
                                    <h3 >{session.data.user?.name}</h3>
                                    <br/>
                                    <span >AccessToken: </span>
                                    <h4>{session.data.accessToken}</h4>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </main>
            <footer className={styles.footer}>
                <a href="https://github.com/railson-ferreira/nextjs-with-google-identity-template">
                    <i className="fa fa-github" style={{
                        float: "left"
                    }}/>
                    <p style={{
                        paddingLeft: "10px",
                        float: "left"
                    }}>
                        GitHub
                    </p>
                </a>
            </footer>
        </>
    )
}
