import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              Public Health Awareness
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/chatbot">
              <Button variant="ghost">Health Chatbot</Button>
            </Link>
            
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline">Admin Panel</Button>
                  </Link>
                )}
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
