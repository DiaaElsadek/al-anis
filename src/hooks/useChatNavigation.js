import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { createOrGetChat } from "@/api/chat";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/lib/constants";

/**
 * Shared hook for initiating a chat from a service request (D3).
 * Used by ProviderDashboardPage, ProviderRequestsPage, and ClientRequestsPage.
 *
 * @returns {{ startChat: (serviceRequestId: string) => void, isStartingChat: boolean }}
 */
export function useChatNavigation() {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const { user } = useAuth();

  const isProvider = user?.role === UserRole.SERVICE_PROVIDER;
  const chatBasePath = isProvider ? "/provider/chats" : "/app/chats";

  const mutation = useMutation({
    mutationFn: (serviceRequestId) => createOrGetChat(serviceRequestId),
    onSuccess: (data) => {
      const chatId = data?.id || data?.chatId || data;
      navigate(`${chatBasePath}?active=${chatId}`);
    },
    onError: () => {
      toast.error(t("error"), {
        description: t("chatStartFailed") || "Could not start chat.",
      });
    },
  });

  return {
    startChat: (serviceRequestId) => mutation.mutate(serviceRequestId),
    isStartingChat: mutation.isPending,
  };
}
