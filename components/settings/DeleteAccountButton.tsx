'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DeleteAccountModal } from './DeleteAccountModal';

export function DeleteAccountButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setModalOpen(true)}
        className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
      >
        Delete Account
      </Button>

      <DeleteAccountModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
