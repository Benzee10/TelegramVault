import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CampaignTable from "@/components/campaign-table";
import CreateCampaignModal from "@/components/modals/create-campaign-modal";

export default function Campaigns() {
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600">Create and manage your messaging campaigns</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <CampaignTable onCreateCampaign={() => setShowCreateCampaignModal(true)} />
      </div>

      <CreateCampaignModal 
        open={showCreateCampaignModal} 
        onOpenChange={setShowCreateCampaignModal} 
      />
    </div>
  );
}
