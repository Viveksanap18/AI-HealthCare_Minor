import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DiseaseAlertCard } from "@/components/DiseaseAlertCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MessageSquare, Shield, Database, Activity, Search, MapPin } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [pincode, setPincode] = useState("");
  const [pincodeAlerts, setPincodeAlerts] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchRecentAlerts();
  }, []);

  const fetchRecentAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("disease_data")
        .select("*")
        .order("date", { ascending: false })
        .limit(6);

      if (error) throw error;
      setRecentAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const searchByPincode = async () => {
    if (!pincode.trim()) {
      toast.error("Please enter a pincode");
      return;
    }
    
    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const { data, error } = await supabase
        .from("disease_data")
        .select("*")
        .eq("pincode", pincode.trim())
        .order("date", { ascending: false });

      if (error) throw error;
      
      setPincodeAlerts(data || []);
      
      if (data && data.length > 0) {
        toast.success(`Found ${data.length} alert(s) for pincode ${pincode}`);
      } else {
        toast.info("No disease outbreaks reported in your area. Stay safe!");
      }
    } catch (error) {
      console.error("Error searching by pincode:", error);
      toast.error("Failed to fetch alerts");
    } finally {
      setIsSearching(false);
    }
  };

  const handleChatClick = () => {
    if (!user) {
      toast.info("Please sign in to access the chatbot");
      navigate("/auth");
    } else {
      navigate("/chatbot");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center">
          <Activity className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI-Driven Public Health Awareness
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stay informed about regional disease outbreaks with our intelligent chatbot.
            Get real-time health advisories and expert guidance.
          </p>
          
          {/* Pincode Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter your 6-digit pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchByPincode()}
                  className="pl-10"
                  maxLength={6}
                />
              </div>
              <Button onClick={searchByPincode} disabled={isSearching}>
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? "Searching..." : "Check Alerts"}
              </Button>
            </div>
          </div>
          
          <Button size="lg" onClick={handleChatClick} className="text-lg px-8">
            <MessageSquare className="mr-2 h-5 w-5" />
            {user ? "Chat Now" : "Sign In to Chat"}
          </Button>
        </div>
      </section>

      {/* Pincode Alerts Section */}
      {hasSearched && (
        <section className="py-12 px-4 bg-primary/5 border-y border-primary/20">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Alerts for Pincode: {pincode}
            </h2>
            {pincodeAlerts.length > 0 ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pincodeAlerts.map((alert) => (
                    <DiseaseAlertCard
                      key={alert.id}
                      pincode={alert.pincode}
                      diseaseName={alert.disease_name}
                      cases={alert.cases}
                      date={alert.date}
                      advice={alert.advice}
                    />
                  ))}
                </div>
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-amber-700">
                      <span className="font-semibold">Disclaimer:</span> The alerts and data provided are based on available information. We are not 100% accurate. For medical concerns or accurate health advice, please contact your doctor.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="max-w-lg mx-auto">
                <CardContent className="py-8 text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p className="text-lg font-medium text-green-600">No outbreaks reported!</p>
                  <p className="text-muted-foreground mt-2">
                    Your area is currently safe. Continue following good hygiene practices.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mb-4" />
                <CardTitle>AI Health Chatbot</CardTitle>
                <CardDescription>
                  Ask health-related questions and get instant, accurate responses powered by AI
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Database className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Regional Data</CardTitle>
                <CardDescription>
                  Access location-specific disease outbreak information based on your pincode
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Health Advisories</CardTitle>
                <CardDescription>
                  Receive expert advice and preventive measures for diseases in your area
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Alerts Section */}
      {recentAlerts.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Recent Health Alerts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentAlerts.map((alert) => (
                <DiseaseAlertCard
                  key={alert.id}
                  pincode={alert.pincode}
                  diseaseName={alert.disease_name}
                  cases={alert.cases}
                  date={alert.date}
                  advice={alert.advice}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Stay Protected, Stay Informed</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust our platform for real-time health information
          </p>
          <Button size="lg" onClick={() => navigate("/chatbot")}>
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
