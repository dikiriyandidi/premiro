'use stricts'
module.exports = (name, value, pass) => {
    if (value !== pass) 
    {
        return "confirm password must be same with password";
    }
    return "";
}