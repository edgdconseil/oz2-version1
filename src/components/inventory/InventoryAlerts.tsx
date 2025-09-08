
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InventoryAlert } from '@/types';

interface InventoryAlertsProps {
  alerts: InventoryAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
}

const InventoryAlerts = ({ alerts, onAcknowledgeAlert }: InventoryAlertsProps) => {
  return null;
};

export default InventoryAlerts;
