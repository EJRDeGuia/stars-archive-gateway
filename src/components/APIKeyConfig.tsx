
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Eye, EyeOff } from 'lucide-react';
import { semanticSearchService } from '@/services/semanticSearch';

interface APIKeyConfigProps {
  onApiKeySet?: () => void;
}

const APIKeyConfig: React.FC<APIKeyConfigProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSet, setIsSet] = useState(!!localStorage.getItem('openai_api_key'));

  const handleSetApiKey = () => {
    if (apiKey.trim()) {
      semanticSearchService.setApiKey(apiKey.trim());
      setIsSet(true);
      setApiKey('');
      onApiKeySet?.();
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setIsSet(false);
    setApiKey('');
  };

  if (isSet) {
    return (
      <Card className="mb-6 border-dlsl-green/20 bg-dlsl-green/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-dlsl-green" />
              <span className="text-sm text-dlsl-green font-medium">OpenAI API Key configured</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleRemoveApiKey}>
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Key className="w-6 h-6 text-yellow-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 mb-2">Configure OpenAI API Key</h3>
            <p className="text-yellow-700 text-sm mb-4">
              To enable semantic search with text-embedding-3-small, please provide your OpenAI API key.
              This will be stored locally in your browser.
            </p>
            <div className="space-y-3">
              <div>
                <Label htmlFor="apiKey" className="text-yellow-900">OpenAI API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button onClick={handleSetApiKey} disabled={!apiKey.trim()}>
                Set API Key
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyConfig;
