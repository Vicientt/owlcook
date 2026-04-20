import { useState } from "react";
import { Mail, LogOut, Lock, Pencil } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import profileService from "../services/user"
import authService from "../services/auth"
import { useNavigate, useOutletContext } from 'react-router'
export default function Profile() {
  const user_data = useOutletContext()
  const navigate = useNavigate()
  const [name, setName] = useState(user_data.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(name);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleSaveName = async () => {
    if (editNameValue.trim()) {
      setName(editNameValue.trim());
      await profileService.update({ name: editNameValue })
      setIsEditingName(false);
    }
  };

  const handleCancelEditName = () => {
    setEditNameValue(name);
    setIsEditingName(false);
  };

  const handleUpdatePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!oldPassword || !newPassword) {
      setPasswordError("Please fill in both fields");
      return;
    }
    try {
      await profileService.update({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setPasswordSuccess("Password updated successfully!");
    } catch (error) {
      setPasswordError(error.response?.data?.error || "Something went wrong");
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (e) {
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6FC] via-[#F0FDFA] to-[#FFFBEB]">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl mb-2" style={{ fontWeight: 800 }}>Profile Settings</h1>
          <p className="text-gray-600">Manage your account</p>
        </div>

        <div className="space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl mb-4" style={{ fontWeight: 700 }}>Personal Information</h2>
            
            <div className="space-y-4">
              {/* Name with inline edit button */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Full Name</label>
                <div className="flex items-center gap-3">
                  {isEditingName ? (
                    <>
                      <Input
                        value={editNameValue}
                        onChange={(event) => setEditNameValue(event.target.value)}
                        className="flex-1 h-12 rounded-xl border-2 border-gray-200 focus:border-[#432C91] bg-white"
                        autoFocus
                      />
                      <Button 
                        onClick={handleSaveName}
                        className="h-12 px-4 rounded-xl bg-[#432C91] hover:bg-[#362470] text-white"
                        style={{ fontWeight: 700 }}
                      >
                        Save
                      </Button>
                      <Button 
                        onClick={handleCancelEditName}
                        className="h-12 px-4 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                        style={{ fontWeight: 600 }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-lg" style={{ fontWeight: 600 }}>{name}</span>
                      <Button 
                        onClick={() => {
                          setEditNameValue(name);
                          setIsEditingName(true);
                        }}
                        className="h-9 w-9 rounded-lg bg-transparent hover:bg-purple-50"
                      >
                        <Pencil className="w-4 h-4 text-[#432C91]" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Email - read only */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={user_data.email}
                    readOnly
                    className="pl-12 h-12 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-[#432C91]" />
              <h2 className="text-xl" style={{ fontWeight: 700 }}>Change Password</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Current Password</label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#432C91] bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">New Password</label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#432C91] bg-white"
                />
              </div>
              <Button 
                onClick={handleUpdatePassword}
                className="h-12 px-6 rounded-xl bg-[#432C91] hover:bg-[#362470] text-white"
                style={{ fontWeight: 700 }}
              >
                Update Password
              </Button>
              {passwordError && (
                <p className="text-red-600 text-sm mt-2">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-green-600 text-sm mt-2">{passwordSuccess}</p>
              )}
            </div>
          </div>

          {/* Account Actions - Log Out only */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl mb-4" style={{ fontWeight: 700 }}>Account</h2>
            <Button 
              className="w-full h-12 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 gap-2"
              style={{ fontWeight: 600 }}
              onClick = {handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
