// app/profile/[username]/page.tsx

import ProfileSection from "@/components/ProfileSection";

export default function ProfilePage({ params }: { params: { username: string } }) {
  return <ProfileSection username={params.username} />;
}
