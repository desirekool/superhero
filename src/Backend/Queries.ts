export const BE_signUp = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
};
export const BE_signIn = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
};
export const BE_signOut = () => {
    return auth.signOut();
};
export const BE_getUser = () => {
    return auth.currentUser;
};
export const BE_getUsers = () => {
    return db.collection('users').get();
};
export const BE_getUserById = (id) => {
    return db.collection('users').doc(id).get();
};
export const BE_getUserByEmail = (email) => {
    return db.collection('users').where('email', '==', email).get();
};
export const BE_addUser = (user) => {
    return db.collection('users').add(user);
};