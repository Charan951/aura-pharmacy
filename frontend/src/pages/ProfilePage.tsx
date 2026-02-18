import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: { pathname: "/profile" } }} replace />;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 md:py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="text-sm font-medium">{user.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="text-sm font-medium capitalize">{user.role}</p>
          </div>
          <div className="pt-2">
            <Button type="button" variant="outline" size="sm" disabled>
              Edit profile (coming soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;

