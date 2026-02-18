import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AdminPlaceholderPageProps = {
  title: string;
  description: ReactNode;
};

const AdminPlaceholderPage = ({ title, description }: AdminPlaceholderPageProps) => {
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">{description}</CardContent>
    </Card>
  );
};

export default AdminPlaceholderPage;

