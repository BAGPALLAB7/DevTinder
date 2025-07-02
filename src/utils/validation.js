import validator from 'validator';

export const validateSignUpData = (data) => {
    const {firstName, lastName, email, password} = data.body
    if (!firstName || firstName.trim().length < 2) {
        throw new Error("First name must be at least 4 characters long");
    }
    if (!lastName || lastName.trim().length < 2) {
        throw new Error("Last name must be at least 4 characters long");
    }
    if (!email || !validator.isEmail(email)) {
        throw new Error("Invalid email format");
        
    }
    if (!password || !validator.isStrongPassword(password, { minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new Error("Password must be strong and at least 8 characters long with at least one uppercase letter, one number, and one symbol");
        
    }
}

