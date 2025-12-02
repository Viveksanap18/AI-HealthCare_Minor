import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface DiseaseAlertCardProps {
  pincode: string;
  diseaseName: string;
  cases: number;
  date: string;
  advice: string;
}

export const DiseaseAlertCard = ({
  pincode,
  diseaseName,
  cases,
  date,
  advice,
}: DiseaseAlertCardProps) => {
  const getSeverityColor = (caseCount: number) => {
    if (caseCount > 100) return "destructive";
    if (caseCount > 50) return "default";
    return "secondary";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-lg">{diseaseName}</CardTitle>
          </div>
          <Badge variant={getSeverityColor(cases)}>
            {cases} cases
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Area:</span> Pincode {pincode}
          </p>
          <p>
            <span className="font-semibold">Reported:</span>{" "}
            {new Date(date).toLocaleDateString()}
          </p>
          <div className="mt-4 p-3 bg-secondary rounded-lg">
            <p className="font-semibold text-secondary-foreground mb-1">
              Health Advisory:
            </p>
            <p className="text-muted-foreground">{advice}</p>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Disclaimer:</span> This response is based on available data. We are not 100% accurate. For medical concerns, please contact a doctor.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
