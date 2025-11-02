import type { User } from '../types';

// NOTE: This is an insecure way to handle user data and is for demonstration purposes only.
// In a real application, never store passwords in plaintext or manage auth on the client-side.

const USERS_KEY = 'lay_lawn_users';

// Helper to get users from localStorage
const getUsers = (): (User & { password: string })[] => {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
};

// Helper to save users to localStorage
const saveUsers = (users: (User & { password: string })[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Self-invoking function to ensure admin exists on script load
(() => {
    const users = getUsers();
    const adminEmail = 'support@laylawn.com';
    const adminExists = users.some(user => user.email.toLowerCase() === adminEmail);

    if (!adminExists) {
        users.push({
            name: 'Admin',
            email: adminEmail,
            password: '06071990',
        });
        saveUsers(users);
    }
})();


export const signUp = (name: string, email: string, password: string): { success: boolean, message: string, user?: User } => {
    const users = getUsers();
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
        return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = { name, email, password };
    users.push(newUser);
    saveUsers(users);
    
    // Return user object without the password
    const { password: _, ...userToReturn } = newUser;

    return { success: true, message: 'Account created successfully!', user: userToReturn };
};

export const login = (email: string, password: string): { success: boolean, message: string, user?: User } => {
    const users = getUsers();
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return { success: false, message: 'No account found with this email.' };
    }

    if (user.password !== password) {
        return { success: false, message: 'Incorrect password.' };
    }

    // Return user object without the password
    const { password: _, ...userToReturn } = user;

    return { success: true, message: 'Logged in successfully!', user: userToReturn };
};