
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface ThesisFormData {
  title: string;
  author: string;
  coAuthor: string;
  college: string;
  department: string;
  year: number;
  abstract: string;
  keywords: string;
  advisor: string;
}

type DepartmentsType = Record<string, string[]>;

interface ThesisUploadFormProps {
  formData: ThesisFormData;
  setFormData: React.Dispatch<React.SetStateAction<ThesisFormData>>;
  colleges: { id: string; name: string; fullName: string }[];
  departments: DepartmentsType;
  isExtracting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ThesisUploadForm: React.FC<ThesisUploadFormProps> = ({
  formData,
  setFormData,
  colleges,
  departments,
  isExtracting,
  onSubmit,
  onCancel,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Thesis Information</CardTitle>
      <CardDescription>
        Provide detailed information about the thesis
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form
        onSubmit={onSubmit}
        className="space-y-6"
        aria-disabled={isExtracting}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter thesis title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Primary Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Last Name, First Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coAuthor">Co-Author (Optional)</Label>
            <Input
              id="coAuthor"
              value={formData.coAuthor}
              onChange={(e) => setFormData({ ...formData, coAuthor: e.target.value })}
              placeholder="Last Name, First Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="advisor">Thesis Advisor *</Label>
            <Input
              id="advisor"
              value={formData.advisor}
              onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
              placeholder="Dr./Prof. Last Name, First Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="college">College *</Label>
            <Select
              value={formData.college}
              onValueChange={(value) => setFormData({ ...formData, college: value, department: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select college" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((college) => (
                  <SelectItem key={college.id} value={college.id}>
                    {college.name} - {college.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
              disabled={!formData.college}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {formData.college &&
                  departments[formData.college as keyof typeof departments]?.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              type="number"
              min="2000"
              max={new Date().getFullYear()}
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="Separate keywords with commas"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="abstract">Abstract *</Label>
          <Textarea
            id="abstract"
            rows={6}
            value={formData.abstract}
            onChange={(e) =>
              setFormData({ ...formData, abstract: e.target.value })
            }
            placeholder="Enter the thesis abstract"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isExtracting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-dlsl-green hover:bg-dlsl-green-dark text-white"
            disabled={isExtracting}
          >
            Upload Thesis
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
);

export default ThesisUploadForm;
