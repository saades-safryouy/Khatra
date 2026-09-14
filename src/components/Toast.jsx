import React from 'react';
import { useData } from '../context/DataContext';

export function Toast() {
  const { toast } = useData();
  if (!toast) return null;

  return (
    <div className={`toast ${toast.type || 'success'}`}>
      {toast.message}
    </div>
  );
}

export default Toast;
