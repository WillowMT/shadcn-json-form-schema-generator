import bcrypt from 'bcrypt'

export async function hashPassword(plainPassword:string) {
    const saltRounds = 10;
    try {
        const hash = await bcrypt.hash(plainPassword, saltRounds);
        return hash;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

// Function to verify a password
export async function verifyPassword(plainPassword:string, storedHash:string) {
    try {
        const match = await bcrypt.compare(plainPassword, storedHash);
        return match; // true if match, false otherwise
    } catch (error) {
        console.error('Error verifying password:', error);
        throw error;
    }
}