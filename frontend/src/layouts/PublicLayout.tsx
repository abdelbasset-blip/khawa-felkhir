import React, { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { Navbar } from "../components/public/Navbar";
import { Footer } from "../components/public/Footer";
import { DonationModal } from "../components/public/DonationModal";

export interface PublicLayoutContextType {
  openDonation: (eventTitle?: string) => void;
}

export const PublicLayout: React.FC = () => {
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [donationEventTitle, setDonationEventTitle] = useState<string | undefined>(undefined);

  const openDonation = (eventTitle?: string) => {
    setDonationEventTitle(eventTitle);
    setIsDonationOpen(true);
  };

  const closeDonation = () => {
    setIsDonationOpen(false);
    setDonationEventTitle(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar onOpenDonation={() => openDonation()} />

      <main className="flex-1">
        <Outlet context={{ openDonation } satisfies PublicLayoutContextType} />
      </main>

      <Footer onOpenDonation={() => openDonation()} />

      <DonationModal
        isOpen={isDonationOpen}
        onClose={closeDonation}
        defaultEventTitle={donationEventTitle}
      />
    </div>
  );
};

export const usePublicLayout = (): PublicLayoutContextType => {
  return useOutletContext<PublicLayoutContextType>();
};
