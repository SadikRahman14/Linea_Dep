import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import MemberSelector from './MemberSelector';
import { apiClient } from '@/lib/api-client';
import { ADD_MEMBERS } from '@/utils/constants';

export default function AddMembersDialog({ open, onOpenChange, channelId, allContacts, refreshMembers }) {
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    if (!open) setSelectedContacts([]);
  }, [open]);

  const addMembers = async () => {
    if (selectedContacts.length === 0) return;

    try {
      await apiClient.post(`${ADD_MEMBERS}/${channelId}`,
        { userIds: selectedContacts.map(c => c.id || c._id) },
        { withCredentials: true }
      );
      refreshMembers();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to add members', error);
      alert('Failed to add members');
    }
  };

  return (
    <div>Sadik</div>
  );
}
