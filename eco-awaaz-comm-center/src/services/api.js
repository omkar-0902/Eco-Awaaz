const BASE_URL = 'https://eco-awaaz.onrender.com';

/**
 * Registers a new administrator.
 * @param {Object} adminData - The administrator data.
 * @param {string} adminData.adminId - Unique ID for the admin.
 * @param {string} adminData.adminName - Name of the admin.
 * @param {string} adminData.password - Admin password.
 * @param {string} adminData.role - Admin role (e.g., 'water', 'electric', 'waste').
 * @returns {Promise<Object>} The response from the server.
 */
export const registerAdmin = async (adminData) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });

    if (!response.ok) {
      // Try to parse error message if available
      const errorText = await response.text();
      let errorMessage = 'Registration failed';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during admin registration:', error);
    throw error;
  }
};
