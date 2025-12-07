import { DealDetail, EmployeeSummary, Payout } from '@sotrudniki/shared';

const BASE_URL = '/api';
const EMPLOYEE_ID = 1;

const handle = async <T>(res: Response) => {
  if (!res.ok) {
    throw new Error(`Ошибка загрузки: ${res.status}`);
  }
  return (await res.json()) as T;
};

export const fetchSummary = async (): Promise<EmployeeSummary> => {
  const res = await fetch(`${BASE_URL}/employees/${EMPLOYEE_ID}/summary`);
  return handle<EmployeeSummary>(res);
};

export const fetchPayouts = async (): Promise<Payout[]> => {
  const res = await fetch(`${BASE_URL}/employees/${EMPLOYEE_ID}/payouts`);
  return handle<Payout[]>(res);
};

export const fetchDealDetails = async (): Promise<DealDetail[]> => {
  const res = await fetch(`${BASE_URL}/employees/${EMPLOYEE_ID}/deals`);
  return handle<DealDetail[]>(res);
};
