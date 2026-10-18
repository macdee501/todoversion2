
import { useSignUp } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";

export function useAppSignUp() {
  const { signUp, fetchStatus } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const [pendingVerification, setPendingVerification] =
    useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loading = busy || fetchStatus === "fetching";

  // STEP 1: Register account
  const handleSignUp = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    setBusy(true);

    try {
      const { error } = await signUp.password({
        emailAddress: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // STEP 2: Send email verification code
      const { error: sendError } =
        await signUp.verifications.sendEmailCode();

      if (sendError) {
        setErrorMessage(sendError.message);
        return;
      }

      setPendingVerification(true);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to sign up. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  // STEP 3: Verify code
  const handleVerify = async () => {
    if (!code.trim()) {
      setErrorMessage("Please enter your verification code.");
      return;
    }

    setErrorMessage("");
    setBusy(true);

    try {
      const { error } =
        await signUp.verifications.verifyEmailCode({
          code: code.trim(),
        });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (signUp.status !== "complete") {
        setErrorMessage(
          "Additional verification is required."
        );
        return;
      }

      // STEP 4: Activate session
      const { error: finalizeError } = await signUp.finalize({
        navigate: ({ session }) => {
          if (session?.currentTask) {
            setErrorMessage(
              "Additional account setup is required."
            );
            return;
          }

          router.replace("/(tabs)");
        },
      });

      if (finalizeError) {
        setErrorMessage(finalizeError.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Verification failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  // Resend verification code
  const resendCode = async () => {
    setErrorMessage("");
    setBusy(true);

    try {
      const { error } =
        await signUp.verifications.sendEmailCode();

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not resend the code.");
    } finally {
      setBusy(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    code,
    setCode,
    pendingVerification,
    errorMessage,
    loading,
    handleSignUp,
    handleVerify,
    resendCode,
  };
}
