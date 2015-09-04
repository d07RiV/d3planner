_L.add({
  account: {
    options: {
      buttons: {
        cancel: "$Account/Cancel$",
        update: "$Account/Update$",
      },
      fields: {
        email: "$Account/E-mail$",
        password: "$Account/Password$",
        password_old: "$Account/Current password$",
        password_repeat: "$Account/Repeat password$",
      },
      tip: "$Account/Leave new password blank if you don't want to change it$",
      title: "$Account/Account settings$",
    },
    recover: {
      buttons: {
        already: "$Account/Already have code?$",
        cancel: "$Account/Cancel$",
        recover: "$Account/Send link$",
      },
      fields: {
        email: "$Account/E-mail$",
      },
      tip: "$Account/Enter your registered e-mail to receive a password reset link$",
      title: "$Account/Recover password$",
    },
    register: {
      buttons: {
        cancel: "$Account/Cancel$",
        register: "$Account/Register$",
      },
      fields: {
        email: "$Account/E-mail (optional, for recovery)$",
        name: "$Account/Name$",
        password: "$Account/Password$",
        password_repeat: "$Account/Repeat password$",
        remember: "$Account/Remember me$",
      },
      tip: "$Account/Register to use a personal stash and manage profiles.$",
      title: "$Account/Register$",
    },
    reset: {
      buttons: {
        cancel: "$Account/Cancel$",
        reset: "$Account/Reset$",
      },
      fields: {
        password: "$Account/Password$",
        password_repeat: "$Account/Repeat password$",
        remember: "$Account/Remember me$",
        reset_code: "$Account/Reset code$",
      },
      tip: "$Account/Enter the code you received in your e-mail to reset your password$",
      title: "$Account/Reset password$",
    },
    signin: {
      buttons: {
        cancel: "$Account/Cancel$",
        lostpassword: "$Account/Lost password?$",
        signin: "$Account/Sign in$",
      },
      fields: {
        name: "$Account/Name$",
        password: "$Account/Password$",
        remember: "$Account/Remember me$",
      },
      tip: "$Account/Sign in to access stash and manage profiles.$",
      title: "$Account/Sign in$",
    },
  },
});
