import React from 'react';
import MultipleSelector from '@/components/ui/multiple-select';

export default function MemberSelector({ allContacts, selectedContacts, setSelectedContacts }) {
  return (
    <div className="mb-auto">
      <MultipleSelector
        className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white z-50"
        defaultOptions={allContacts}
        placeholder="Search Contacts"
        value={selectedContacts}
        onChange={setSelectedContacts}
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600">No Result Found</p>
        }
      />
    </div>
  );
}
