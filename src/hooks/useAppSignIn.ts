import { useSignIn } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";


export function useAppSignIn()
{
    const {signIn,fetchStatus} = useSignIn();

    // Form State
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [code,setCode] = useState('');
    const [errorMessage,setErrorMessage] = useState('');

    const loading = fetchStatus === "fetching";
    const needsVerification = signIn.status === "needs_client_trust";

    // Complete authentication and activate session
    const finishSignIn = async ()=>{
        await signIn.finalize({
            navigate:({session}) =>{
                if(session?.currentTask)
                {
                    setErrorMessage("Additional account setup is required");
                    return
                }
                router.replace("/(tabs)")
            }
        
        })
    }

    // Handle email login

    const handleSignIn = async ()=>{
        if(!email.trim()|| !password)
        {
            setErrorMessage("Please enter email and password.");
            return;
        }

        setErrorMessage("")

        try{
            const {error} = await signIn.password({
                emailAddress:email.trim(),
                password
            });

            if(error){
                setErrorMessage(error.message);
                return;
            }

            if(signIn.status == "complete")
            {
                await finishSignIn();

            }
            else if(signIn.status === "needs_client_trust")
            {
                const emailFactor = signIn.supportedSecondFactors.find(
                    (factor)=> factor.strategy === "email_code")

                    if(emailFactor){
                        const result = await signIn.mfa.sendEmailCode();

                        if(result.error)
                        {
                            setErrorMessage(result.error.message)
                        }
                    }
                    else
                    {
                        setErrorMessage("Another verification method is required")
                    }

            }
            else if(signIn.status === "needs_second_factor")
            {
                setErrorMessage("Multi-factor authentication is required")
            }
            else
            {
                setErrorMessage("Sign In is Not Complete")
            }
        }
        catch(error)
        {
            console.error(error);
            setErrorMessage("Something Went Wrong")
        }
    };

    // Handle device trust and verificiation
    const handleVerify = async ()=>{
        if(code.trim())
        {
            setErrorMessage("Enter the verification code")
            return;
        }

        setErrorMessage('');

        try{
            const {error} = await signIn.mfa.verifyEmailCode({
                code: code.trim(),
            });

            if(error)
            {
                setErrorMessage(error.message);
                return;
            }

            if(signIn.status === 'complete')
            {
                await finishSignIn();
            }
        }
        catch(error)
        {
            console.error(error);
            setErrorMessage("Verification failed")
        }
    }

    return{
        email,setEmail,password,setPassword,code,setCode,errorMessage,loading,needsVerification,handleSignIn,handleVerify
    }


}