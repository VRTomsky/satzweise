import type { ReactNode } from 'react';
import { Button } from './Button';
import { Sheet } from './Sheet';

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Sheet
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant={danger ? 'danger' : 'primary'} block onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="ghost" block onClick={onCancel}>
            Abbrechen
          </Button>
        </>
      }
    >
      {children}
    </Sheet>
  );
}
