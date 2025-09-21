import { Row } from './Row';
import { Method } from './Method';

export interface HistoryAnalyticsItem {
  api_url: string;
  created_at: Date;
  duration_ms: number;
  error: string | null;
  id: number;
  method: Method;
  request_body: string;
  request_headers: Row[];
  request_size: number;
  response_size: number;
  status_code: number;
  url: string;
}

export interface HistoryAnalyticsProps {
  history: HistoryAnalyticsItem[];
  tableHeaders: string[];
  onClickNavigator: (route: string) => void;
}
