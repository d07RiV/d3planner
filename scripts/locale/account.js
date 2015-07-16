_L.add({
  account: {
    register: {
      fields: {
        name: "Name",
        email: "E-mail (optional, for recovery)",
        password: "Password",
        password_repeat: "Repeat password",
        remember: "Remember me",
      },
      title: "Register",
      tip: "Register to use a personal stash and manage profiles.",
      buttons: {
        register: "Register",
        cancel: "Cancel",
      },
    },
    signin: {
      fields: {
        name: "Name",
        password: "Password",
        remember: "Remember me",
      },
      title: "Sign in",
      tip: "Sign in to access stash and manage profiles.",
      buttons: {
        signin: "Sign in",
        cancel: "Cancel",
        lostpassword: "Lost password?",
      },
    },
    recover: {
      fields: {
        email: "E-mail",
      },
      title: "Recover password",
      tip: "Enter your registered e-mail to receive a password reset link",
      buttons: {
        recover: "Send link",
        cancel: "Cancel",
        already: "Already have code?",
      },
    },
    reset: {
      fields: {
        reset_code: "Reset code",
        password: "Password",
        password_repeat: "Repeat password",
        remember: "Remember me",
      },
      title: "Reset password",
      tip: "Enter the code you received in your e-mail to reset your password",
      buttons: {
        reset: "Reset",
        cancel: "Cancel",
      },
    },
    options: {
      fields: {
        password_old: "Current password",
        email: "E-mail",
        password: "Password",
        password_repeat: "Repeat password",
      },
      title: "Account settings",
      tip: "Leave new password blank if you don't want to change it",
      buttons: {
        update: "Update",
        cancel: "Cancel",
      },
    },
  },
});
