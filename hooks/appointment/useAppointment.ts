"use client";

import { AppointmentsApi } from "@/lib/api/appointment";
import { AppointmentListQuery, AppointmentListResponse, UpdateAppointmentRequest } from "@/types/interfaces/api/appointment";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const appointmentsKey = {
  all: ["appointment"] as const,
  list: (q: AppointmentListQuery = {}) => [...appointmentsKey.all, "list", q] as const,
  detail: (id: number) => [...appointmentsKey.all, "detail", id] as const,
};

export function useAppointments(query: AppointmentListQuery) {
  return useQuery<AppointmentListResponse>({
    queryKey: appointmentsKey.list(query),
    queryFn: () => AppointmentsApi.getListAppointment(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useAppointmentDetail(appointmentId: number) {
  return useQuery({
    queryKey: appointmentsKey.detail(appointmentId),
    queryFn: () => AppointmentsApi.getOneAppointment(appointmentId),
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!appointmentId,
  });
}

export function useUpdateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: UpdateAppointmentRequest }) =>
      AppointmentsApi.updateAppointment(payload.id, payload.data),
    onSuccess: (_data, variables) => {
      // Invalidate list + detail
      qc.invalidateQueries({ queryKey: appointmentsKey.all });
      qc.invalidateQueries({ queryKey: appointmentsKey.detail(variables.id) });
    },
  });
}
