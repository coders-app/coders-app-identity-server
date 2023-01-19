const createRegisterEmail = (name: string, activationKey: string) => ({
  subject: `Welcome to Coders App, ${name}. Please activate your account`,
  text: `Hello ${name},\n\nWelcome to Coders App.\n\nYou need to set a password to activate your account.\n\nHere's your activation key: ${activationKey}\n\nYour activation key expires in 24 hours.`,
});

export default createRegisterEmail;
