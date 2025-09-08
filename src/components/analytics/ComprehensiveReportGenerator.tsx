import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Calendar, TrendingUp, Users, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface ReportGeneratorProps {
  onGenerateReport?: (reportConfig: ReportConfig) => void;
}

interface ReportConfig {
  type: 'security' | 'analytics' | 'compliance' | 'performance';
  dateRange: {
    start: string;
    end: string;
  };
  format: 'pdf' | 'csv' | 'json';
  includeSections: string[];
}

const ComprehensiveReportGenerator: React.FC<ReportGeneratorProps> = ({
  onGenerateReport
}) => {
  const [reportType, setReportType] = useState<string>('security');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState<string>('pdf');
  const [selectedSections, setSelectedSections] = useState<string[]>(['overview']);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      value: 'security',
      label: 'Security Report',
      icon: Shield,
      description: 'Comprehensive security analysis and threat assessment'
    },
    {
      value: 'analytics',
      label: 'Analytics Report',
      icon: TrendingUp,
      description: 'User behavior, system usage, and performance metrics'
    },
    {
      value: 'compliance',
      label: 'Compliance Report',
      icon: FileText,
      description: 'Regulatory compliance and audit trail documentation'
    },
    {
      value: 'performance',
      label: 'Performance Report',
      icon: Users,
      description: 'System performance, uptime, and optimization recommendations'
    }
  ];

  const availableSections = {
    security: [
      { id: 'overview', label: 'Executive Summary' },
      { id: 'alerts', label: 'Security Alerts Analysis' },
      { id: 'sessions', label: 'Session Activity Report' },
      { id: 'anomalies', label: 'Anomaly Detection Results' },
      { id: 'vulnerabilities', label: 'Vulnerability Assessment' },
      { id: 'recommendations', label: 'Security Recommendations' }
    ],
    analytics: [
      { id: 'overview', label: 'Executive Summary' },
      { id: 'usage', label: 'Usage Statistics' },
      { id: 'trends', label: 'Trend Analysis' },
      { id: 'demographics', label: 'User Demographics' },
      { id: 'performance', label: 'Performance Metrics' },
      { id: 'forecasting', label: 'Growth Forecasting' }
    ],
    compliance: [
      { id: 'overview', label: 'Executive Summary' },
      { id: 'audit_trail', label: 'Audit Trail' },
      { id: 'data_handling', label: 'Data Handling Compliance' },
      { id: 'access_controls', label: 'Access Control Review' },
      { id: 'retention', label: 'Data Retention Compliance' },
      { id: 'certifications', label: 'Compliance Certifications' }
    ],
    performance: [
      { id: 'overview', label: 'Executive Summary' },
      { id: 'uptime', label: 'System Uptime Analysis' },
      { id: 'response_times', label: 'Response Time Metrics' },
      { id: 'resource_usage', label: 'Resource Utilization' },
      { id: 'bottlenecks', label: 'Performance Bottlenecks' },
      { id: 'optimization', label: 'Optimization Recommendations' }
    ]
  };

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (selectedSections.length === 0) {
      toast.error('Please select at least one report section');
      return;
    }

    const reportConfig: ReportConfig = {
      type: reportType as ReportConfig['type'],
      dateRange: {
        start: startDate,
        end: endDate
      },
      format: format as ReportConfig['format'],
      includeSections: selectedSections
    };

    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (onGenerateReport) {
        onGenerateReport(reportConfig);
      }
      
      toast.success(`${reportTypes.find(t => t.value === reportType)?.label} generated successfully!`);
    } catch (error) {
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentSections = availableSections[reportType as keyof typeof availableSections] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Comprehensive Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map(type => {
                const IconComponent = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <Label htmlFor="format">Export Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="csv">CSV Spreadsheet</SelectItem>
              <SelectItem value="json">JSON Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Section Selection */}
        <div className="space-y-3">
          <Label>Report Sections</Label>
          <div className="grid grid-cols-2 gap-2">
            {currentSections.map(section => (
              <div key={section.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={section.id}
                  checked={selectedSections.includes(section.id)}
                  onChange={() => handleSectionToggle(section.id)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor={section.id} className="text-sm">
                  {section.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Calendar className="w-4 h-4 mr-2 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>

        {/* Preview Info */}
        {startDate && endDate && selectedSections.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Report Preview</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div>Type: {reportTypes.find(t => t.value === reportType)?.label}</div>
              <div>Period: {startDate} to {endDate}</div>
              <div>Sections: {selectedSections.length} selected</div>
              <div>Format: {format.toUpperCase()}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComprehensiveReportGenerator;