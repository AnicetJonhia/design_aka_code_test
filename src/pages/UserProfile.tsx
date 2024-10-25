import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserRound } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import useUserStore from "@/stores/userStore.ts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast.ts";
import {Toaster} from "@/components/ui/toaster.tsx";
import {CloudDownload} from "lucide-react";

const UserProfile: React.FC = () => {
  const { user, fetchUserProfile, updateUserProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  }

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    bio: "",
    website: "",
    role: "",
    date_of_birth: "",
    alternate_email: "",
    linkedin: "",
    profile_picture: null as string | File | null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      await fetchUserProfile();
    };
    fetchProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profile_picture: e.target.files[0] });
    }
  };

  const handleFileSave = async () => {
    if (formData.profile_picture instanceof File) {
      const updatedData = new FormData();
      updatedData.append('profile_picture', formData.profile_picture);

      try {
        await updateUserProfile(updatedData);
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: "Profile picture updated successfully.",

        });
      } catch (error) {
        console.error('Failed to update profile picture:', error);
        toast({
          title: "Error",
          description: "Failed to update profile picture. Please try again.",

        });
      }
    }
  }

  useEffect(() => {
    return () => {
      if (formData.profile_picture instanceof File) {
        URL.revokeObjectURL(formData.profile_picture);
      }
    };
  }, [formData.profile_picture]);

  const handleSave = async () => {
    if (formData.username && formData.email) {
      const updatedData = new FormData();
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof typeof formData];
        if (value !== null) {
          if (key === 'profile_picture' && value instanceof File) {
            updatedData.append(key, value);
          } else if (key !== 'profile_picture') {
            updatedData.append(key, value as string);
          }
        }
      });

      try {
        await updateUserProfile(updatedData);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully.",

        });
      } catch (error) {
        console.error('Failed to update profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",

        });
      }
    } else {
      console.error('Validation failed: Missing required fields');
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",

      });
    }
  };

  return (
    <div>
      <div className="px-4 space-y-6 md:px-6 mt-2">
        <header className="space-y-1.5">
          <div className="flex items-center space-x-4" onClick={handleOpenDialog}>
            {formData.profile_picture ? (
              <img
                src={formData.profile_picture instanceof File ? URL.createObjectURL(formData.profile_picture) : formData.profile_picture}
                alt="you"
                className="w-24 h-24 border rounded-full object-cover cursor-pointer"
              />
            ) : (
              <UserRound className="w-24 h-24 border rounded-full" />
            )}
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold">
                {formData.username || "You"}
              </h1>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })} disabled={!isEditing}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pro">Producer</SelectItem>
                    <SelectItem value="Col">Collector</SelectItem>
                    <SelectItem value="Con">Consumer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="alternate_email">Alternate Email</Label>
                <Input
                  id="alternate_email"
                  type="email"
                  value={formData.alternate_email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Bio and Website</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  className="resize-none p-2 border rounded"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="text"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-x-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleEditToggle}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </>
          ) : (
            <Button size="lg" onClick={handleEditToggle}>
              Edit
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change your profile picture</DialogTitle>
          </DialogHeader>
          <img
            src={
              formData.profile_picture instanceof File
                ? URL.createObjectURL(formData.profile_picture)
                : formData.profile_picture
            }
            alt="Profile"
            className="w-full h-full object-cover rounded-tl-lg rounded-tr-lg"
          />


        <div className="mt-4 flex flex-col items-start space-y-2">
          <Label
            htmlFor="profile_picture"
            className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground space-x-2"
          >
            <CloudDownload />
            <span>Choose a new profile picture</span>
          </Label>

          <Input
            id="profile_picture"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

          <div className="flex w-full justify-end mt-4">
              {formData.profile_picture && (
                <Button onClick={handleFileSave}>Save</Button>
              )}
          </div>
        </DialogContent>

      </Dialog>


      <Toaster/>
    </div>
  );
};

export default UserProfile;