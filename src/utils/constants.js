export const ROLES = {
    ADMIN: 'ADMIN',
    DRIVER: 'DRIVER',
    CUSTOMER: 'CUSTOMER',
};

export const API_URLS = {
    AUTH: {
        LOGIN: '/login', // Adjust based on actual backend controller path if usually /api/auth/login or just /login
        SIGNUP_CUSTOMER: '/signup/customer', // Heuristic based on request but backend usually has specific endpoints
        SIGNUP_DRIVER: '/signup/driver' // Heuristic
    }
};
// Note: User prompt implied Login/Signup pages, but endpoints were not explicitly listed for Auth in the top description except logic flow.
// However, the roles section lists GET /customer/me etc.
// I'll assume standard /auth perhaps or root.
// The list says: GET /customer/me, no /auth prefix mentioned.
// So likely http://localhost:8080/login ? Or http://localhost:8080/auth/login?
// I'll stick to relative paths and adjust if needed.
