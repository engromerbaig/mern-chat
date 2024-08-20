// utils/rolePermissions.js

// Define role hierarchy with role numbers (1 being the highest role)
export const roleHierarchy = {
    "Super Admin": 1,
    "Manager": 2,
    "Agent": 3,
    "R&D Admin Role": 4,
    "R&D Role": 5,
    "FE Role": 6,
    "Staff Access Control Role": 7,
    "Closer Role": 8,
    "Team Lead Role": 9,
    "RNA Specialist Role": 10,
    "CB Specialist Role": 11,
    "Decline Specialist Role": 12
  };
  
  // Function to check if one role can initiate chat with another
  export const canInitiateChat = (initiatorRole, receiverRole) => {
    const initiatorRank = roleHierarchy[initiatorRole];
    const receiverRank = roleHierarchy[receiverRole];
  
    if (initiatorRank === undefined || receiverRank === undefined) {
      // If roles are not found in the hierarchy, deny permission
      return false;
    }
  
    // Super Admin (Role 1) can chat with anyone
    if (initiatorRank === 1) return true;
  
    // Manager (Role 2) can chat with Super Admin (Role 1) and all roles below (2-12)
    if (initiatorRank === 2) return receiverRank >= 1;
  
    // Agent (Role 3) can only chat with Managers (Role 2)
    if (initiatorRank === 3) return receiverRank === 2;
  
    // All other roles can chat with the next higher role and all roles below
    return receiverRank >= initiatorRank - 1;
  };
  