export const isEmpty = Value => {

    if (!Value) {
        return true
    } else {
        return false
    };

};

export const isValid = Email => {

    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(Email);

};

export const isLength = Password => {

    if (Password.length < 8) {
        return true
    } else {
        return false
    };

};

export const isMatch = (Password, ConfirmPassword) => {

    if (Password === ConfirmPassword) {
        return true
    } else {
        return false
    };

};