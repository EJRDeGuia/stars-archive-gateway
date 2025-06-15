
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminRecentThesesProps {
  theses: any[];
  thesesLoading: boolean;
  colleges: any[];
}

const AdminRecentTheses: React.FC<AdminRecentThesesProps> = ({
  theses,
  thesesLoading,
  colleges
}) => (
  <Card className="bg-white border-gray-200">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
        <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        Recent Thesis Submissions
      </CardTitle>
    </CardHeader>
    <CardContent>
      {thesesLoading ? (
        <div className="text-gray-400 text-center py-8">Loading recent theses...</div>
      ) : theses.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No thesis submissions yet.</div>
      ) : (
        <div className="space-y-4">
          {theses.map((thesis) => (
            <div key={thesis.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{thesis.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{thesis.author}</span>
                  <span>•</span>
                  <Badge variant="secondary" className="bg-dlsl-green/10 text-dlsl-green border-0">
                    {(colleges.find(c => c.id === thesis.college_id)?.name) || thesis.college_id}
                  </Badge>
                  <span>•</span>
                  <span>{thesis.year || (thesis.publish_date && thesis.publish_date.slice(0, 4))}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="border-gray-300">
                  <Eye className="w-4 h-4 mr-1 text-dlsl-green" />
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default AdminRecentTheses;
