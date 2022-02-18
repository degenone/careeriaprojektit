const UserStatus = (() => {
    var username = '';
    var loggedInStatus = false;

    const setUsername = (name) => {
        username = name;
    };

    const getUsername = () => username;

    const logUserIn = (name) => {
        setUsername(name);
        loggedInStatus = true;
    }

    const logUserOut = () => {
        loggedInStatus = false;
    }

    const getUserStatus = () => loggedInStatus;

    return {
        setUsername: setUsername,
        getUsername: getUsername,
        getUserStatus: getUserStatus,
        logUserIn: logUserIn,
        logUserOut: logUserOut
    };
})();

export default UserStatus;