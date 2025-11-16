import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import UsersPageContent from "./users-content";

export default function UsersPage() {
  return (
    <ProtectedLayout>
      <UsersPageContent />
    </ProtectedLayout>
  )
}
