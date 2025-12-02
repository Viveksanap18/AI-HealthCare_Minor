import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Heart, Ruler, Weight, Trash2, Plus, Clock, Edit2, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  age: number | null;
  blood_group: string | null;
  height: number | null;
  weight: number | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  pincode: string | null;
  medical_conditions: string | null;
  allergies: string | null;
  medications: string | null;
  emergency_contact: string | null;
  emergency_contact_number: string | null;
}

interface MedicalHistory {
  id: string;
  disease_name: string;
  disease_date: string;
  recovery_date: string | null;
  severity: string | null;
  notes: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddDisease, setShowAddDisease] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    blood_group: "",
    height: "",
    weight: "",
    gender: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    medical_conditions: "",
    allergies: "",
    medications: "",
    emergency_contact: "",
    emergency_contact_number: "",
  });

  const [diseaseForm, setDiseaseForm] = useState({
    disease_name: "",
    disease_date: "",
    recovery_date: "",
    severity: "moderate",
    notes: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchProfile();
      fetchMedicalHistory();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await (supabase
        .from("user_profiles" as any)
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle() as any);

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        const profileData = data as UserProfile;
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || "",
          age: profileData.age?.toString() || "",
          blood_group: profileData.blood_group || "",
          height: profileData.height?.toString() || "",
          weight: profileData.weight?.toString() || "",
          gender: profileData.gender || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
          city: profileData.city || "",
          pincode: profileData.pincode || "",
          medical_conditions: profileData.medical_conditions || "",
          allergies: profileData.allergies || "",
          medications: profileData.medications || "",
          emergency_contact: profileData.emergency_contact || "",
          emergency_contact_number: profileData.emergency_contact_number || "",
        });
      } else {
        // Create initial profile
        const { data: newProfile, error: createError } = await (supabase
          .from("user_profiles" as any)
          .insert([
            {
              user_id: user.id,
              email: user.email,
              full_name: "",
            },
          ])
          .select()
          .single() as any);

        if (createError) throw createError;
        setProfile(newProfile as UserProfile);
        setIsEditing(true);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load profile",
      });
    }
  };

  const fetchMedicalHistory = async () => {
    if (!user) return;
    try {
      const { data, error } = await (supabase
        .from("user_medical_history" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("disease_date", { ascending: false }) as any);

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setMedicalHistory((data || []) as MedicalHistory[]);
    } catch (error: any) {
      console.error("Error fetching medical history:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const updateData = {
        full_name: formData.full_name || null,
        age: formData.age ? parseInt(formData.age) : null,
        blood_group: formData.blood_group || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        gender: formData.gender || null,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        pincode: formData.pincode || null,
        medical_conditions: formData.medical_conditions || null,
        allergies: formData.allergies || null,
        medications: formData.medications || null,
        emergency_contact: formData.emergency_contact || null,
        emergency_contact_number: formData.emergency_contact_number || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await (supabase
        .from("user_profiles" as any)
        .update(updateData)
        .eq("user_id", user.id)
        .select()
        .single() as any);

      if (error) throw error;

      setProfile(data as UserProfile);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDisease = async () => {
    if (!user) return;
    
    if (!diseaseForm.disease_name || !diseaseForm.disease_date) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in disease name and date",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await (supabase
        .from("user_medical_history" as any)
        .insert([
          {
            user_id: user.id,
            disease_name: diseaseForm.disease_name,
            disease_date: diseaseForm.disease_date,
            recovery_date: diseaseForm.recovery_date || null,
            severity: diseaseForm.severity,
            notes: diseaseForm.notes || null,
          },
        ])
        .select()
        .single() as any);

      if (error) throw error;

      setMedicalHistory([data as MedicalHistory, ...medicalHistory]);
      setDiseaseForm({
        disease_name: "",
        disease_date: "",
        recovery_date: "",
        severity: "moderate",
        notes: "",
      });
      setShowAddDisease(false);
      toast({
        title: "Success",
        description: "Disease record added successfully!",
      });
    } catch (error: any) {
      console.error("Error adding disease:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add disease record",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDisease = async (diseaseId: string) => {
    setLoading(true);
    try {
      const { error } = await (supabase
        .from("user_medical_history" as any)
        .delete()
        .eq("id", diseaseId) as any);

      if (error) throw error;

      setMedicalHistory(medicalHistory.filter((d) => d.id !== diseaseId));
      toast({
        title: "Success",
        description: "Disease record deleted successfully!",
      });
    } catch (error: any) {
      console.error("Error deleting disease:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete disease record",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Display Card */}
          {profile && !isEditing && (
            <>
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="flex items-center gap-3">
                    <User className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>User Profile</CardTitle>
                      <CardDescription>{profile.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-8">
                  {/* Name and Age Section */}
                  <div className="mb-8 pb-6 border-b">
                    <h3 className="text-lg font-bold mb-4 text-primary">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Full Name Card */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-sm">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Full Name</p>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{profile.full_name || "Not provided"}</p>
                      </div>

                      {/* Age Card */}
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 shadow-sm">
                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Age</p>
                        <p className="text-2xl font-bold text-gray-800 mt-2">{profile.age || "Not provided"} years</p>
                      </div>
                    </div>
                  </div>

                  {/* Health Metrics Section */}
                  <div className="mb-8 pb-6 border-b">
                    <h3 className="text-lg font-bold mb-4 text-primary flex items-center gap-2">
                      <Heart className="h-5 w-5" /> Health Metrics
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Blood Group Card */}
                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 shadow-sm border border-red-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Heart className="h-5 w-5 text-red-500" />
                          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Blood Group</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{profile.blood_group || "—"}</p>
                      </div>

                      {/* Height Card */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 shadow-sm border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Ruler className="h-5 w-5 text-blue-500" />
                          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Height</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                          {profile.height ? `${profile.height}` : "—"}
                          <span className="text-lg text-gray-600 ml-1">cm</span>
                        </p>
                      </div>

                      {/* Weight Card */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 shadow-sm border border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Weight className="h-5 w-5 text-purple-500" />
                          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Weight</p>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                          {profile.weight ? `${profile.weight}` : "—"}
                          <span className="text-lg text-gray-600 ml-1">kg</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8 pb-6 border-b">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Gender</p>
                      <p className="text-lg font-medium mt-2">{profile.gender || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Phone</p>
                      <p className="text-lg font-medium mt-2">{profile.phone || "Not provided"}</p>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="mb-8 pb-6 border-b">
                    <h3 className="text-lg font-bold mb-4 text-primary">Contact & Address</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-muted-foreground">Address</p>
                        <p className="text-lg font-medium mt-2">{profile.address || "Not provided"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-muted-foreground">City</p>
                        <p className="text-lg font-medium mt-2">{profile.city || "Not provided"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-muted-foreground">Pincode</p>
                        <p className="text-lg font-medium mt-2">{profile.pincode || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="mb-8 pb-6 border-b">
                    <h3 className="text-lg font-bold mb-4 text-primary">Medical Information</h3>
                    <div className="space-y-4">
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <p className="text-sm font-semibold text-orange-600">Medical Conditions</p>
                        <p className="text-lg font-medium mt-2">{profile.medical_conditions || "None"}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <p className="text-sm font-semibold text-red-600">Allergies</p>
                        <p className="text-lg font-medium mt-2">{profile.allergies || "None"}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm font-semibold text-blue-600">Current Medications</p>
                        <p className="text-lg font-medium mt-2">{profile.medications || "None"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 text-primary">Emergency Contact</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                        <p className="text-sm font-semibold text-red-600 uppercase">Emergency Contact Name</p>
                        <p className="text-xl font-bold text-gray-800 mt-3">{profile.emergency_contact || "Not provided"}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                        <p className="text-sm font-semibold text-red-600 uppercase">Emergency Contact Number</p>
                        <p className="text-xl font-bold text-gray-800 mt-3">{profile.emergency_contact_number || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => setIsEditing(true)} className="w-full mt-6 bg-primary hover:bg-primary/90 py-6 text-lg font-semibold rounded-lg transition-all duration-200 hover:shadow-lg">
                    ✏️ Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Edit Form */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your health and personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      placeholder="John Doe"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      min="1"
                      max="150"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-2">
                    <Label htmlFor="blood-group">Blood Group</Label>
                    <Select value={formData.blood_group} onValueChange={(value) =>
                      setFormData({ ...formData, blood_group: value })
                    }>
                      <SelectTrigger id="blood-group">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Height */}
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      step="0.1"
                      min="1"
                      max="300"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      step="0.1"
                      min="1"
                      max="500"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  {/* Pincode */}
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="400001"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-2">
                    <Label htmlFor="emergency-contact">Emergency Contact Name</Label>
                    <Input
                      id="emergency-contact"
                      placeholder="Jane Doe"
                      value={formData.emergency_contact}
                      onChange={(e) =>
                        setFormData({ ...formData, emergency_contact: e.target.value })
                      }
                    />
                  </div>

                  {/* Emergency Contact Number */}
                  <div className="space-y-2">
                    <Label htmlFor="emergency-contact-number">Emergency Contact Number</Label>
                    <Input
                      id="emergency-contact-number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.emergency_contact_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contact_number: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                {/* Medical Conditions */}
                <div className="space-y-2">
                  <Label htmlFor="medical-conditions">Medical Conditions</Label>
                  <Textarea
                    id="medical-conditions"
                    placeholder="e.g., Diabetes, Hypertension"
                    value={formData.medical_conditions}
                    onChange={(e) =>
                      setFormData({ ...formData, medical_conditions: e.target.value })
                    }
                  />
                </div>

                {/* Allergies */}
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    placeholder="e.g., Penicillin, Peanuts"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  />
                </div>

                {/* Current Medications */}
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    placeholder="e.g., Aspirin 500mg daily"
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Profile"
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medical History Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Medical History
                </CardTitle>
                <CardDescription>Record of past diseases and conditions</CardDescription>
              </div>
              <Dialog open={showAddDisease} onOpenChange={setShowAddDisease}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Disease
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Disease Record</DialogTitle>
                    <DialogDescription>
                      Record a past or current disease you have experienced
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="disease-name">Disease Name</Label>
                      <Input
                        id="disease-name"
                        placeholder="e.g., COVID-19, Flu"
                        value={diseaseForm.disease_name}
                        onChange={(e) =>
                          setDiseaseForm({ ...diseaseForm, disease_name: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="disease-date">Date of Diagnosis</Label>
                      <Input
                        id="disease-date"
                        type="date"
                        value={diseaseForm.disease_date}
                        onChange={(e) =>
                          setDiseaseForm({ ...diseaseForm, disease_date: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recovery-date">Recovery Date (Optional)</Label>
                      <Input
                        id="recovery-date"
                        type="date"
                        value={diseaseForm.recovery_date}
                        onChange={(e) =>
                          setDiseaseForm({ ...diseaseForm, recovery_date: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="severity">Severity</Label>
                      <Select value={diseaseForm.severity} onValueChange={(value) =>
                        setDiseaseForm({ ...diseaseForm, severity: value })
                      }>
                        <SelectTrigger id="severity">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional details about the disease..."
                        value={diseaseForm.notes}
                        onChange={(e) =>
                          setDiseaseForm({ ...diseaseForm, notes: e.target.value })
                        }
                      />
                    </div>

                    <Button onClick={handleAddDisease} disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Disease Record"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent>
              {medicalHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No medical history recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {medicalHistory.map((disease) => (
                    <div
                      key={disease.id}
                      className="p-4 border rounded-lg space-y-2 bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{disease.disease_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Diagnosis Date: {new Date(disease.disease_date).toLocaleDateString()}
                          </p>
                          {disease.recovery_date && (
                            <p className="text-sm text-muted-foreground">
                              Recovery Date: {new Date(disease.recovery_date).toLocaleDateString()}
                            </p>
                          )}
                          {disease.severity && (
                            <p className="text-sm">
                              <span className="font-semibold">Severity:</span>{" "}
                              <span
                                className={`capitalize px-2 py-1 rounded text-xs ${
                                  disease.severity === "mild"
                                    ? "bg-green-100 text-green-800"
                                    : disease.severity === "moderate"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : disease.severity === "severe"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {disease.severity}
                              </span>
                            </p>
                          )}
                          {disease.notes && (
                            <p className="text-sm mt-2 text-muted-foreground italic">
                              Notes: {disease.notes}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleDeleteDisease(disease.id)}
                          variant="ghost"
                          size="sm"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
