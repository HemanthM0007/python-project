import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, useSupabase } from "../config/supabaseClient";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Default mock admin and user
const DEFAULT_MOCK_ADMIN = {
  email: "admin@infrasense.ai",
  password: "admin123",
  displayName: "Admin Controller",
  phoneNumber: "+1 (555) 019-9000",
  companyName: "InfraSense Global",
  role: "admin",
  address: "HQ Command Center, Sector 7G",
  photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=admin"
};

const DEFAULT_MOCK_USER = {
  email: "user@infrasense.ai",
  password: "user123",
  displayName: "Alex Rivera",
  phoneNumber: "+1 (555) 014-3021",
  companyName: "Apex Manufacturing Inc.",
  role: "user",
  address: "Building B4, Tech Park East",
  photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  sector: "" // Redirects to sector selection
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Auth state
  useEffect(() => {
    // Seed mock user database if not present
    if (!localStorage.getItem("infrasense_mock_users")) {
      localStorage.setItem("infrasense_mock_users", JSON.stringify([DEFAULT_MOCK_USER]));
    }
    
    if (useSupabase && supabase) {
      // 1. Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          fetchSupabaseProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      });

      // 2. Listen for auth state alterations
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          await fetchSupabaseProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local Mock Auth state initialization
      const loggedUser = localStorage.getItem("infrasense_current_user");
      if (loggedUser) {
        setUser(JSON.parse(loggedUser));
      }
      setLoading(false);
    }
  }, []);

  // Helper to retrieve user profile details from Supabase DB
  const fetchSupabaseProfile = async (supabaseUser) => {
    try {
      const { data: profile, error: err } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      if (err) throw err;

      const profileUser = {
        uid: supabaseUser.id,
        email: supabaseUser.email,
        displayName: profile?.display_name || supabaseUser.user_metadata?.displayName || supabaseUser.email.split("@")[0],
        phoneNumber: profile?.phone_number || supabaseUser.user_metadata?.phoneNumber || "",
        companyName: profile?.company_name || "Industrial Corp",
        address: profile?.address || "",
        photoURL: profile?.photo_url || supabaseUser.user_metadata?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`,
        role: profile?.role || "user",
        sector: profile?.sector || ""
      };

      setUser(profileUser);
      localStorage.setItem("infrasense_current_user", JSON.stringify(profileUser));
    } catch (err) {
      console.error("❌ Error fetching Supabase profile:", err.message);
      // Fallback if profile trigger failed
      setUser({
        uid: supabaseUser.id,
        email: supabaseUser.email,
        displayName: supabaseUser.user_metadata?.displayName || supabaseUser.email.split("@")[0],
        phoneNumber: supabaseUser.user_metadata?.phoneNumber || "",
        companyName: "Industrial Corp",
        address: "",
        photoURL: supabaseUser.user_metadata?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`,
        role: "user",
        sector: ""
      });
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password, phone) => {
    setError(null);
    setLoading(true);
    try {
      if (useSupabase && supabase) {
        // 1. Sign up user in Supabase Auth (passes metadata options for postgres trigger profile population)
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              displayName: username,
              phoneNumber: phone,
              companyName: "Enter Company Name",
              role: "user",
              sector: ""
            }
          }
        });

        if (err) throw err;
        setLoading(false);
        return true;
      } else {
        // Local Mock Auth registration
        const mockUsers = JSON.parse(localStorage.getItem("infrasense_mock_users") || "[]");
        
        if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error("Email already registered");
        }

        const newUser = {
          uid: "mock_" + Math.random().toString(36).substr(2, 9),
          email: email.toLowerCase(),
          password: password,
          displayName: username,
          phoneNumber: phone,
          companyName: "Enter Company Name",
          role: "user",
          address: "Enter Address",
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          sector: ""
        };

        mockUsers.push(newUser);
        localStorage.setItem("infrasense_mock_users", JSON.stringify(mockUsers));

        // Save profile locally
        localStorage.setItem(`infrasense_profile_${newUser.uid}`, JSON.stringify({
          displayName: newUser.displayName,
          phoneNumber: newUser.phoneNumber,
          companyName: newUser.companyName,
          address: newUser.address,
          sector: ""
        }));

        setLoading(false);
        return true;
      }
    } catch (err) {
      setError(err.message || "Registration failed");
      setLoading(false);
      throw err;
    }
  };

  // Login function
  const login = async (email, password, isAdmin = false) => {
    setError(null);
    setLoading(true);
    try {
      if (useSupabase && supabase) {
        // Sign in via Supabase
        const { data: authData, error: err } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (err) throw err;

        // Fetch User profile to check role constraints
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (profileErr) throw profileErr;

        // Verify Admin role requirements
        if (isAdmin && profile?.role !== "admin") {
          await supabase.auth.signOut();
          throw new Error("Access Denied: Only authorized systems administrators can access this terminal.");
        }

        const loggedInUser = {
          uid: authData.user.id,
          email: authData.user.email,
          displayName: profile?.display_name || authData.user.user_metadata?.displayName || authData.user.email.split("@")[0],
          phoneNumber: profile?.phone_number || "",
          companyName: profile?.company_name || "Industrial Corp",
          address: profile?.address || "",
          photoURL: profile?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`,
          role: profile?.role || "user",
          sector: profile?.sector || ""
        };

        setUser(loggedInUser);
        localStorage.setItem("infrasense_current_user", JSON.stringify(loggedInUser));
        setLoading(false);
        return loggedInUser;
      } else {
        // Local Mock Auth login
        const emailLower = email.toLowerCase();
        
        if (isAdmin) {
          if (emailLower === DEFAULT_MOCK_ADMIN.email && password === DEFAULT_MOCK_ADMIN.password) {
            const adminUser = { ...DEFAULT_MOCK_ADMIN };
            delete adminUser.password;
            
            setUser(adminUser);
            localStorage.setItem("infrasense_current_user", JSON.stringify(adminUser));
            setLoading(false);
            return adminUser;
          } else {
            throw new Error("Invalid admin credentials");
          }
        } else {
          const mockUsers = JSON.parse(localStorage.getItem("infrasense_mock_users") || "[]");
          const foundUser = mockUsers.find(u => u.email.toLowerCase() === emailLower && u.password === password);

          if (foundUser) {
            const userCopy = { ...foundUser };
            delete userCopy.password;
            
            const updatedProfile = localStorage.getItem(`infrasense_profile_${userCopy.uid}`);
            if (updatedProfile) {
              const profile = JSON.parse(updatedProfile);
              userCopy.displayName = profile.displayName || userCopy.displayName;
              userCopy.phoneNumber = profile.phoneNumber || userCopy.phoneNumber;
              userCopy.companyName = profile.companyName || userCopy.companyName;
              userCopy.address = profile.address || userCopy.address;
              userCopy.sector = profile.sector || userCopy.sector;
            }

            setUser(userCopy);
            localStorage.setItem("infrasense_current_user", JSON.stringify(userCopy));
            setLoading(false);
            return userCopy;
          } else {
            throw new Error("Invalid email or password");
          }
        }
      }
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      if (useSupabase && supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem("infrasense_current_user");
      setUser(null);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Logout failed");
      setLoading(false);
    }
  };

  // Save selected sector
  const saveSector = async (sectorName) => {
    if (!user) return;
    
    const updatedUser = { ...user, sector: sectorName };
    setUser(updatedUser);
    localStorage.setItem("infrasense_current_user", JSON.stringify(updatedUser));

    if (useSupabase && supabase) {
      try {
        const { error: err } = await supabase
          .from("profiles")
          .update({ sector: sectorName })
          .eq("id", user.uid);
        if (err) throw err;
      } catch (err) {
        console.error("❌ Failed to update sector in database:", err.message);
      }
    } else {
      // Local Mock updates
      const mockUsers = JSON.parse(localStorage.getItem("infrasense_mock_users") || "[]");
      const userIndex = mockUsers.findIndex(u => u.uid === user.uid);
      if (userIndex !== -1) {
        mockUsers[userIndex].sector = sectorName;
        localStorage.setItem("infrasense_mock_users", JSON.stringify(mockUsers));
      }
      
      const profile = localStorage.getItem(`infrasense_profile_${user.uid}`)
        ? JSON.parse(localStorage.getItem(`infrasense_profile_${user.uid}`))
        : {};
      profile.sector = sectorName;
      localStorage.setItem(`infrasense_profile_${user.uid}`, JSON.stringify(profile));
    }
  };

  // Update profile attributes
  const updateProfileData = async (profileDetails) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      displayName: profileDetails.displayName || user.displayName,
      phoneNumber: profileDetails.phoneNumber || user.phoneNumber,
      companyName: profileDetails.companyName || user.companyName,
      address: profileDetails.address || user.address,
      photoURL: profileDetails.photoURL || user.photoURL
    };
    
    setUser(updatedUser);
    localStorage.setItem("infrasense_current_user", JSON.stringify(updatedUser));

    if (useSupabase && supabase) {
      try {
        const { error: err } = await supabase
          .from("profiles")
          .update({
            display_name: updatedUser.displayName,
            phone_number: updatedUser.phoneNumber,
            company_name: updatedUser.companyName,
            address: updatedUser.address,
            photo_url: updatedUser.photoURL
          })
          .eq("id", user.uid);
        if (err) throw err;
      } catch (err) {
        console.error("❌ Failed to update profile in database:", err.message);
      }
    } else {
      // Save locally
      localStorage.setItem(`infrasense_profile_${user.uid}`, JSON.stringify({
        displayName: updatedUser.displayName,
        phoneNumber: updatedUser.phoneNumber,
        companyName: updatedUser.companyName,
        address: updatedUser.address,
        photoURL: updatedUser.photoURL,
        sector: updatedUser.sector
      }));

      // Update in mock users lists
      const mockUsers = JSON.parse(localStorage.getItem("infrasense_mock_users") || "[]");
      const userIndex = mockUsers.findIndex(u => u.uid === user.uid);
      if (userIndex !== -1) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          displayName: updatedUser.displayName,
          phoneNumber: updatedUser.phoneNumber,
          companyName: updatedUser.companyName,
          address: updatedUser.address,
          photoURL: updatedUser.photoURL
        };
        localStorage.setItem("infrasense_mock_users", JSON.stringify(mockUsers));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, saveSector, updateProfileData, useSupabase }}>
      {children}
    </AuthContext.Provider>
  );
};
